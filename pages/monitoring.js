// monitoring.js — Monitoring sahifasi (barcha raqamlar bazadan, real)
export function renderMonitoring(state, icons) {
  const d = state.adminData;

  if (!d) {
    return `
      <div style="padding:32px 40px;">
        <h1 style="font-size:28px;font-weight:700;color:#111827;">Monitoring</h1>
        <div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);margin-top:24px;">Ma'lumotlar yuklanmoqda...</div>
      </div>`;
  }

  const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'];
  const monthLabel = `${monthNames[d.month - 1]} ${d.year}`;
  const fmtTime = (t) => {
    const dt = new Date(t);
    return dt.toLocaleDateString('uz-UZ') + ' ' + dt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return `
    <div style="padding:32px 40px;max-width:1400px;margin:0 auto;font-family:'Inter',sans-serif;">

      <!-- Page Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
        <div>
          <h1 style="font-size:28px;font-weight:700;color:#111827;margin:0;">Monitoring</h1>
          <p style="font-size:14px;color:#6B7280;margin:4px 0 0;">Tizim va foydalanuvchi faoliyati — jonli ma'lumotlar</p>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid #E5E7EB;border-radius:12px;background:#fff;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style="font-size:13px;font-weight:600;color:#374151;">${monthLabel}</span>
          </div>
          <button onclick="window.exportMonitoringCSV()" style="padding:10px 18px;border-radius:12px;border:1px solid #E5E7EB;background:#fff;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Eksport (CSV)
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards (real) -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:32px;">
        ${_mKpi('Foydalanuvchilar', String(d.counts.users), `${d.counts.students} talaba, ${d.counts.teachers} o'qituvchi`, '#2563EB', _uIcon('#2563EB'), true)}
        ${_mKpi('Bugungi Sessiyalar', String(d.counts.resultsToday), `Jami ${d.counts.resultsTotal} ta natija bazada`, '#0EA5E9', _fIcon('#0EA5E9'))}
        ${_mKpi("O'rtacha Sessiya", `${d.avgSession} min`, d.counts.resultsTotal > 0 ? "Barcha natijalar bo'yicha" : "Hali natijalar yo'q", '#22C55E', _cIcon('#22C55E'), true)}
        ${_mKpi("O'rtacha Muvaffaqiyat", `${d.avgSuccess}%`, d.avgSuccess >= 70 ? 'Yaxshi ko\'rsatkich' : d.counts.resultsTotal > 0 ? "E'tibor talab etiladi" : "Ma'lumot yo'q", d.avgSuccess >= 70 ? '#22C55E' : '#F59E0B', _aIcon(d.avgSuccess >= 70 ? '#22C55E' : '#F59E0B'))}
      </div>

      <!-- Heatmap + DB info -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">

        <!-- Real Activity Heatmap -->
        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
            <h2 style="font-size:17px;font-weight:700;color:#111827;margin:0;">Faollik Xaritasi (sessiyalar/kun)</h2>
            <span style="font-size:12px;color:#6B7280;">${monthLabel}</span>
          </div>
          ${_realHeatmap(d.heatmap)}
          <div style="display:flex;align-items:center;gap:6px;margin-top:14px;font-size:11px;color:#9CA3AF;">
            <span>Kam</span>
            ${['#F3F4F6', '#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'].map(c => `<div style="width:14px;height:14px;border-radius:3px;background:${c};"></div>`).join('')}
            <span>Ko'p</span>
          </div>
        </div>

        <!-- Real system info -->
        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;">
          <h2 style="font-size:17px;font-weight:700;color:#111827;margin:0 0 20px;">Tizim Holati (real)</h2>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${_alert('Baza', `Ma'lumotlar bazasi hajmi: ${d.dbSizeMB} MB`, `${d.counts.cases} faol keys, ${d.counts.ethicsQuestions} test savoli`, '#0EA5E9')}
            ${_alert('Kontent', `${d.counts.cases} ta faol keys / jami ${d.counts.casesAll} ta`, `${d.counts.projects} ta volontyorlik loyihasi`, '#22C55E')}
            ${d.avgSuccess < 60 && d.counts.resultsTotal > 0
              ? _alert('Ogohlantirish', `O'rtacha muvaffaqiyat ${d.avgSuccess}% — past`, "Qo'shimcha mashg'ulot tavsiya etiladi", '#F59E0B')
              : _alert('Holat', 'Tizim barqaror ishlamoqda', 'Kritik ogohlantirishlar yo\'q', '#22C55E')}
            ${_alert('Foydalanuvchilar', `${d.counts.students} talaba, ${d.counts.teachers} o'qituvchi, ${d.counts.admins} admin`, `Jami: ${d.counts.users} ta hisob`, '#2563EB')}
          </div>
        </div>
      </div>

      <!-- Activity Journal (real) + Users summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;">
          <h2 style="font-size:17px;font-weight:700;color:#111827;margin:0 0 20px;">Faollik Jurnali (real)</h2>
          <div style="display:flex;flex-direction:column;gap:0;">
            ${d.activity.length === 0 ? `<p style="color:#6B7280;font-size:14px;text-align:center;padding:20px;">Hali faoliyat qayd etilmagan.</p>` : ''}
            ${d.activity.map((a, i) => _actItem(a.user, a.action, fmtTime(a.time), a.color, i === d.activity.length - 1)).join('')}
          </div>
        </div>

        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
            <h2 style="font-size:17px;font-weight:700;color:#111827;margin:0;">Hisobotlar (real ma'lumotdan)</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${_reportItem('Talabalar Natijalari (CSV)', "Barcha talabalar ko'rsatkichlari", 'CSV', `window.exportStudentsCSV()`)}
            ${_reportItem('Faollik Jurnali (CSV)', 'Oxirgi sessiyalar va harakatlar', 'CSV', `window.exportActivityCSV()`)}
            ${_reportItem('Sahifa Hisoboti (PDF)', 'Joriy monitoring sahifasi PDF shaklda', 'PDF', `window.downloadPDF('Monitoring_hisoboti.pdf')`)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── helpers ── */

function _mKpi(label, value, sub, color, iconSvg, trendUp) {
  return `
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:13px;font-weight:600;color:#6B7280;">${label}</span>
        <div style="width:40px;height:40px;border-radius:12px;background:${color}10;display:flex;align-items:center;justify-content:center;">${iconSvg}</div>
      </div>
      <span style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-.5px;">${value}</span>
      <span style="font-size:13px;color:${trendUp ? '#22C55E' : '#6B7280'};">${sub}</span>
    </div>`;
}

function _uIcon(c) { return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
function _fIcon(c) { return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`; }
function _cIcon(c) { return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`; }
function _aIcon(c) { return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`; }

// Real heatmap — kunlik sessiyalar sonidan quriladi
function _realHeatmap(heatmap) {
  const colorMap = ['#F3F4F6', '#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'];
  const max = Math.max(1, ...heatmap);
  const level = (v) => v === 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4));

  const dayLabels = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
    .map(dl => `<div style="text-align:center;font-size:11px;font-weight:600;color:#9CA3AF;">${dl}</div>`).join('');

  // Oy birinchi kunining hafta kuni (Du=0)
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  let startIdx = first.getDay() - 1; if (startIdx < 0) startIdx = 6;

  const cells = [];
  for (let i = 0; i < startIdx; i++) cells.push(`<div style="aspect-ratio:1;border-radius:4px;background:#FAFAFA;"></div>`);
  heatmap.forEach((v, di) => {
    const l = level(v);
    cells.push(`<div title="${di + 1}-kun: ${v} ta sessiya" style="aspect-ratio:1;border-radius:6px;background:${colorMap[l]};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:${l >= 3 ? '#fff' : '#6B7280'};cursor:default;">${di + 1}</div>`);
  });

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(`
      <div style="display:grid;grid-template-columns:32px repeat(7,1fr);gap:4px;margin-bottom:4px;">
        <div style="display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#9CA3AF;">H${Math.floor(i / 7) + 1}</div>
        ${cells.slice(i, i + 7).join('')}
        ${Array(Math.max(0, 7 - cells.slice(i, i + 7).length)).fill('<div></div>').join('')}
      </div>`);
  }

  return `
    <div style="display:grid;grid-template-columns:32px repeat(7,1fr);gap:4px;margin-bottom:8px;">
      <div></div>${dayLabels}
    </div>
    ${rows.join('')}`;
}

function _alert(severity, text, sub, color) {
  return `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:${color}08;border-radius:14px;border-left:3px solid ${color};">
      <div style="width:8px;height:8px;border-radius:50%;background:${color};margin-top:5px;flex-shrink:0;"></div>
      <div style="flex:1;min-width:0;">
        <span style="font-size:12px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:.3px;">${severity}</span>
        <div style="font-size:13px;color:#374151;line-height:1.4;">${text}</div>
        <div style="font-size:11px;color:#9CA3AF;margin-top:4px;">${sub}</div>
      </div>
    </div>`;
}

function _actItem(user, action, time, color, isLast) {
  const initials = user.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return `
    <div style="display:flex;gap:14px;padding-bottom:${isLast ? '0' : '16px'};">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:34px;height:34px;border-radius:50%;background:${color}15;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${color};flex-shrink:0;">${initials}</div>
        ${isLast ? '' : `<div style="width:2px;flex:1;background:#E5E7EB;margin-top:6px;"></div>`}
      </div>
      <div style="padding-top:4px;">
        <div style="font-size:14px;color:#111827;line-height:1.4;">
          <span style="font-weight:600;">${user}</span>
          <span style="color:#6B7280;font-weight:400;"> ${action}</span>
        </div>
        <div style="font-size:12px;color:#9CA3AF;margin-top:3px;">${time}</div>
      </div>
    </div>`;
}

function _reportItem(title, sub, format, onclickFn) {
  const formatColors = {
    'PDF': { bg: '#FEE2E2', color: '#991B1B' },
    'CSV': { bg: '#DBEAFE', color: '#1E40AF' }
  };
  const fc = formatColors[format] || formatColors['PDF'];
  return `
    <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:#F8FAFC;border-radius:14px;">
      <div style="width:36px;height:36px;border-radius:10px;background:${fc.bg};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${fc.color};flex-shrink:0;">${format}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:600;color:#111827;">${title}</div>
        <div style="font-size:12px;color:#9CA3AF;margin-top:2px;">${sub}</div>
      </div>
      <button onclick="${onclickFn}" style="padding:6px 12px;border-radius:8px;border:1px solid #E5E7EB;background:#fff;font-size:11px;font-weight:600;color:#2563EB;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Yuklab olish
      </button>
    </div>`;
}
