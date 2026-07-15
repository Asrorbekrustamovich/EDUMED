// Natijalar sahifasi — barcha qiymatlar real sessiyadan hisoblanadi
export function renderResults(state, icons) {
  const sim = state.lastSimulation;
  const ethicsDone = state.ethicsSession && state.ethicsSession.completed;

  // Hech narsa yakunlanmagan bo'lsa — bo'sh holat
  if (!sim && !ethicsDone) {
    return `
      <div class="page-header"><h1>📊 Natijalar</h1></div>
      <div class="page-body">
        <div class="card" style="text-align:center;padding:60px;">
          <div style="font-size:3rem;margin-bottom:12px;">🔬</div>
          <h2 style="margin-bottom:8px;">Hali natija yo'q</h2>
          <p class="text-secondary mb-4">Natijalarni ko'rish uchun avval klinik keys yoki etika testini yakunlang.</p>
          <div class="flex justify-center gap-3">
            <button class="btn btn-primary" onclick="window.navigate('simulator')">Keys boshlash</button>
            <button class="btn btn-outline" onclick="window.navigate('ethics-test')">Etika testi</button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Real qiymatlar ────────────────────────────────────
  let overallScore, title, subtitle, durationText, ratioLabel, ratioValue;
  let history = [];

  if (ethicsDone && (!sim || (state.ethicsSession.finishedAt || 0) > (sim.finishedAt || 0))) {
    const es = state.ethicsSession;
    overallScore = Math.round((es.correct / es.total) * 100);
    title = 'Etika Testi Yakunlandi!';
    subtitle = 'Deontologiya va Tibbiy Huquq';
    durationText = '—';
    ratioLabel = "To'g'ri javoblar";
    ratioValue = `${es.correct}/${es.total}`;
  } else {
    overallScore = Math.min(100, Math.max(0, sim.score));
    title = overallScore >= 60 ? 'Keys Muvaffaqiyatli Yakunlandi!' : 'Keys Yakunlandi';
    subtitle = sim.title;
    history = sim.history || [];
    const mins = Math.floor(sim.durationSec / 60);
    const secs = sim.durationSec % 60;
    durationText = `${mins} daqiqa ${secs} soniya`;
    const good = history.filter(h => h.scoreDelta > 0).length;
    ratioLabel = "To'g'ri qarorlar";
    ratioValue = `${good}/${history.length}`;
  }

  const isGood = overallScore >= 80;
  const isMid = overallScore >= 60 && overallScore < 80;

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (overallScore / 100) * circumference;

  // ── Real hisoblangan ko'rsatkich kartalari ───────────
  const good = history.filter(h => h.scoreDelta > 0);
  const bad = history.filter(h => h.scoreDelta < 0);
  const gained = history.reduce((a, h) => a + (h.scoreDelta > 0 ? h.scoreDelta : 0), 0);
  const lost = history.reduce((a, h) => a + (h.scoreDelta < 0 ? h.scoreDelta : 0), 0);

  const scoreCards = history.length ? [
    { label: "To'g'ri qarorlar", value: `${good.length} ta`, sub: `+${gained} ball`, color: 'var(--green)', icon: '✅' },
    { label: 'Xato qarorlar', value: `${bad.length} ta`, sub: `${lost} ball`, color: bad.length ? 'var(--danger)' : 'var(--green)', icon: '⚠️' },
    { label: 'Yakuniy ball', value: `${overallScore}`, sub: '/100', color: isGood ? 'var(--green)' : isMid ? 'var(--primary)' : 'var(--warning)', icon: '🎯' },
    { label: 'Davomiylik', value: `${sim ? sim.duration : 0} daq`, sub: 'real vaqt', color: 'var(--secondary)', icon: '⏱️' },
  ] : [
    { label: "To'g'ri javoblar", value: ratioValue, sub: 'test savollari', color: 'var(--green)', icon: '✅' },
    { label: 'Natija', value: `${overallScore}%`, sub: 'umumiy', color: isGood ? 'var(--green)' : 'var(--warning)', icon: '🎯' },
    { label: 'Daraja', value: overallScore >= 80 ? 'Yuqori' : overallScore >= 60 ? "O'rta" : 'Past', sub: 'baholash', color: 'var(--primary)', icon: '📊' },
    { label: 'Ball', value: `+${Math.round(overallScore / 5)}`, sub: 'reytingga', color: 'var(--secondary)', icon: '🏆' },
  ];

  // ── Radar: haqiqiy userStats.radar dan ───────────────
  const radar = (state.userStats && state.userStats.radar) || { diagnostics: 0, treatment: 0, communication: 0, ethics: 0, law: 0 };
  const radarCompetencies = [
    { label: 'Diagnostika', value: radar.diagnostics / 100 },
    { label: 'Davolash', value: radar.treatment / 100 },
    { label: 'Muloqot', value: radar.communication / 100 },
    { label: 'Etika', value: radar.ethics / 100 },
    { label: 'Huquq', value: radar.law / 100 },
  ];

  const radarCenter = 140, radarRadius = 100;
  const radarAngles = radarCompetencies.map((_, i) => (Math.PI * 2 * i) / radarCompetencies.length - Math.PI / 2);
  const radarBgPaths = [0.25, 0.5, 0.75, 1.0].map(level => {
    const pts = radarAngles.map(a => `${radarCenter + Math.cos(a) * radarRadius * level},${radarCenter + Math.sin(a) * radarRadius * level}`);
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="#E5E7EB" stroke-width="1"/>`;
  });
  const radarAxes = radarAngles.map(a => `<line x1="${radarCenter}" y1="${radarCenter}" x2="${radarCenter + Math.cos(a) * radarRadius}" y2="${radarCenter + Math.sin(a) * radarRadius}" stroke="#E5E7EB" stroke-width="1"/>`);
  const dataPoints = radarCompetencies.map((c, i) => `${radarCenter + Math.cos(radarAngles[i]) * radarRadius * c.value},${radarCenter + Math.sin(radarAngles[i]) * radarRadius * c.value}`);
  const dataDots = radarCompetencies.map((c, i) => `<circle cx="${radarCenter + Math.cos(radarAngles[i]) * radarRadius * c.value}" cy="${radarCenter + Math.sin(radarAngles[i]) * radarRadius * c.value}" r="4" fill="#2563EB" stroke="white" stroke-width="2"/>`);
  const radarLabels = radarCompetencies.map((c, i) => {
    const x = radarCenter + Math.cos(radarAngles[i]) * (radarRadius + 22);
    const y = radarCenter + Math.sin(radarAngles[i]) * (radarRadius + 22);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#6B7280" font-size="11" font-weight="600" font-family="Inter,sans-serif">${c.label} ${Math.round(c.value * 100)}%</text>`;
  });

  // ── Qadamlar bo'yicha real ballar ────────────────────
  const barData = history.map((h, i) => ({ label: `${i + 1}-qadam`, delta: h.scoreDelta }));
  const maxAbs = Math.max(10, ...barData.map(b => Math.abs(b.delta)));

  // ── Qarorlar xronologiyasi (real) ────────────────────
  const t0 = state.simStartTime || (history[0] ? history[0].at : 0);
  const fmtOffset = (at) => {
    const s = Math.max(0, Math.round((at - t0) / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const decisions = history.map(h => ({
    time: fmtOffset(h.at),
    title: h.doctorChoice.length > 70 ? h.doctorChoice.slice(0, 70) + '…' : h.doctorChoice,
    desc: h.patientResponse.length > 90 ? h.patientResponse.slice(0, 90) + '…' : h.patientResponse,
    status: h.scoreDelta > 0 ? 'green' : h.scoreDelta < 0 ? 'red' : 'yellow',
    score: (h.scoreDelta >= 0 ? '+' : '') + h.scoreDelta
  }));

  // ── Xatolar (real — salbiy ball olingan qarorlar) ────
  const mistakes = bad.map(h => ({
    title: h.doctorChoice.length > 60 ? h.doctorChoice.slice(0, 60) + '…' : h.doctorChoice,
    desc: `Bemor reaksiyasi: "${h.patientResponse}"`,
    impact: `${h.scoreDelta} ball`,
    tip: h.emotionClass === 'anxious' ? "Bemorni xavotirga solmaydigan, empatik muloqot variantini tanlang." : "Klinik jihatdan asoslangan variantni tanlang."
  }));

  // ── Tavsiyalar (real holatdan kelib chiqib) ──────────
  const recommendations = [];
  if (bad.length > 0) recommendations.push({ icon: '🤝', title: "Empatik muloqot ko'nikmasi", desc: `${bad.length} ta qaroringiz bemorda salbiy reaksiya uyg'otdi. Muloqot variantlarini tanlashda bemor hissiyotini inobatga oling.` });
  if (overallScore < 60) recommendations.push({ icon: '🔄', title: 'Keysni qayta yechish', desc: "Natija 60% dan past. Xatolar tahlilini o'qib chiqib, keysni qayta yeching." });
  if (radar.law < 70) recommendations.push({ icon: '📚', title: "Huquqiy bilimlarni mustahkamlash", desc: `Huquq ko'rsatkichingiz ${radar.law}%. "Fuqarolar sog'lig'ini saqlash to'g'risida"gi Qonun (26, 27, 29-moddalar) bo'yicha etika testlarini ishlang.` });
  if (recommendations.length === 0) recommendations.push({ icon: '🏆', title: 'Ajoyib natija!', desc: "Barcha qarorlaringiz to'g'ri. Murakkabroq (Qiyin darajali) keyslarga o'ting." });

  return `
    <div class="page-header">
      <div>
        <h1>📊 Natijalar</h1>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${subtitle} — yakuniy baholash</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-outline btn-sm" onclick="window.downloadPDF('Natijalar.pdf')">${icons.download} PDF Yuklab Olish</button>
        <button class="btn btn-outline btn-sm" onclick="window.copyShareLink()">${icons.export} Ulashish</button>
      </div>
    </div>

    <div class="page-body">

      <!-- Yakuniy karta -->
      <div class="card animate-in mb-6" style="background:linear-gradient(135deg, ${isGood ? 'var(--green-light)' : isMid ? 'var(--primary-light)' : 'var(--warning-light)'} 0%, #FDFDFD 60%); border:1px solid var(--border-light); padding:40px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; gap:40px; flex-wrap:wrap;">
          <div>
            <div style="font-size:3rem; margin-bottom:8px;">${isGood ? '🏅' : isMid ? '✅' : '📖'}</div>
            <h2 style="font-size:1.6rem; font-weight:700; color:var(--text); margin-bottom:6px;">${title}</h2>
            <p style="font-size:1rem; color:var(--text-secondary); margin-bottom:4px;">${subtitle}</p>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
              <span class="badge ${isGood ? 'badge-success' : isMid ? 'badge-primary' : 'badge-warning'}">${isGood ? "A'lo natija" : isMid ? 'Yaxshi natija' : 'Takrorlash tavsiya etiladi'}</span>
              ${isGood ? '<span class="badge badge-primary">Sertifikat olish mumkin</span>' : ''}
            </div>
          </div>
          <div style="position:relative;width:160px;height:160px;">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="54" fill="none" stroke="#E5E7EB" stroke-width="10" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="${isGood ? '#22C55E' : isMid ? '#2563EB' : '#F59E0B'}" stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashOffset}"
                transform="rotate(-90 80 80)"
                style="transition:stroke-dashoffset 1s ease;"
              />
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="font-size:2.4rem;font-weight:800;color:var(--text);line-height:1;">${overallScore}</div>
              <div style="font-size:0.733rem;color:var(--text-muted);font-weight:500;">/100 ball</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real ko'rsatkichlar -->
      <div class="grid-4 mb-6">
        ${scoreCards.map(card => `
          <div class="card animate-in" style="text-align:center; padding:24px 16px;">
            <div style="font-size:1.5rem;margin-bottom:8px;">${card.icon}</div>
            <div style="font-size:0.8rem;font-weight:500;color:var(--text-secondary);margin-bottom:6px;">${card.label}</div>
            <div style="font-size:1.8rem;font-weight:800;color:${card.color};">${card.value}</div>
            <div style="font-size:0.733rem;color:var(--text-muted);margin-top:4px;">${card.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- Radar + Qadamlar -->
      <div class="grid-2 mb-6">
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">Kompetensiya Radar (umumiy profil)</div>
            <span class="badge badge-primary">Real ma'lumot</span>
          </div>
          <div style="display:flex; justify-content:center; padding:8px 0;">
            <svg width="280" height="280" viewBox="0 0 280 280">
              ${radarBgPaths.join('')}
              ${radarAxes.join('')}
              <polygon points="${dataPoints.join(' ')}" fill="rgba(37,99,235,0.1)" stroke="#2563EB" stroke-width="2"/>
              ${dataDots.join('')}
              ${radarLabels.join('')}
            </svg>
          </div>
        </div>

        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">Qadamlar Bo'yicha Ball (${barData.length} qadam)</div>
            <span class="badge badge-gray">joriy sessiya</span>
          </div>
          ${barData.length === 0 ? `<p class="text-sm text-secondary" style="text-align:center;padding:40px;">Test rejimida qadamlar tahlili mavjud emas.</p>` : `
          <div style="display:flex;align-items:center;gap:14px;height:190px;padding:0 8px;">
            ${barData.map(bar => {
              const h = Math.round((Math.abs(bar.delta) / maxAbs) * 70);
              const pos = bar.delta >= 0;
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;">
                  <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;width:100%;align-items:center;">
                    ${pos ? `<div style="font-size:0.7rem;font-weight:700;color:var(--green);">+${bar.delta}</div><div style="width:60%;height:${h}px;min-height:4px;background:var(--green);border-radius:6px 6px 0 0;"></div>` : ''}
                  </div>
                  <div style="height:2px;width:100%;background:var(--border);"></div>
                  <div style="flex:1;display:flex;flex-direction:column;width:100%;align-items:center;">
                    ${!pos ? `<div style="width:60%;height:${h}px;min-height:4px;background:var(--danger);border-radius:0 0 6px 6px;"></div><div style="font-size:0.7rem;font-weight:700;color:var(--danger);">${bar.delta}</div>` : ''}
                  </div>
                  <div style="font-size:0.667rem;color:var(--text-muted);margin-top:4px;">${bar.label}</div>
                </div>`;
            }).join('')}
          </div>`}
        </div>
      </div>

      <!-- Xronologiya + Xatolar (real) -->
      <div class="grid-2 mb-6">
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">Qarorlar Xronologiyasi</div>
            <span class="badge badge-success">${decisions.length} qadam</span>
          </div>
          ${decisions.length === 0 ? `<p class="text-sm text-secondary" style="text-align:center;padding:30px;">Joriy sessiyada qarorlar qayd etilmagan.</p>` : `
          <div class="timeline">
            ${decisions.map(d => `
              <div class="timeline-item">
                <div class="timeline-dot ${d.status}"></div>
                <div class="timeline-content">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div class="timeline-title">${d.title}</div>
                    <span class="badge ${d.status === 'green' ? 'badge-success' : d.status === 'red' ? 'badge-danger' : 'badge-warning'}" style="font-size:0.6rem;">${d.score}</span>
                  </div>
                  <div class="timeline-meta">${d.time} — ${d.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>`}
        </div>

        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">Xatolar Tahlili</div>
            <span class="badge ${mistakes.length ? 'badge-danger' : 'badge-success'}">${mistakes.length} ta xato</span>
          </div>
          ${mistakes.length === 0 ? `<div style="text-align:center;padding:30px;"><div style="font-size:2rem;">🎉</div><p class="text-sm text-secondary">Salbiy ball olingan qarorlar yo'q!</p></div>` : `
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${mistakes.map(m => `
              <div style="padding:14px 16px; background:var(--danger-light); border-radius:var(--radius-md); border-left:3px solid var(--danger);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                  <div style="font-size:0.867rem;font-weight:600;color:var(--danger);">❌ ${m.title}</div>
                  <span class="badge badge-danger" style="font-size:0.6rem;">${m.impact}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;margin-bottom:8px;">${m.desc}</div>
                <div style="font-size:0.733rem;color:var(--primary);font-weight:500;">💡 ${m.tip}</div>
              </div>
            `).join('')}
          </div>`}
        </div>
      </div>

      <!-- Tavsiyalar + Harakatlar -->
      <div class="grid-2 mb-6">
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">🤖 Tavsiyalar</div>
            <span class="badge badge-primary">Natijangizga asoslangan</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${recommendations.map(r => `
              <div style="display:flex;align-items:flex-start;gap:14px;padding:14px;background:var(--surface);border-radius:var(--radius-md);">
                <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">${r.icon}</div>
                <div>
                  <div style="font-size:0.867rem;font-weight:600;color:var(--text);margin-bottom:4px;">${r.title}</div>
                  <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">${r.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card animate-in" style="display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div class="card-header">
              <div class="card-title">Harakatlar</div>
            </div>

            ${isGood ? `
            <div style="background:linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%); border:1px solid #FDE68A; border-radius:var(--radius-lg); padding:24px; text-align:center; margin-bottom:20px;">
              <div style="font-size:2rem;margin-bottom:8px;">🏆</div>
              <div style="font-size:0.933rem;font-weight:700;color:var(--text);margin-bottom:4px;">Sertifikat Tayyor!</div>
              <div style="font-size:0.733rem;color:var(--text-secondary);margin-bottom:4px;">EduMed Deontolog — ${subtitle}</div>
              <div style="font-size:0.733rem;color:var(--text-muted);">${overallScore}/100 ball — ${new Date().toLocaleDateString('uz-UZ')}</div>
            </div>` : `
            <div style="background:var(--surface); border-radius:var(--radius-lg); padding:24px; text-align:center; margin-bottom:20px;">
              <div style="font-size:2rem;margin-bottom:8px;">🎯</div>
              <div style="font-size:0.933rem;font-weight:700;color:var(--text);margin-bottom:4px;">Sertifikat uchun 80+ ball kerak</div>
              <div style="font-size:0.733rem;color:var(--text-secondary);">Joriy natija: ${overallScore}/100</div>
            </div>`}

            <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);margin-bottom:20px;">
              <div style="font-size:0.8rem;font-weight:600;color:var(--text);margin-bottom:8px;">📈 Umumiy Tahlil (real)</div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;">
                  <span style="color:var(--text-secondary);">Jami vaqt</span>
                  <span style="font-weight:600;">${durationText}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;">
                  <span style="color:var(--text-secondary);">${ratioLabel}</span>
                  <span style="font-weight:600;color:var(--green);">${ratioValue}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;">
                  <span style="color:var(--text-secondary);">Yakuniy ball</span>
                  <span style="font-weight:600;color:var(--primary);">${overallScore}/100</span>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            ${isGood ? `<button class="btn btn-primary w-full" style="gap:8px;" onclick="window.downloadCertificate()">${icons.download} Sertifikat Yuklab Olish</button>` : ''}
            <button class="btn btn-outline w-full" onclick="window.navigate('simulator')" style="gap:8px;">🔄 Yangi Keys Boshlash</button>
            <button class="btn btn-ghost w-full" onclick="window.navigate('dashboard')" style="gap:8px;">← Dashboard ga qaytish</button>
          </div>
        </div>
      </div>

    </div>
  `;
}
