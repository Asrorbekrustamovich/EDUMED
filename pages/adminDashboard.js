window.setAdminTab = function(tab) {
  window.app.adminActiveTab = tab; // window.app — bu state obyekti
  window.render();
};

window.toggleAddVolunteerModal = function(show) {
  window.app.showAddVolunteerModal = show;
  window.render();
};

window.deleteVolunteerProject = async function(id) {
  if (!confirm('Haqiqatan ham bu loyihani o\'chirmoqchimisiz?')) return;
  
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  try {
    const res = await fetch(`${window.API}/api/volunteer/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (res.ok) {
      await window.fetchVolunteerProjects();
      window.render();
      alert('Loyiha muvaffaqiyatli o\'chirildi!');
    } else {
      alert('Loyihani o\'chirib bo\'lmadi.');
    }
  } catch (err) {
    console.error(err);
    alert('Tizim xatosi.');
  }
};

window.createVolunteerProject = async function(e) {
  e.preventDefault();
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  const title = document.getElementById('new-proj-title').value;
  const desc = document.getElementById('new-proj-desc').value;
  const date = document.getElementById('new-proj-date').value;
  const location = document.getElementById('new-proj-location').value;
  const slots = parseInt(document.getElementById('new-proj-slots').value) || 20;
  const points = parseInt(document.getElementById('new-proj-points').value) || 500;
  const avatar = document.getElementById('new-proj-avatar').value || '🏥';
  
  try {
    const res = await fetch(`${window.API}/api/volunteer/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar,
        title,
        description: desc,
        date,
        location,
        slotsMax: slots,
        pointsReward: points
      })
    });
    
    if (res.ok) {
      window.app.showAddVolunteerModal = false;
      await window.fetchVolunteerProjects();
      window.render();
      alert('Yangi volontyorlik loyihasi muvaffaqiyatli yaratildi va ma\'lumotlar bazasiga saqlandi!');
    } else {
      alert('Loyihani yaratib bo\'lmadi.');
    }
  } catch (err) {
    console.error(err);
    alert('Tizim xatosi.');
  }
};

