// Ethics Test Page — Etiko-Deontologik Test
export function renderEthicsTest(state, icons) {
  // If no question is loaded, fallback to first one (shouldn't happen with our navigate logic)
  const q = state.currentEthicsQuestion || state.ethicsQuestions[0];
  
  const answers = q.options.map((text, index) => ({
    letter: String.fromCharCode(65 + index),
    text: text
  }));

  const session = state.ethicsSession || { total: 5, current: 1 };
  
  const steps = Array.from({ length: session.total }, (_, i) => {
    const num = i + 1;
    let status = 'upcoming';
    if (num < session.current) status = 'completed';
    else if (num === session.current) status = 'current';
    return { num, status, label: `Savol ${num}` };
  });

  const percent = Math.round(((session.current - 1) / session.total) * 100);
  const currentQFormatted = session.current < 10 ? '0' + session.current : session.current;

  return `

    <div class="page-header">
      <div>
        <h1>🛡️ Etiko-Deontologik Test</h1>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Huquqiy va axloqiy bilimlarni sinash</p>
      </div>
      <div class="page-header-actions">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:0.8rem;color:var(--text-muted);">${icons.clock}</span>
          <span style="font-size:0.933rem;font-weight:600;color:var(--text);font-variant-numeric:tabular-nums;">12:45</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.navigate('dashboard')">Chiqish</button>
      </div>
    </div>

    <div class="page-body" style="max-width:820px; margin:0 auto;">

      <!-- Progress Steps -->
      <div class="card animate-in mb-6" style="padding:24px 32px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <span style="font-size:0.867rem; font-weight:600; color:var(--text);">Savol ${session.current}/${session.total}</span>
          <span style="font-size:0.733rem; color:var(--text-muted);">${percent}% bajarildi</span>
        </div>
        <!-- Step circles with connecting lines -->
        <div style="display:flex; align-items:center; justify-content:center; gap:0; position:relative;">
          ${steps.map((step, i) => {
            let circleStyle, textColor;
            if (step.status === 'completed') {
              circleStyle = 'background:var(--green); color:white; border:2px solid var(--green);';
              textColor = 'color:var(--green-dark);';
            } else if (step.status === 'current') {
              circleStyle = 'background:var(--primary); color:white; border:2px solid var(--primary); box-shadow:0 0 0 4px rgba(37,99,235,0.15);';
              textColor = 'color:var(--primary);';
            } else {
              circleStyle = 'background:var(--surface); color:var(--text-muted); border:2px solid var(--border);';
              textColor = 'color:var(--text-muted);';
            }
            const connector = i < steps.length - 1
              ? `<div style="flex:1;height:2px;background:${step.status === 'completed' ? 'var(--green)' : 'var(--border)'};min-width:40px;"></div>`
              : '';
            return `
              <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
                <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;${circleStyle}">
                  ${step.status === 'completed' ? '✓' : step.num}
                </div>
                <span style="font-size:0.667rem;font-weight:500;${textColor}">${step.label}</span>
              </div>
              ${connector}
            `;
          }).join('')}
        </div>
        <!-- Progress bar -->
        <div class="progress-bar" style="margin-top:16px;">
          <div class="progress-fill green" style="width:${percent}%;"></div>
        </div>
      </div>

      <!-- Context Banner -->
      <div class="animate-in mb-6" style="background:var(--primary-light); border:1px solid rgba(37,99,235,0.15); border-radius:var(--radius-xl); padding:16px 24px; display:flex; align-items:center; gap:14px;">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:rgba(37,99,235,0.12);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">📋</div>
        <div>
          <div style="font-size:0.733rem;font-weight:600;color:var(--primary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;">Klinik Holat (Tasodifiy)</div>
          <div style="font-size:0.933rem;font-weight:600;color:var(--text);">Deontologiya va Tibbiy Huquq qoidalari</div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="card animate-in mb-6" style="padding:32px; border-left:4px solid var(--primary);">
        <div style="display:flex;align-items:flex-start;gap:20px;">
          <div style="font-size:2.8rem;font-weight:800;color:var(--primary);line-height:1;opacity:0.2;flex-shrink:0;">${currentQFormatted}</div>
          <div style="flex:1;">
            <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
              <span class="badge badge-primary">Tibbiy Huquq</span>
              <span class="badge badge-gray">O'rta qiyinlik</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:600; line-height:1.6; color:var(--text); margin-bottom:8px;">
              ${q.question}
            </h3>
            <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 12px; background:var(--surface); border-radius:var(--radius-full); margin-top:4px;">
              <span style="font-size:0.733rem; font-weight:600; color:var(--primary);">📖 ${q.lawText}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Answer Options -->
      <div style="display:flex;flex-direction:column;gap:12px;" class="animate-in mb-6">
        ${answers.map((ans, i) => `
          <div class="choice-card ethics-choice" onclick="window.selectAnswer(${i})" style="display:flex;align-items:flex-start;gap:16px;padding:18px 22px;">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:0.867rem;font-weight:700;color:var(--primary);flex-shrink:0;border:2px solid var(--border);">
              ${ans.letter}
            </div>
            <div style="flex:1;">
              <div style="font-size:0.933rem;color:var(--text);line-height:1.6;font-weight:500;">${ans.text}</div>
            </div>
            <div style="flex-shrink:0;color:var(--text-muted);opacity:0.3;">
              ${icons.chevronRight}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Feedback Card (hidden initially) -->
      <div id="ethics-feedback" class="card mb-6" style="display:none; padding:24px; border-width:2px; transition:all 0.3s ease;"></div>

      <!-- Bottom Navigation -->
      <div class="animate-in" style="display:flex; align-items:center; justify-content:space-between; padding-top:8px;">
        <button class="btn btn-ghost" style="gap:6px;" onclick="window.navigate('dashboard')">
          ← Dashboard
        </button>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:0.733rem;color:var(--text-muted);">Boshqa tasodifiy savolga o'tish</span>
          <button class="btn btn-outline btn-sm" onclick="window.nextEthicsQuestion()">O'tkazib yuborish</button>
        </div>
      </div>

    </div>
  `;
}
