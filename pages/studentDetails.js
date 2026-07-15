// Talaba tafsilotlari — real ma'lumotlar (state.selectedStudent)
export function renderStudentDetails(state, icons) {
  const s = state.selectedStudent;

  if (!s) {
    return `
      <div class="page-header animate-in"><h1 style="font-size:1.4rem">Talaba</h1></div>
      <div class="page-body"><div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);">Talaba tanlanmagan. <button class="btn btn-primary btn-sm" onclick="window.navigate('teacher-dashboard')">Orqaga</button></div></div>
    `;
  }

  const initials = s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const composite = Math.round((s.cognitive + s.axiological) / 2);
  const isWeak = s.axiological < 50 && (s.casesDone > 0 || s.ethicsDone > 0);
  const statusLabel = (s.casesDone === 0 && s.ethicsDone === 0) ? 'Boshlanmagan'
    : composite >= 86 ? "A'lo" : composite >= 71 ? 'Yaxshi' : composite >= 56 ? 'Qoniqarli' : 'Diqqat kerak';
  const statusClass = statusLabel === "A'lo" ? 'badge-success' : statusLabel === 'Yaxshi' ? 'badge-primary' : statusLabel === 'Qoniqarli' ? 'badge-gray' : 'badge-warning';

  // Radar: 5 o'q — talaba vs guruh (real qiymatlar)
  const axes = [
    { label: 'Kognitiv', student: s.cognitive, group: s.groupCognitive },
    { label: 'Aksiologik', student: s.axiological, group: s.groupAxiological },
    { label: 'Faollik', student: Math.min(100, s.casesDone * 10), group: 50 },
    { label: 'Testlar', student: Math.min(100, s.ethicsDone * 20), group: 50 },
    { label: 'Reyting', student: Math.min(100, Math.round(s.points / 100)), group: 50 }
  ];
  const cx = 50, cy = 50, R = 38;
  const n = axes.length;
  const pt = (val, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = (Math.max(0, Math.min(100, val)) / 100) * R;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  };
  const gridPoly = (p) => Array.from({ length: n }, (_, i) => pt(p, i)).join(' ');
  const studentPoly = axes.map((ax, i) => pt(ax.student, i)).join(' ');
  const groupPoly = axes.map((ax, i) => pt(ax.group, i)).join(' ');
  const labels = axes.map((ax, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const lx = cx + (R + 7) * Math.cos(a);
    const ly = cy + (R + 7) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="3.4" text-anchor="${anchor}" font-weight="600" fill="var(--text-secondary)">${ax.label} ${ax.student}%</text>`;
  }).join('');

  const fmtDate = (d) => new Date(d).toLocaleDateString('uz-UZ');

  return `
    <div class="page-header animate-in">
      <div class="flex items-center gap-3">
        <button class="btn-icon" onclick="window.navigate('teacher-dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <div class="text-xs text-muted mb-1">Talabalar ro'yxati</div>
          <h1 style="font-size:1.4rem">${s.name}</h1>
        </div>
      </div>
      <div class="page-header-actions">
        <a class="btn btn-outline" href="mailto:${s.email}?subject=EduMed Deontolog — O'qituvchi xabari" style="text-decoration:none;">Xabar Yozish (Email)</a>
        <button class="btn btn-primary" onclick="window.downloadPDF('Talaba_hisoboti.pdf')">Hisobotni Yuklash</button>
      </div>
    </div>

    <div class="page-body">
      <!-- Profile Card -->
      <div class="card mb-6 flex items-center justify-between animate-in">
        <div class="flex items-center gap-4">
          <div class="avatar avatar-lg bg-surface text-secondary">${initials}</div>
          <div>
            <h2 class="text-xl font-bold mb-1">${s.name}</h2>
            <div class="flex gap-3 text-sm text-secondary">
              <span>${s.email}</span>
              <span>${s.university || "Universitet ko'rsatilmagan"}${s.year ? ` • ${s.year}-kurs` : ''}</span>
              <span>Ro'yxatdan: ${fmtDate(s.createdAt)}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <span class="badge ${statusClass} px-3 py-1 text-sm font-semibold mb-2 inline-flex">${statusLabel}</span>
          <div class="text-sm text-secondary">${isWeak ? 'Aksiologik kompetensiya past darajada' : `Jami ball: ${s.points}`}</div>
        </div>
      </div>

      <!-- Metrics (real) -->
      <div class="grid-4 mb-6 animate-in animate-delay-1">
        <div class="kpi-card">
          <div class="kpi-label">Bajarilgan Keyslar</div>
          <div class="kpi-value text-primary">${s.casesDone}</div>
          <div class="text-xs text-muted mt-2">Bazada ${s.totalCases} ta faol keys mavjud</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Kognitiv (Keys o'rtachasi)</div>
          <div class="kpi-value ${s.cognitive >= 70 ? 'text-green' : s.cognitive >= 50 ? 'text-warning' : 'text-danger'}">${s.cognitive}%</div>
          <div class="text-xs text-muted mt-2">Guruh o'rtachasi: ${s.groupCognitive}%</div>
        </div>
        <div class="kpi-card" ${isWeak ? 'style="border-color: var(--danger)"' : ''}>
          <div class="kpi-label ${isWeak ? 'text-danger font-semibold' : ''}">Aksiologik (Etika)</div>
          <div class="kpi-value ${s.axiological >= 70 ? 'text-green' : s.axiological >= 50 ? 'text-warning' : 'text-danger'}">${s.axiological}%</div>
          <div class="text-xs text-muted mt-2">Guruh: ${s.groupAxiological}% • ${s.ethicsDone} marta test</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Umumiy Ball (Reyting)</div>
          <div class="kpi-value text-warning">${s.points}</div>
          <div class="text-xs text-muted mt-2">Keys, test va volontyorlik ballari</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid-2 mb-6 animate-in animate-delay-2">
        <div class="card">
          <h3 class="card-title mb-4">Talaba vs Guruh O'rtachasi (real)</h3>
          <div style="max-width:340px;margin:0 auto;">
            <svg viewBox="0 0 100 100" style="width:100%;">
              ${[100, 75, 50, 25].map(p => `<polygon points="${gridPoly(p)}" fill="none" stroke="#E5E7EB" stroke-width="0.4"/>`).join('')}
              <polygon points="${groupPoly}" fill="none" stroke="var(--text-muted)" stroke-width="0.8" stroke-dasharray="2,1.5"/>
              <polygon points="${studentPoly}" fill="rgba(37,99,235,0.12)" stroke="var(--primary)" stroke-width="0.9"/>
              ${labels}
            </svg>
          </div>
          <div class="flex justify-center gap-4 mt-4 text-xs font-semibold">
            <div class="flex items-center gap-1"><div style="width:12px;height:12px;background:var(--primary)"></div> Talaba</div>
            <div class="flex items-center gap-1"><div style="width:12px;height:12px;border:1.5px dashed var(--text-muted)"></div> Guruh o'rtachasi</div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title mb-4">Zaif Natijalar (60% dan past keyslar)</h3>
          ${s.weakResults.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">60% dan past natijalar yo'q. ${s.casesDone === 0 ? 'Talaba hali keys yechmagan.' : 'Barakalla!'}</p>` : ''}
          <div class="flex-col gap-2">
            ${s.weakResults.map(w => `
              <div class="p-3 border rounded-lg border-danger-light bg-danger-light">
                <div class="font-semibold text-sm mb-1 text-danger">${w.title}</div>
                <p class="text-xs text-secondary">Natija: ${w.score}% • ${fmtDate(w.date)}</p>
              </div>
            `).join('')}
          </div>

          <h4 class="text-sm font-semibold mt-5 mb-2">Pedagogik tavsiya</h4>
          <ul class="text-sm text-secondary list-disc pl-5">
            ${isWeak ? `<li class="mb-1">Etika va empatik muloqot mavzularida qo'shimcha topshiriqlar bering.</li>` : ''}
            ${s.cognitive < 60 && s.casesDone > 0 ? `<li class="mb-1">Klinik fikrlash bo'yicha keyslarni qayta yechishni tavsiya qiling.</li>` : ''}
            ${s.casesDone === 0 ? `<li class="mb-1">Talaba hali simulyatsiya boshlamagan — birinchi keysga yo'naltiring.</li>` : ''}
            ${!isWeak && s.cognitive >= 60 && s.casesDone > 0 ? `<li class="mb-1">Ko'rsatkichlar barqaror — murakkabroq keyslar bering.</li>` : ''}
          </ul>
        </div>
      </div>

      <!-- Incorrect Answers & Feedback Form -->
      <div class="grid-2 mb-6 animate-in" style="animation-delay: 0.25s;">
        <!-- Incorrect Answers -->
        <div class="card">
          <h3 class="card-title mb-4">Yo'l qo'yilgan xatolar (${s.incorrectAnswers ? s.incorrectAnswers.length : 0} ta)</h3>
          ${!s.incorrectAnswers || s.incorrectAnswers.length === 0 ? `
            <p class="text-sm text-secondary text-center" style="padding:40px;">Hozircha xatoliklar aniqlanmagan.</p>
          ` : `
            <div style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 4px;">
              ${s.incorrectAnswers.map(w => `
                <div style="padding: 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: var(--subtle); border-left: 4px solid var(--danger);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                    <span class="badge ${w.type === 'ethics' ? 'badge-primary' : 'badge-warning'}" style="font-size:0.65rem;">
                      ${w.type === 'ethics' ? '🛡️ Etika Testi' : '🔬 Klinik Keys'}
                    </span>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${fmtDate(w.createdAt)}</span>
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: var(--text); margin-bottom: 8px; line-height:1.4;">${w.questionText}</div>
                  <div style="font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                    <div><span style="color: var(--danger); font-weight:600;">Belgilangan:</span> ${w.selectedOption}</div>
                    <div><span style="color: var(--green-dark); font-weight:600;">To'g'ri javob:</span> ${w.correctOption}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Teacher Feedback Form -->
        <div class="card">
          <h3 class="card-title mb-4">Talabaga yo'riqnoma / fikr-mulohaza yuborish</h3>
          <p class="text-xs text-muted mb-4">Ushbu xabar talabaning bosh sahifasidagi "Xabarnomalar" qismida darhol paydo bo'ladi.</p>
          <div class="input-group">
            <label>Xabar matni</label>
            <textarea id="feedback-message-input" class="input" style="min-height: 120px; resize: vertical; padding: 12px; font-size:0.9rem;" placeholder="Masalan: Etika testidagi 26-modda bo'yicha savollarda xatoliklar qildingiz. Iltimos, Fuqarolar sog'lig'ini saqlash to'g'risidagi qonunni qaytadan ko'rib chiqing."></textarea>
          </div>
          <button class="btn btn-primary w-full mt-4" onclick="window.sendTeacherFeedback('${s.id}')">
            📩 Xabar Yuborish
          </button>
        </div>
      </div>

      <!-- Real History -->
      <div class="card mb-6 animate-in animate-delay-3">
        <h3 class="card-title mb-4">Simulyatsiyalar Tarixi (${s.results.length} ta yozuv)</h3>
        ${s.results.length === 0 ? `<p class="text-sm text-secondary" style="padding:20px;text-align:center;">Hali natijalar yo'q.</p>` : `
        <div class="table-container border-0">
          <table>
            <thead>
              <tr><th>Keys</th><th>Sana</th><th>Ball</th><th>Davomiyligi</th><th>Holat</th></tr>
            </thead>
            <tbody>
              ${s.results.map(r => `
                <tr>
                  <td class="font-medium">${r.title}</td>
                  <td>${fmtDate(r.date)}</td>
                  <td class="font-semibold ${r.score >= 80 ? 'text-green' : r.score >= 60 ? '' : 'text-danger'}">${r.score}/100</td>
                  <td>${r.duration} daq</td>
                  <td><span class="badge ${r.score >= 80 ? 'badge-success' : r.score >= 60 ? 'badge-primary' : 'badge-danger'}">${r.score >= 80 ? "A'lo" : r.score >= 60 ? 'Qoniqarli' : 'Qoniqarsiz'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>
  `;
}
