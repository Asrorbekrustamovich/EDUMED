// Profil — barcha raqamlar bazadan (state.profileData + state.userStats)
export function renderProfile(state, icons) {
  const p = state.profileData;
  const stats = state.userStats;

  if (!p) {
    return `
      <div class="page-header animate-in"><h1 style="font-size:1.4rem">Talaba Profili</h1></div>
      <div class="page-body"><div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);">Ma'lumotlar yuklanmoqda...</div></div>
    `;
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('uz-UZ');
  const memberSince = new Date(p.memberSince).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' });

  const achievements = (stats && stats.achievements) ? stats.achievements : [];
  const earnedCount = achievements.filter(a => a.earned).length;

  const showAll = state.showAllProfileHistory;
  const history = showAll ? p.results : p.results.slice(0, 5);

  return `
    <div class="page-header animate-in">
      <h1 style="font-size:1.4rem">Talaba Profili</h1>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="window.navigate('settings')">${icons.settings} Tahrirlash</button>
      </div>
    </div>

    <div class="page-body">
      <!-- Profile Header Card -->
      <div class="card mb-6 animate-in flex items-center gap-6" style="padding: 32px 40px; background: linear-gradient(135deg, var(--bg), var(--primary-50));">
        <div class="avatar avatar-xl bg-primary text-white" style="font-size:2.4rem">${state.user.initials}</div>
        <div>
          <h2 class="mb-1 text-2xl font-bold">${state.user.name}</h2>
          <div class="flex items-center gap-3 text-secondary mb-3">
            <span class="badge badge-primary">${state.user.year ? state.user.year + '-kurs ' : ''}Tibbiyot Talabasi</span>
            <span class="text-sm flex items-center gap-1">${icons.home} ${state.user.university || 'Universitet'}</span>
          </div>
          <p class="text-sm text-muted">A'zo: ${memberSince} • ${state.user.email}</p>
        </div>
      </div>

      <!-- Stats (real) -->
      <div class="grid-4 mb-6 animate-in animate-delay-1">
        <div class="kpi-card text-center">
          <div class="kpi-label justify-center">O'tilgan Keyslar</div>
          <div class="kpi-value text-primary">${p.casesDone}</div>
        </div>
        <div class="kpi-card text-center">
          <div class="kpi-label justify-center">Sertifikatlar (80%+)</div>
          <div class="kpi-value text-green">${p.certificates.length}</div>
        </div>
        <div class="kpi-card text-center">
          <div class="kpi-label justify-center">O'rtacha Keys Bali</div>
          <div class="kpi-value ${p.avgScore >= 70 ? 'text-green' : 'text-warning'}">${p.avgScore}%</div>
        </div>
        <div class="kpi-card text-center">
          <div class="kpi-label justify-center">Reyting (ball bo'yicha)</div>
          <div class="kpi-value">#${p.rank}<span class="text-sm text-muted">/${p.totalStudents}</span></div>
        </div>
      </div>

      <!-- Badges and Certificates -->
      <div class="grid-2 mb-6 animate-in animate-delay-2">
        <div class="card">
          <div class="flex-between mb-4">
            <h3 class="card-title">Yutuqlar va Nishonlar</h3>
            <span class="text-sm text-secondary">${earnedCount}/${achievements.length} ochilgan</span>
          </div>
          ${achievements.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">Yutuqlar yuklanmoqda...</p>` : `
          <div class="grid-3 gap-3">
            ${achievements.map(a => `
              <div class="card card-flat text-center p-3 ${a.earned ? '' : 'opacity-50 filter grayscale'}">
                <div class="text-3xl mb-2">${a.emoji}</div>
                <div class="text-xs font-semibold">${a.title}</div>
                <div class="text-xs mt-1" style="color:${a.earned ? 'var(--green)' : 'var(--text-muted)'}">${a.earned ? "✓ Qo'lga kiritildi" : '🔒 Qulflangan'}</div>
              </div>
            `).join('')}
          </div>`}
        </div>

        <div class="card">
          <h3 class="card-title mb-4">Muvaffaqiyat Sertifikatlari (80%+ natijalar)</h3>
          ${p.certificates.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">Sertifikat olish uchun keysni 80% dan yuqori natija bilan yakunlang.</p>` : `
          <div class="flex-col gap-3">
            ${p.certificates.slice(0, 5).map(c => `
              <div class="card card-flat p-3 flex-between">
                <div class="flex items-center gap-3">
                  <div class="avatar bg-green-light text-green">🏅</div>
                  <div>
                    <div class="text-sm font-semibold">${c.title}</div>
                    <div class="text-xs text-secondary">${fmtDate(c.date)} • ${c.score}/100 ball</div>
                  </div>
                </div>
                <button class="btn-icon" title="Sertifikatni yuklab olish" onclick="window.downloadCertificate()">${icons.download}</button>
              </div>
            `).join('')}
          </div>`}
        </div>
      </div>

      <!-- Real Activity History -->
      <div class="card mb-6 animate-in animate-delay-3">
        <div class="flex-between mb-4">
          <h3 class="card-title">Yakunlangan Simulyatsiyalar Tarixi (${p.results.length} ta)</h3>
          ${p.results.length > 5 ? `<button class="btn btn-ghost btn-sm" onclick="window.app.showAllProfileHistory = !window.app.showAllProfileHistory; window.render();">${showAll ? 'Qisqartirish' : "Barchasini Ko'rish"}</button>` : ''}
        </div>
        ${p.results.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">Hali simulyatsiya yakunlanmagan. <button class="btn btn-primary btn-sm" onclick="window.navigate('simulator')">Birinchi keysni boshlash</button></p>` : `
        <div class="table-container border-0">
          <table>
            <thead>
              <tr>
                <th>Keys Nomi</th>
                <th>Sana</th>
                <th>Umumiy Ball</th>
                <th>Davomiyligi</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(r => `
                <tr>
                  <td class="font-medium ${r.score >= 80 ? 'text-primary' : ''}">${r.title}</td>
                  <td>${fmtDate(r.date)}</td>
                  <td class="font-semibold ${r.score >= 80 ? 'text-green' : r.score >= 60 ? '' : 'text-warning'}">${r.score}/100</td>
                  <td>${r.duration} daq</td>
                  <td><span class="badge ${r.score >= 80 ? 'badge-success' : r.score >= 60 ? 'badge-primary' : 'badge-warning'}">${r.score >= 80 ? "A'lo" : r.score >= 60 ? 'Muvaffaqiyatli' : 'Qoniqarsiz'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>
  `;
}
