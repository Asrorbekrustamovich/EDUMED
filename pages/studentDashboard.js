// Student Dashboard — EduMed Deontolog
// Exports renderStudentDashboard(state, icons) â†’ full HTML string

export function renderStudentDashboard(state, icons) {

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const nav = (page) => `window.navigate('${page}')`;

  // Circular progress SVG (ring)
  function circularProgress(percent, size = 48, stroke = 4, color = 'var(--primary)') {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    return `
      <div class="circular-progress" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}">
          <circle cx="${size / 2}" cy="${size / 2}" r="${r}"
            fill="none" stroke="var(--border-light)" stroke-width="${stroke}" />
          <circle cx="${size / 2}" cy="${size / 2}" r="${r}"
            fill="none" stroke="${color}" stroke-width="${stroke}"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round" />
        </svg>
        <span class="value" style="font-size:${size * 0.24}px">${percent}%</span>
      </div>`;
  }

  // Mini sparkline SVG
  function sparkline(data, w = 80, h = 28, color = 'var(--primary)') {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1);
    const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
    return `
      <svg width="${w}" height="${h}" style="display:block">
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  // ── KPI Data ─────────────────────────────────────────
  const stats = state.userStats || {
    completedCases: 0,
    totalCases: 20,
    ethicsScore: 0,
    clinicalScore: 0,
    weeklyHours: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    goals: [],
    achievements: [],
    timeline: [],
    radar: { diagnostics: 0, treatment: 0, communication: 0, ethics: 0, law: 0 }
  };
  
  const kpis = [
    {
      label: 'Yakunlangan Keyslar',
      value: `${stats.completedCases}/${stats.totalCases}`,
      extra: circularProgress(Math.round((stats.completedCases/stats.totalCases)*100) || 0, 44, 4, 'var(--primary)'),
      trend: stats.completedCases > 0 ? '+1 bu hafta' : 'Faollik yo\'q',
      trendDir: 'up',
      icon: '📋'
    },
    {
      label: 'Etika Bali',
      value: `${stats.ethicsScore}%`,
      valueColor: 'var(--green)',
      trend: stats.ethicsScore > 0 ? 'Yaxshi natija' : 'Noma\'lum',
      trendDir: 'up',
      icon: '🛡️'
    },
    {
      label: 'Klinik Fikrlash',
      value: `${stats.clinicalScore}%`,
      valueColor: 'var(--primary)',
      trend: stats.clinicalScore > 0 ? 'Tahlil qilindi' : 'Noma\'lum',
      trendDir: 'up',
      icon: '🧠'
    },
    {
      label: 'Haftalik Faollik',
      value: `${stats.weeklyHours} soat`,
      extra: sparkline(stats.weeklyData, 80, 28, 'var(--primary)'),
      trend: stats.weeklyHours > 0 ? 'Haqiqiy faollik' : 'Bugun faollik yo\'q',
      trendDir: 'up',
      icon: '⏱️'
    }
  ];

  // ── Goals ────────────────────────────────────────────
  const goals = stats.goals.length > 0 ? stats.goals : [
    { text: 'Ertalabki etika viktorinasini yakunlash', done: false },
    { text: 'Bemor muloqoti simulyatsiyasi', done: false },
    { text: 'Tibbiy etika qonunlarini o\'rganish', done: false }
  ];
  const goalsDone = goals.filter(g => g.done).length;

  // ── Achievements ─────────────────────────────────────
  const achievements = stats.achievements.length > 0 ? stats.achievements : [
    { emoji: '🏆', title: 'Birinchi Keys', earned: false },
    { emoji: '🎯', title: '10 ta Simulyatsiya', earned: false },
    { emoji: '⭐', title: 'Etika Ustasi', earned: false },
    { emoji: '🔬', title: 'Lab Tadqiqotchi', earned: false }
  ];

  // ── Weekly activity data ─────────────────────────────
  const weekDays = [
    { day: 'Du', hours: stats.weeklyData[0] || 0 },
    { day: 'Se', hours: stats.weeklyData[1] || 0 },
    { day: 'Cho', hours: stats.weeklyData[2] || 0 },
    { day: 'Pa', hours: stats.weeklyData[3] || 0 },
    { day: 'Ju', hours: stats.weeklyData[4] || 0 },
    { day: 'Sha', hours: stats.weeklyData[5] || 0 },
    { day: 'Ya', hours: stats.weeklyData[6] || 0 }
  ];
  const maxHours = Math.max(...weekDays.map(d => d.hours)) || 1;

  // ── Timeline items ───────────────────────────────────
  const timeline = stats.timeline.length > 0 ? stats.timeline : [
    { title: 'Appenditsit keysini boshladi', time: 'Bugun, 10:30', color: 'var(--primary)' },
    { title: 'Etika testini yakunladi — 92%', time: 'Bugun, 09:15', color: 'var(--green)' },
    { title: 'Farmakologiya laboratoriyasi', time: 'Kecha, 16:40', color: 'var(--secondary)' },
    { title: 'Bemor muloqoti mashqi', time: 'Kecha, 14:20', color: 'var(--warning)' },
    { title: 'Yangi sertifikat olindi', time: '13-Iyul, 11:00', color: 'var(--green)' }
  ];

  // ── Notifications (real — backenddan) ─────────────────
  const notifications = (state.notifications || []).slice(0, 3);
  const hasUnread = (state.notifications || []).some(n => n.unread);

  // ── Radar chart (SVG polygon) ────────────────────────
  function radarChart() {
    const axes = [
      { label: 'Diagnostika', value: stats.radar.diagnostics },
      { label: 'Davolash', value: stats.radar.treatment },
      { label: 'Muloqot', value: stats.radar.communication },
      { label: 'Etika', value: stats.radar.ethics },
      { label: 'Huquq', value: stats.radar.law }
    ];
    const cx = 140, cy = 130, maxR = 100;
    const n = axes.length;
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2; // top

    // Grid rings
    const rings = [20, 40, 60, 80, 100];
    let gridLines = '';
    rings.forEach(pct => {
      const r = (pct / 100) * maxR;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = startAngle + i * angleStep;
        pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      }
      gridLines += `<polygon points="${pts.join(' ')}" fill="none" stroke="var(--border)" stroke-width="1" opacity="0.5"/>`;
    });

    // Axis lines
    let axisLines = '';
    for (let i = 0; i < n; i++) {
      const a = startAngle + i * angleStep;
      const ex = cx + maxR * Math.cos(a);
      const ey = cy + maxR * Math.sin(a);
      axisLines += `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="var(--border)" stroke-width="1" opacity="0.4"/>`;
    }

    // Data polygon
    const dataPts = [];
    axes.forEach((axis, i) => {
      const r = (axis.value / 100) * maxR;
      const a = startAngle + i * angleStep;
      dataPts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    });
    const dataPolygon = `<polygon points="${dataPts.join(' ')}" fill="rgba(37,99,235,0.12)" stroke="var(--primary)" stroke-width="2"/>`;

    // Data points
    let dataPoints = '';
    axes.forEach((axis, i) => {
      const r = (axis.value / 100) * maxR;
      const a = startAngle + i * angleStep;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      dataPoints += `<circle cx="${px}" cy="${py}" r="4" fill="var(--primary)" stroke="white" stroke-width="2"/>`;
    });

    // Labels
    let labels = '';
    axes.forEach((axis, i) => {
      const r = maxR + 22;
      const a = startAngle + i * angleStep;
      const lx = cx + r * Math.cos(a);
      const ly = cy + r * Math.sin(a);
      const anchor = Math.abs(Math.cos(a)) < 0.1 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
      const dy = Math.sin(a) > 0.3 ? '1em' : Math.sin(a) < -0.3 ? '-0.2em' : '0.35em';
      labels += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dy="${dy}" fill="var(--text-secondary)" font-size="11" font-weight="500">${axis.label} ${axis.value}%</text>`;
    });

    return `
      <svg viewBox="0 0 280 260" style="width:100%;max-width:280px;margin:0 auto;display:block">
        ${gridLines}
        ${axisLines}
        ${dataPolygon}
        ${dataPoints}
        ${labels}
      </svg>`;
  }

  // â”€â”€ Notification type â†’ badge color class â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function notifBadge(type) {
    if (type === 'success') return 'background:var(--green-light);color:var(--green-dark)';
    if (type === 'warning') return 'background:var(--warning-light);color:#B45309';
    return 'background:var(--primary-light);color:var(--primary)';
  }

  // â”€â”€ Search input with icon â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const searchBox = `
    <div style="position:relative;width:260px">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);display:flex">${icons.search}</span>
      <input class="input" placeholder="Qidirish…" style="padding-left:38px;height:40px;font-size:0.867rem;border-radius:var(--radius-full);background:var(--surface);border-color:var(--border-light)" />
    </div>`;

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // â•â•â•  HTML OUTPUT  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  return `
    <!-- â”€â”€â”€ Page Header â”€â”€â”€ -->
    <div class="page-header">
      <div>
        <h1 style="margin-bottom:2px">Dashboard</h1>
        <p class="text-sm text-secondary" style="margin:0">Xush kelibsiz, ${state.user.name.split(' ')[1] || state.user.name}!</p>
      </div>
      <div class="page-header-actions">
        ${searchBox}
        <button class="btn-icon" style="position:relative" onclick="${nav('notifications')}">
          ${icons.bell}
          ${(state.notifications || []).some(n => n.unread) ? '<span style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:var(--danger);border-radius:50%;border:2px solid white"></span>' : ''}
        </button>
      </div>
    </div>

    <!-- â”€â”€â”€ Page Body â”€â”€â”€ -->
    <div class="page-body">

      <!-- 1. Welcome Banner -->
      <div class="animate-in" style="
        background: linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F0FDF4 100%);
        border-radius: var(--radius-xl);
        padding: 32px 36px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--border-light);
        position: relative;
        overflow: hidden;
      ">
        <div style="position:relative;z-index:1">
          <h2 style="font-size:1.5rem;margin-bottom:6px">Assalomu alaykum, ${state.user.name.split(' ')[0]}! 👋</h2>
          <p style="color:var(--text-secondary);margin-bottom:20px;font-size:0.933rem">
            Klinik treningni davom ettiring — bugungi maqsadlaringizga yaqinlashyapsiz!
          </p>
          <button class="btn btn-primary" onclick="${nav('simulator')}">
            ${icons.simulation} Simulyatsiyani Boshlash
          </button>
        </div>
        <div style="font-size:6rem;opacity:0.2;position:absolute;right:36px;bottom:-10px;line-height:1">🩺</div>
      </div>

      <!-- 2. KPI Row -->
      <div class="grid-4 mb-6">
        ${kpis.map((k, i) => `
          <div class="kpi-card animate-in">
            <div class="kpi-label">
              <span>${k.icon}</span> ${k.label}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
              <div>
                <div class="kpi-value" ${k.valueColor ? `style="color:${k.valueColor}"` : ''}>${k.value}</div>
                <div class="kpi-trend ${k.trendDir}">
                  ${k.trendDir === 'up' ? icons.arrowUp : icons.arrowDown}
                  ${k.trend}
                </div>
              </div>
              ${k.extra ? `<div>${k.extra}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 3. Current Simulation + Goals -->
      <div class="grid-32 mb-6">
        <!-- LEFT: Recommended Simulation -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">🔬 Tavsiya etilgan Keys</div>
            <span class="badge badge-primary">Tavsiya</span>
          </div>
          ${(() => {
            const completedTitles = (state.userStats && state.userStats.timeline)
              ? state.userStats.timeline.map(t => t.title.split(' keysini ')[0].replace(/['"]/g, '').trim())
              : [];
            
            const recommended = state.cases
              ? (state.cases.find(c => !completedTitles.some(t => c.title.replace(/['"]/g, '').includes(t))) || state.cases[0])
              : null;

            if (!recommended) {
              return `
                <div style="padding:20px; text-align:center; color:var(--text-secondary);">
                  Keyslar topilmadi.
                </div>
              `;
            }
            return `
              <div style="display:flex;gap:20px;align-items:flex-start">
                <div style="
                  width:64px;height:64px;border-radius:var(--radius-lg);
                  background:linear-gradient(135deg, var(--primary-light), var(--secondary-light));
                  display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;
                ">🩺</div>
                <div style="flex:1">
                  <h3 style="font-size:1.05rem;margin-bottom:4px">${recommended.title}</h3>
                  <div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px">
                    <span class="badge badge-warning">${recommended.difficulty}</span>
                    <span class="badge badge-gray">${recommended.category}</span>
                  </div>
                  <p class="text-sm text-secondary" style="margin-bottom:14px">
                    ${recommended.description}
                  </p>
                  <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="window.startCase('${recommended.id}')">
                    Boshlash ${icons.chevronRight}
                  </button>
                </div>
              </div>
            `;
          })()}
        </div>

        <!-- RIGHT: Today's Goals -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">🎯 Bugungi Maqsadlar</div>
            <span class="badge badge-success">${goalsDone}/${goals.length}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            ${goals.map(g => {
              let page = 'dashboard';
              if (g.text.includes('etika viktorinasini') || g.text.includes('etika qonunlarini')) page = 'ethics-test';
              else if (g.text.includes('Bemor muloqoti') || g.text.includes('Barcha keyslarni')) page = 'simulator';
              else if (g.text.includes('Laboratoriya')) page = 'laboratory';
              
              return `
                <div onclick="window.navigate('${page}')" style="
                  display:flex;align-items:center;gap:12px;
                  padding:12px 14px;border-radius:var(--radius-md);
                  background:${g.done ? 'var(--green-light)' : 'var(--surface)'};
                  transition:all var(--transition-fast);
                  cursor:pointer;
                " onmouseover="this.style.background='var(--border-light)'" onmouseout="this.style.background='${g.done ? 'var(--green-light)' : 'var(--surface)'}'">
                  <div style="
                    width:22px;height:22px;border-radius:50%;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    ${g.done
                      ? 'background:var(--green);color:white;'
                      : 'border:2px solid var(--border);background:white;'
                    }
                  ">
                    ${g.done ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                  </div>
                  <span class="text-sm ${g.done ? '' : 'font-medium'}" style="${g.done ? 'color:var(--green-dark);text-decoration:line-through;opacity:0.8' : 'color:var(--text)'}">
                    ${g.text}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 4. Competency Radar + Achievements -->
      <div class="grid-2 mb-6">
        <!-- LEFT: Radar Chart -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">📊 Kompetensiyalar Tahlili</div>
            <button class="btn btn-ghost btn-sm" onclick="${nav('results')}">Batafsil ${icons.chevronRight}</button>
          </div>
          <div style="padding:12px 0">
            ${radarChart()}
          </div>
          <div style="text-align:center;margin-top:4px">
            <span class="text-sm text-secondary">O'rtacha ball: </span>
            <span class="text-sm font-bold" style="color:var(--primary)">${Math.round((stats.radar.diagnostics + stats.radar.treatment + stats.radar.communication + stats.radar.ethics + stats.radar.law) / 5) || 50}%</span>
          </div>
        </div>

        <!-- RIGHT: Achievements -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">🏆 Yutuqlar</div>
            <span class="text-sm text-secondary">${achievements.filter(a => a.earned).length}/${achievements.length} ochilgan</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
            ${achievements.map(a => `
              <div style="
                text-align:center;padding:20px 8px;
                border-radius:var(--radius-lg);
                border:1px solid ${a.earned ? 'var(--border-light)' : 'var(--border)'};
                background:${a.earned ? 'var(--bg)' : 'var(--surface)'};
                ${a.earned ? '' : 'opacity:0.5;filter:grayscale(0.8);'}
                transition:all var(--transition-base);
                cursor:default;
              " ${a.earned ? 'onmouseover="this.style.boxShadow=\'var(--shadow-md)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.boxShadow=\'none\';this.style.transform=\'none\'"' : ''}>
                <div style="font-size:2rem;margin-bottom:8px;line-height:1">${a.emoji}</div>
                <div class="text-xs font-semibold" style="color:${a.earned ? 'var(--text)' : 'var(--text-muted)'}">
                  ${a.title}
                </div>
                <div class="text-xs" style="margin-top:4px;color:${a.earned ? 'var(--green)' : 'var(--text-muted)'}">
                  ${a.earned ? '✓ Qo\'lga kiritildi' : '🔒 Qulflangan'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 5. Weekly Activity + Timeline -->
      <div class="grid-2 mb-6">
        <!-- LEFT: Bar Chart -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">📈 Haftalik Faollik</div>
            <span class="badge badge-primary">Bu hafta</span>
          </div>
          <div style="display:flex;align-items:flex-end;gap:10px;height:160px;padding:8px 0">
            ${weekDays.map(d => {
              const pct = (d.hours / maxHours) * 100;
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%">
                  <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;width:100%">
                    <div style="
                      width:100%;
                      height:${pct}%;
                      min-height:8px;
                      background:linear-gradient(180deg, var(--primary) 0%, #3B82F6 100%);
                      border-radius:var(--radius-sm) var(--radius-sm) 4px 4px;
                      transition:height 0.5s ease;
                      position:relative;
                    " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                      <span style="
                        position:absolute;top:-20px;left:50%;transform:translateX(-50%);
                        font-size:0.667rem;font-weight:600;color:var(--text-secondary);white-space:nowrap;
                      ">${d.hours}s</span>
                    </div>
                  </div>
                  <span class="text-xs text-muted font-medium">${d.day}</span>
                </div>`;
            }).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light)">
            <span class="text-sm text-secondary">Jami: <strong style="color:var(--text)">${stats.weeklyHours} soat</strong></span>
            <span class="text-sm text-secondary">O'rtacha: <strong style="color:var(--primary)">${(stats.weeklyHours / 7).toFixed(1)} soat/kun</strong></span>
          </div>
        </div>

        <!-- RIGHT: Timeline -->
        <div class="card animate-in">
          <div class="card-header">
            <div class="card-title">🕐 So'nggi Faoliyatlar</div>
            <button class="btn btn-ghost btn-sm" onclick="${nav('results')}">Hammasi ${icons.chevronRight}</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:0;position:relative">
            ${timeline.map((t, i) => `
              <div style="display:flex;gap:16px;align-items:flex-start;padding:14px 0;${i < timeline.length - 1 ? 'border-bottom:1px solid var(--border-light);' : ''}">
                <div style="position:relative;display:flex;flex-direction:column;align-items:center;flex-shrink:0">
                  <div style="
                    width:12px;height:12px;border-radius:50%;
                    background:${t.color};
                    box-shadow:0 0 0 4px ${t.color}20;
                    flex-shrink:0;margin-top:3px;
                  "></div>
                </div>
                <div style="flex:1;min-width:0">
                  <div class="text-sm font-medium" style="margin-bottom:2px">${t.title}</div>
                  <div class="text-xs text-muted">${t.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 6. Notifications -->
      <div class="animate-in" style="margin-bottom:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:1.1rem">🔔 Xabarnomalar</h3>
          <button class="btn btn-ghost btn-sm" onclick="${nav('notifications')}">Barchasini ko'rish ${icons.chevronRight}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${notifications.map(n => `
            <div class="card" style="
              padding:18px 22px;display:flex;align-items:center;gap:16px;
              cursor:pointer;border-radius:var(--radius-lg);
            " onclick="${nav('notifications')}">
              <div style="
                width:44px;height:44px;border-radius:var(--radius-md);
                display:flex;align-items:center;justify-content:center;
                font-size:1.3rem;flex-shrink:0;
                ${notifBadge(n.type)}
              ">${n.icon}</div>
              <div style="flex:1;min-width:0">
                <div class="text-sm font-semibold" style="margin-bottom:2px">${n.title}</div>
                <div class="text-xs text-secondary" style="line-height:1.5">${n.desc}</div>
              </div>
              <div class="text-xs text-muted" style="white-space:nowrap;flex-shrink:0">${n.time}</div>
            </div>
          `).join('')}
        </div>
      </div>

    </div><!-- /page-body -->
  `;
}
