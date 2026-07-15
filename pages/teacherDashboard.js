// O'qituvchi Dashboard — barcha raqamlar ma'lumotlar bazasidan (real)
export function renderTeacherDashboard(state, icons) {
  const d = state.teacherData;

  if (!d) {
    return `
      <div class="page-header animate-in"><h1 style="font-size:1.4rem">O'qituvchi Dashboard</h1></div>
      <div class="page-body"><div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);">Ma'lumotlar yuklanmoqda...</div></div>
    `;
  }

  const statusBadge = (s) => {
    if (s === "A'lo") return 'badge-success';
    if (s === 'Yaxshi') return 'badge-primary';
    if (s === 'Qoniqarli') return 'badge-gray';
    if (s === 'Diqqat kerak') return 'badge-danger';
    return 'badge-gray';
  };

  const dist = d.distribution;
  const distTotal = dist.total || 1;
  const pct = (n) => Math.round((n / distTotal) * 100);

  const initials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const shown = state.showAllStudents ? d.students : d.students.slice(0, 6);

  return `
    <div class="page-header animate-in">
      <div>
        <h1 style="font-size:1.4rem">O'qituvchi Dashboard</h1>
        <div class="text-sm text-secondary">Guruhlar tahlili va kontent boshqaruvi — jonli ma'lumotlar</div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="window.navigate('scenario-builder')">${icons.plus} Yangi Keys Yaratish</button>
      </div>
    </div>

    <div class="page-body">
      <!-- KPI Row (real) -->
      <div class="grid-4 mb-6 animate-in animate-delay-1">
        <div class="kpi-card">
          <div class="kpi-label">Jami Talabalar</div>
          <div class="kpi-value">${d.totalStudents}</div>
          <div class="kpi-trend ${d.newThisWeek > 0 ? 'up' : 'text-muted'}">${d.newThisWeek > 0 ? `${icons.arrowUp} ${d.newThisWeek} ta yangi (7 kun)` : "Bu hafta yangi talaba yo'q"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Faol Keyslar</div>
          <div class="kpi-value text-primary">${d.activeCases}</div>
          <div class="kpi-trend text-muted">Bazadagi faol keyslar</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">O'rtacha Etika Bali</div>
          <div class="kpi-value ${d.avgEthics >= 70 ? 'text-green' : d.avgEthics >= 50 ? 'text-warning' : 'text-danger'}">${d.avgEthics}%</div>
          <div class="kpi-trend text-muted">Etika testini topshirganlar bo'yicha</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Bugun Yakunlangan</div>
          <div class="kpi-value">${d.todaySessions}</div>
          <div class="kpi-trend text-muted">ta simulyatsiya sessiyasi</div>
        </div>
      </div>

      <!-- Table & Chart -->
      <div class="grid-32 mb-6 animate-in animate-delay-2">
        <div class="card p-0" style="overflow: hidden;">
          <div class="card-header px-6 pt-6 mb-4">
            <h3 class="card-title">Talabalar O'zlashtirishi (${d.students.length} ta talaba)</h3>
            <button class="btn btn-ghost btn-sm" onclick="window.app.showAllStudents = !window.app.showAllStudents; window.render();">${state.showAllStudents ? 'Qisqartirish' : 'Barchasi'}</button>
          </div>
          <div class="table-container border-0 border-radius-0" style="border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th>F.I.Sh</th>
                  <th>Keyslar</th>
                  <th>Kognitiv</th>
                  <th>Aksiologik</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                ${shown.length === 0 ? `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-secondary);">Hozircha ro'yxatdan o'tgan talabalar yo'q</td></tr>` : ''}
                ${shown.map(s => `
                  <tr style="cursor:pointer" onclick="window.openStudent('${s.id}')">
                    <td class="font-medium flex items-center gap-2">
                      <div class="avatar avatar-sm">${initials(s.name)}</div>
                      ${s.name}
                    </td>
                    <td>${s.casesDone}</td>
                    <td class="${s.cognitive >= 80 ? 'text-green' : s.cognitive >= 60 ? 'text-primary' : 'text-danger'} font-semibold">${s.cognitive}%</td>
                    <td class="${s.axiological >= 80 ? 'text-green' : s.axiological >= 60 ? 'text-primary' : 'text-danger'} font-semibold">${s.axiological}%</td>
                    <td><span class="badge ${statusBadge(s.status)}">${s.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title mb-2">Etika Bali Taqsimoti</h3>
          <p class="text-sm text-secondary mb-6">Faol talabalar (${dist.total} ta) bo'yicha real taqsimot</p>

          <div class="flex-col gap-4">
            <div>
              <div class="flex-between text-sm mb-1">
                <span>A'lo (86-100%)</span>
                <span class="font-semibold text-green">${pct(dist.alo)}% (${dist.alo} talaba)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill green" style="width: ${pct(dist.alo)}%"></div></div>
            </div>
            <div>
              <div class="flex-between text-sm mb-1">
                <span>Yaxshi (71-85%)</span>
                <span class="font-semibold text-primary">${pct(dist.yaxshi)}% (${dist.yaxshi} talaba)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width: ${pct(dist.yaxshi)}%"></div></div>
            </div>
            <div>
              <div class="flex-between text-sm mb-1">
                <span>Qoniqarli (56-70%)</span>
                <span class="font-semibold text-warning">${pct(dist.qoniqarli)}% (${dist.qoniqarli} talaba)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill warning" style="width: ${pct(dist.qoniqarli)}%"></div></div>
            </div>
            <div>
              <div class="flex-between text-sm mb-1">
                <span>Qoniqarsiz (0-55%)</span>
                <span class="font-semibold text-danger">${pct(dist.qoniqarsiz)}% (${dist.qoniqarsiz} talaba)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill danger" style="width: ${pct(dist.qoniqarsiz)}%"></div></div>
            </div>
            ${dist.total === 0 ? `<p class="text-xs text-muted">Talabalar hali keys yoki test topshirmagan.</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="grid-2 mb-6 animate-in animate-delay-3">
        <div class="card">
          <h3 class="card-title mb-4">Eng Qiyin Keyslar (natijalar bo'yicha)</h3>

          <div class="flex-col gap-3">
            ${d.hardestCases.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">Hali yetarli natijalar to'planmagan.</p>` : ''}
            ${d.hardestCases.map(c => `
              <div class="card card-flat p-3 flex items-center justify-between">
                <div>
                  <h4 class="font-semibold text-sm">${c.title}</h4>
                  <div class="text-xs text-secondary mt-1">O'rtacha natija: <span class="${c.avgScore < 50 ? 'text-danger' : c.avgScore < 70 ? 'text-warning' : 'text-green'} font-bold">${c.avgScore}%</span> • ${c.attempts} urinish</div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.navigate('content-management')">Boshqarish</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="flex-between mb-4">
            <h3 class="card-title">Tizim Signallari</h3>
          </div>

          <div class="flex-col gap-2">
            ${d.alerts.map(a => `
              <div class="notification-card p-3 ${a.type === 'red' ? 'unread' : ''}">
                <div class="notification-icon ${a.type} text-lg">${a.icon}</div>
                <div class="notification-body">
                  <div class="notification-title">${a.title}</div>
                  <div class="notification-desc">${a.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