export function renderAdminDashboard(state, icons) {
  const activeTab = state.adminActiveTab || 'system';
  
  // Render tabs header
  const tabsHeaderHtml = `
    <div class="flex gap-4 mb-6 border-b" style="border-bottom:1px solid var(--border-light); padding-bottom:8px; margin: 0 32px;">
      <button class="btn btn-sm ${activeTab === 'system' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setAdminTab('system')" style="font-size:0.85rem">
        ⚙️ Tizim Boshqaruvi
      </button>
      <button class="btn btn-sm ${activeTab === 'volunteers' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setAdminTab('volunteers')" style="font-size:0.85rem">
        🤝 Volontyorlik Loyihalari (${state.volunteerProjects.length})
      </button>
    </div>
  `;

  let mainBodyHtml = '';

  if (activeTab === 'system') {
    const d = state.adminData;
    if (!d) {
      mainBodyHtml = `<div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);">Ma'lumotlar yuklanmoqda...</div>`;
    } else {
      const c = d.counts;
      const total = c.users || 1;
      const pctS = Math.round((c.students / total) * 100);
      const pctT = Math.round((c.teachers / total) * 100);
      const pctA = 100 - pctS - pctT;

      // Foydalanuvchilar qidiruvi (lokal filtr)
      const q = (state.adminUserQuery || '').toLowerCase();
      const usersFiltered = d.users.filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      const usersShown = usersFiltered.slice(0, state.showAllAdminUsers ? 1000 : 8);

      const roleBadge = (r) => r === 'admin'
        ? '<span class="badge badge-gray" style="background:#000;color:#fff">Admin</span>'
        : r === 'teacher' ? '<span class="badge badge-warning">O\'qituvchi</span>'
        : '<span class="badge badge-primary">Talaba</span>';

      const fmtTime = (t) => new Date(t).toLocaleDateString('uz-UZ') + ' ' + new Date(t).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const backups = state.backups || [];

      mainBodyHtml = `
      <!-- Stats (real) -->
      <div class="grid-5 mb-6 animate-in">
        <div class="kpi-card text-center p-3">
          <div class="text-2xl mb-1">👥</div>
          <div class="kpi-value text-lg">${c.users}</div>
          <div class="kpi-label justify-center">Foydalanuvchilar</div>
        </div>
        <div class="kpi-card text-center p-3">
          <div class="text-2xl mb-1">👨‍🏫</div>
          <div class="kpi-value text-lg">${c.teachers}</div>
          <div class="kpi-label justify-center">O'qituvchilar</div>
        </div>
        <div class="kpi-card text-center p-3">
          <div class="text-2xl mb-1">👨‍🎓</div>
          <div class="kpi-value text-lg">${c.students}</div>
          <div class="kpi-label justify-center">Talabalar</div>
        </div>
        <div class="kpi-card text-center p-3">
          <div class="text-2xl mb-1">⚙️</div>
          <div class="kpi-value text-lg text-primary">${c.admins}</div>
          <div class="kpi-label justify-center">Adminlar</div>
        </div>
        <div class="kpi-card text-center p-3" style="background:var(--green-light);border-color:var(--green)">
          <div class="text-2xl mb-1">🟢</div>
          <div class="kpi-value text-lg text-green-dark">Faol</div>
          <div class="kpi-label justify-center text-green-dark">Baza: ${d.dbSizeMB} MB</div>
        </div>
      </div>

      <!-- Users Table & Distribution (real) -->
      <div class="grid-32 mb-6 animate-in animate-delay-1">
        <div class="card p-0" style="overflow:hidden">
          <div class="card-header px-4 pt-4 mb-2 flex-between">
            <h3 class="card-title">Foydalanuvchilar Ro'yxati (${usersFiltered.length})</h3>
            <div class="search-bar">
              <span class="search-icon">${icons.search}</span>
              <input type="text" class="input" id="admin-user-search" value="${(state.adminUserQuery || '').replace(/"/g, '&quot;')}" placeholder="Izlash..." style="width:170px;padding:6px 12px 6px 32px;height:32px"
                onkeydown="if(event.key==='Enter'){window.app.adminUserQuery=this.value;window.render();}">
            </div>
          </div>
          <div class="table-container border-0 border-radius-0" style="border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th>F.I.Sh</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Keyslar</th>
                  <th>Ball</th>
                </tr>
              </thead>
              <tbody>
                ${usersShown.map(u => `
                  <tr>
                    <td class="font-medium">${u.name}</td>
                    <td class="text-secondary text-sm">${u.email}</td>
                    <td>${roleBadge(u.role)}</td>
                    <td>${u.casesDone}</td>
                    <td class="font-semibold">${u.points}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${usersFiltered.length > 8 ? `<div style="padding:10px;text-align:center;"><button class="btn btn-ghost btn-sm" onclick="window.app.showAllAdminUsers=!window.app.showAllAdminUsers;window.render();">${state.showAllAdminUsers ? 'Qisqartirish' : `Barchasini ko'rsatish (${usersFiltered.length})`}</button></div>` : ''}
        </div>

        <div class="card flex flex-col flex-center text-center">
          <h3 class="card-title w-full text-left mb-6">Rol Taqsimoti (real)</h3>

          <div class="circular-progress mb-6" style="width:160px;height:160px">
            <svg width="160" height="160" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#000" stroke-width="4" stroke-dasharray="100, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--warning)" stroke-width="4" stroke-dasharray="${pctS + pctT}, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-width="4" stroke-dasharray="${pctS}, 100" />
            </svg>
            <div class="value flex-col">
              <span class="text-2xl font-bold">${c.users}</span>
              <span class="text-xs text-muted">Jami</span>
            </div>
          </div>

          <div class="flex-col gap-2 w-full">
            <div class="flex-between text-sm"><div class="flex items-center gap-2"><div class="badge-dot bg-primary"></div>Talabalar</div><span class="font-semibold">${pctS}% (${c.students})</span></div>
            <div class="flex-between text-sm"><div class="flex items-center gap-2"><div class="badge-dot bg-warning"></div>O'qituvchilar</div><span class="font-semibold">${pctT}% (${c.teachers})</span></div>
            <div class="flex-between text-sm"><div class="flex items-center gap-2"><div class="badge-dot" style="background:#000"></div>Adminlar</div><span class="font-semibold">${pctA}% (${c.admins})</span></div>
          </div>
        </div>
      </div>

      <!-- Logs & Backups (real) -->
      <div class="grid-2 animate-in animate-delay-2">
        <div class="card">
          <div class="flex-between mb-4">
            <h3 class="card-title">Faollik Jurnali (real)</h3>
            <button class="btn btn-ghost btn-sm" onclick="window.exportActivityCSV()">CSV yuklash</button>
          </div>

          <div class="timeline">
            ${d.activity.length === 0 ? `<p class="text-sm text-secondary" style="text-align:center;padding:20px;">Hozircha faoliyat yo'q.</p>` : ''}
            ${d.activity.slice(0, 6).map(a => `
              <div class="flex items-start gap-3 mb-4">
                <span class="badge ${a.color === '#22C55E' ? 'badge-success' : a.color === '#EF4444' ? 'badge-danger' : a.color === '#6B7280' ? 'badge-gray' : 'badge-primary'} text-xs mt-1">${a.color === '#6B7280' ? 'USER' : 'KEYS'}</span>
                <div>
                  <div class="text-sm font-semibold">${a.user} ${a.action}</div>
                  <div class="text-xs text-secondary mt-1">${fmtTime(a.time)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="flex-between mb-4">
            <h3 class="card-title">Zaxira Nusxalari (Backup)</h3>
            <button class="btn btn-primary btn-sm" onclick="window.createBackup()">Yangi Yaratish</button>
          </div>

          <div class="flex-col gap-3">
            ${backups.length === 0 ? `<p class="text-sm text-secondary" style="text-align:center;padding:20px;">Hali zaxira nusxa yaratilmagan. "Yangi Yaratish" tugmasini bosing — bazaning haqiqiy nusxasi (backend/backups papkasida) saqlanadi.</p>` : ''}
            ${backups.map(b => `
              <div class="card card-flat p-3 flex-between">
                <div>
                  <div class="text-sm font-semibold mb-1">${b.file}</div>
                  <div class="text-xs text-secondary">${fmtTime(b.createdAt)} • Hajmi: ${b.sizeMB} MB</div>
                </div>
                <span class="badge badge-success">Saqlangan</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    }
  } else {
    // volunteers management tab
    mainBodyHtml = `
      <div class="card p-0 animate-in animate-delay-1" style="overflow:hidden">
        <div class="card-header px-4 pt-4 mb-2 flex-between">
          <div>
            <h3 class="card-title">Volontyorlik Loyihalari Ro'yxati</h3>
            <p class="text-xs text-secondary">Loyihalarni o'chirish, to'ldirilish foizini kuzatish va yangi loyihalar qo'shish paneli</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.toggleAddVolunteerModal(true)">
            ${icons.plus} Yangi Loyiha
          </button>
        </div>
        <div class="table-container border-0 border-radius-0" style="border-radius:0;">
          <table>
            <thead>
              <tr>
                <th>Loyiha nomi</th>
                <th>Sana va Vaqt</th>
                <th>Manzil</th>
                <th>Ariza topshirganlar (Joylar)</th>
                <th>Mukofot Ball</th>
                <th style="width:120px">Amallar</th>
              </tr>
            </thead>
            <tbody>
              ${state.volunteerProjects.map(proj => {
                const applied = state.appliedVolunteers || [];
                const isApplied = applied.includes(proj.id);
                const currentSlots = isApplied ? proj.slotsCurrent + 1 : proj.slotsCurrent;
                
                return `
                  <tr>
                    <td class="font-medium" style="display:flex; align-items:center; gap:8px;">
                      <span style="font-size:1.3rem">${proj.avatar}</span>
                      <span>${proj.title}</span>
                    </td>
                    <td class="text-sm text-secondary">${proj.date}</td>
                    <td class="text-sm text-secondary">${proj.location}</td>
                    <td>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold">${currentSlots} / ${proj.slotsMax}</span>
                        <div class="progress-bar" style="width:60px; height:6px;"><div class="progress-fill" style="width: ${Math.round((currentSlots/proj.slotsMax)*100)}%"></div></div>
                      </div>
                    </td>
                    <td><span class="badge badge-success">+${proj.pointsReward} ball</span></td>
                    <td>
                      <button class="btn btn-outline btn-sm text-danger" onclick="window.deleteVolunteerProject('${proj.id}')" style="padding:4px 8px; font-size:0.75rem;">
                        O'chirish
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Render Modal Overlay if showAddVolunteerModal is true
  const modalHtml = state.showAddVolunteerModal ? `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(4px);">
      <div class="card animate-in" style="width:480px; max-width:90%; padding:24px;">
        <div class="flex-between mb-4">
          <h3 class="card-title">Yangi Volontyorlik Loyihasi Yaratish</h3>
          <button class="btn-icon" onclick="window.toggleAddVolunteerModal(false)">❌</button>
        </div>
        <form onsubmit="window.createVolunteerProject(event)">
          <div class="form-group mb-3">
            <label class="form-label" style="font-size:0.8rem">Loyiha Sarlavhasi</label>
            <input type="text" id="new-proj-title" class="input" placeholder="Masalan: Shifoxona xayriya tashrifi" required>
          </div>
          <div class="form-group mb-3">
            <label class="form-label" style="font-size:0.8rem">Tavsif</label>
            <textarea id="new-proj-desc" class="input" placeholder="Dasturning qisqacha tavsifi" style="height:60px; resize:none;" required></textarea>
          </div>
          <div class="grid-2 gap-3 mb-3">
            <div class="form-group">
              <label class="form-label" style="font-size:0.8rem">Sana va Vaqt</label>
              <input type="text" id="new-proj-date" class="input" placeholder="20-Iyul, 12:00 - 15:00" required>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.8rem">Manzil</label>
              <input type="text" id="new-proj-location" class="input" placeholder="Masalan: Bolalar shifoxonasi" required>
            </div>
          </div>
          <div class="grid-3 gap-3 mb-4">
            <div class="form-group">
              <label class="form-label" style="font-size:0.8rem">Maks. Joylar</label>
              <input type="number" id="new-proj-slots" class="input" value="20" required>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.8rem">Mukofot Ball</label>
              <input type="number" id="new-proj-points" class="input" value="500" required>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.8rem">Belgi (Emoji)</label>
              <select id="new-proj-avatar" class="input" style="padding:6px;">
                <option value="🏥">🏥 Shifoxona</option>
                <option value="❤️">❤️ Donorlik</option>
                <option value="📚">📚 Ta'lim</option>
                <option value="🩺">🩺 Ko'rik</option>
                <option value="🚑">🚑 Tez Yordam</option>
                <option value="🦷">🦷 Stomatologiya</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="btn btn-outline" onclick="window.toggleAddVolunteerModal(false)">Bekor qilish</button>
            <button type="submit" class="btn btn-primary">Loyihani Yaratish</button>
          </div>
        </form>
      </div>
    </div>
  ` : '';

  return `
    <div class="page-header animate-in">
      <div>
        <h1 style="font-size:1.4rem">Tizim Boshqaruvi</h1>
        <div class="text-sm text-secondary">Administrator paneli</div>
      </div>
      <div class="page-header-actions">
        <span class="badge badge-gray text-xs">${(state.backups && state.backups[0]) ? 'Oxirgi backup: ' + new Date(state.backups[0].createdAt).toLocaleString('uz-UZ') : "Backup hali yaratilmagan"}</span>
      </div>
    </div>
    
    ${tabsHeaderHtml}
    
    <div class="page-body">
      ${mainBodyHtml}
    </div>

    ${modalHtml}
  `;
}
