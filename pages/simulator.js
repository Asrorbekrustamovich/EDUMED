export function renderSimulator(state, icons) {
  const caseData = state.currentCase;
  const step = state.currentSimulationStep;

  if (!caseData) {
    const cases = state.cases || [];
    return `
      <div class="page-header animate-in">
        <div>
          <h1>🔬 Klinik Simulyatsiya</h1>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Bugungi ${cases.length} ta keysdan birini tanlang va simulyatsiyani boshlang</p>
        </div>
        <div class="page-header-actions">
          <div class="search-bar">
            <span class="search-icon">${icons.search}</span>
            <input type="text" class="input" id="case-search-input" onkeyup="window.filterSimulatorCases()" placeholder="Keyslarni qidirish..." style="width: 250px;">
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.navigate('dashboard')">Orqaga</button>
        </div>
      </div>

      <div class="page-body">
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;" id="cases-grid-list">
          ${cases.map((c, idx) => {
            let difficultyBadge = 'badge-success';
            if (c.difficulty === "O'rta") difficultyBadge = 'badge-warning';
            else if (c.difficulty === 'Qiyin') difficultyBadge = 'badge-danger';

            return `
              <div class="card card-flat case-selection-card animate-in" data-title="${c.title.toLowerCase()}" data-category="${c.category.toLowerCase()}" style="display:flex; flex-direction:column; justify-content:space-between; animation-delay:${idx * 0.01}s; padding: 20px;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                    <span class="badge ${difficultyBadge}">${c.difficulty}</span>
                    <span class="badge badge-gray">${c.category}</span>
                  </div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:var(--text); margin-bottom:8px; line-height:1.4;">${c.title}</h3>
                  <p style="font-size:0.867rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${c.description}</p>
                </div>
                <button class="btn btn-primary w-full btn-sm" style="margin-top:auto;" onclick="window.startCase('${c.id}')">
                  ${icons.simulation} Keysni Boshlash
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  const history = state.simulationHistory || [];

  // Bemor ismi va yoshi — keys sarlavhasidan real olinadi: "... (Ism Familiya, NN yosh)"
  let patientName = 'Virtual Bemor';
  let patientAge = '';
  const m = caseData.title.match(/\(([^,()]+),\s*(\d+)\s*yosh\)/);
  if (m) { patientName = m[1].trim(); patientAge = `${m[2]} yosh`; }

  // Jinsga qarab avatar (ayol familiyalari odatda -a bilan tugaydi)
  const firstName = patientName.split(' ')[0] || '';
  const isFemale = /a$/i.test(firstName) || /ova\b|eva\b/i.test(patientName);
  const ageNum = parseInt(m ? m[2] : '30', 10);
  const patientAvatar = ageNum <= 14 ? '🧒' : isFemale ? '👩‍🦰' : ageNum >= 60 ? '👴' : '👨';

  // Hayotiy ko'rsatkichlar — tanlangan variantning real vitalsHr qiymatidan
  const currentEmotion = history.length > 0 ? history[history.length - 1].emotionText : '😐 Kutmoqda';
  const currentEmotionClass = history.length > 0 ? history[history.length - 1].emotionClass : 'badge-gray';
  const hr = history.length > 0 ? history[history.length - 1].vitalsHr : 88;

  // Boshqa ko'rsatkichlar pulsga bog'liq holda hisoblanadi (real dinamika)
  const sys = 100 + Math.round((hr - 70) * 0.6);
  const dia = 65 + Math.round((hr - 70) * 0.3);
  const temp = (36.6 + Math.max(0, (hr - 85)) * 0.03).toFixed(1);
  const spo2 = Math.max(90, 99 - Math.max(0, Math.round((hr - 85) / 6)));
  const hrDanger = hr >= 105;

  const historyHtml = history.map(h => `
    <div class="chat-bubble system">${h.systemMessage}</div>
    <div class="chat-bubble doctor">${h.doctorChoice}</div>
    <div class="chat-bubble patient">${h.patientResponse}</div>
  `).join('');

  return `
    <div class="page-header" style="flex-wrap:wrap; gap:16px; padding:12px 32px;">
      <div style="flex:1; min-width:300px;">
        <h1 style="font-size:1.25rem; display:flex; align-items:center; gap:8px;">
          🔬 ${caseData.title}
        </h1>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px; max-width:600px;">
          ${caseData.description}
        </p>
      </div>
      <div class="page-header-actions" style="display:flex; align-items:center; gap:12px;">
        <div class="sim-timer" id="sim-timer" style="padding: 4px 12px; font-size:0.85rem;">
          ⏱️ 00:00
        </div>
        <button class="btn btn-danger btn-sm" onclick="if(confirm('Haqiqatan ham simulyatsiyani qayta boshlamoqchimisiz? Joriy muloqot o\\'chib ketadi.')) window.startCase('${caseData.id}')">
          🔄 Qayta Boshlash
        </button>
        <button class="btn btn-outline btn-sm" onclick="window.navigate('dashboard')">
          ${icons.arrowLeft} Dashboard
        </button>
      </div>
    </div>

    <div class="simulator-layout" style="height: calc(100vh - 180px); min-height: 500px; margin-top: 10px;">

      <!-- Patient Panel -->
      <div class="patient-panel card animate-in">
        <div class="patient-avatar-large">${patientAvatar}</div>
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:6px; color:var(--text);">${patientName}${patientAge ? ', ' + patientAge : ''}</h3>
        <div style="display:flex; gap:8px; justify-content:center; margin-bottom:24px;">
          <span class="badge ${currentEmotionClass}" id="patient-emotion-badge">${currentEmotion}</span>
          <span class="badge badge-gray" id="patient-status-badge">${step ? 'Tashxis kutilmoqda' : 'Yakunlandi'}</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="vital-card" ${hrDanger ? 'style="border-color:var(--danger)"' : ''}>
            <div class="vital-label">Puls</div>
            <div class="vital-value" id="vital-hr" ${hrDanger ? 'style="color:var(--danger)"' : ''}>${hr} t/m</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Bosim</div>
            <div class="vital-value">${sys}/${dia} mmHg</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Harorat</div>
            <div class="vital-value" ${parseFloat(temp) >= 37.5 ? 'style="color:var(--danger);"' : ''}>${temp}°C</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">SpO₂</div>
            <div class="vital-value" ${spo2 < 94 ? 'style="color:var(--danger);"' : ''}>${spo2}%</div>
          </div>
        </div>

        <div class="card card-flat p-3 mt-4 bg-surface text-xs text-secondary" style="line-height:1.5;text-align:left;">
          Joriy ball: <strong>${state.currentScore ?? 50}/100</strong><br>
          Ko'rsatkichlar sizning muloqot qarorlaringizga qarab o'zgaradi.
        </div>
      </div>

      <!-- Conversation Panel -->
      <div class="conversation-panel card animate-in" style="animation-delay:0.1s;">
        <div class="chat-area" id="chat-area">
          ${historyHtml}
          ${step ? `
            <div class="chat-bubble system">${step.systemMessage}</div>
            <div class="choices-container" style="margin-top: 8px;">
              <h4 style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.05em;">Muloqot strategiyasini tanlang:</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${step.options.map((opt, i) => `
                  <div class="choice-card" onclick="window.selectChoice(${i})" style="margin: 0; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: var(--radius-lg); cursor:pointer; background: var(--bg); transition: all var(--transition-base);">
                    <div class="choice-label" style="font-size: 0.7rem; font-weight:700; color: var(--primary); margin-bottom:4px;">Variant ${String.fromCharCode(65 + i)}</div>
                    <div class="choice-text" style="font-size: 0.85rem; line-height:1.5; color: var(--text);">${opt.text}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="chat-bubble system" style="background:var(--green-light); color:var(--green-dark);">Simulyatsiya yakunlandi. Natijalarni ko'rish tugmasini bosing.</div>
            <div style="text-align:center; padding: 16px 0 8px 0;">
              <button class="btn btn-primary" onclick="window.navigate('results')">Natijalarni ko'rish</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
