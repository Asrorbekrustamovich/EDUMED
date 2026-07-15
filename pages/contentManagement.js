// contentManagement.js — Kontent boshqaruvi (bazadagi real keyslar bilan)
export function renderContentManagement(state, icons) {
  const d = state.contentData;

  if (!d) {
    return `
      <div style="padding:32px 40px;">
        <h1 style="font-size:28px;font-weight:700;color:#111827;">Kontent Boshqaruvi</h1>
        <div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);margin-top:24px;">Ma'lumotlar yuklanmoqda...</div>
      </div>`;
  }

  const status = state.contentStatus || '';
  const q = state.contentQuery || '';

  // Sahifalash tugmalari
  const pages = [];
  const start = Math.max(1, d.page - 2);
  const end = Math.min(d.totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return `
    <div style="padding:32px 40px;max-width:1400px;margin:0 auto;font-family:'Inter',sans-serif;">

      <!-- Page Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
        <div>
          <h1 style="font-size:28px;font-weight:700;color:#111827;margin:0;">Kontent Boshqaruvi</h1>
          <p style="font-size:14px;color:#6B7280;margin:4px 0 0;">Bazada ${d.counts.cases} ta keys, ${d.counts.ethics} ta etika test savoli</p>
        </div>
        <div style="display:flex;gap:12px;align-items:center;">
          <div style="position:relative;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="content-search-input" value="${q.replace(/"/g, '&quot;')}" placeholder="Keys nomi bo'yicha qidirish..." onkeydown="if(event.key==='Enter')window.contentSearch()" style="width:260px;padding:10px 14px 10px 38px;border:1px solid #E5E7EB;border-radius:12px;font-size:14px;font-family:inherit;outline:none;background:#F8FAFC;"/>
          </div>
          <button onclick="window.contentSearch()" style="padding:10px 16px;border:1px solid #E5E7EB;border-radius:12px;background:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Qidirish</button>
          <button onclick="window.navigate('scenario-builder')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:#2563EB;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Yangi Keys
          </button>
        </div>
      </div>

      <!-- Filter Row (real ishlaydi) -->
      <div style="display:flex;gap:10px;margin-bottom:24px;">
        ${_filterChip('Barchasi (' + d.counts.cases + ')', status === '', `window.contentFilter('')`)}
        ${_filterChip('Nashr qilingan (' + d.counts.active + ')', status === 'active', `window.contentFilter('active')`)}
        ${_filterChip('Qoralama (' + d.counts.draft + ')', status === 'draft', `window.contentFilter('draft')`)}
        <div style="flex:1;"></div>
        <span style="font-size:13px;color:#6B7280;align-self:center;">Topildi: ${d.total} ta</span>
      </div>

      <!-- Content Cards Grid (real keyslar) -->
      ${d.items.length === 0 ? `<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:60px;text-align:center;color:#6B7280;">Hech narsa topilmadi.</div>` : `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
        ${d.items.map(item => _contentCard(item)).join('')}
      </div>`}

      <!-- Pagination (real ishlaydi) -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;padding-top:20px;border-top:1px solid #E5E7EB;">
        <span style="font-size:13px;color:#6B7280;">Sahifa ${d.page} / ${d.totalPages} — jami ${d.total} ta keys</span>
        <div style="display:flex;gap:6px;">
          <button ${d.page <= 1 ? 'disabled' : ''} onclick="window.contentGoPage(${d.page - 1})" style="width:34px;height:34px;border-radius:10px;border:1px solid #E5E7EB;background:#fff;cursor:${d.page <= 1 ? 'default' : 'pointer'};display:flex;align-items:center;justify-content:center;opacity:${d.page <= 1 ? '.4' : '1'};">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          ${pages.map(p => `
            <button onclick="window.contentGoPage(${p})" style="width:34px;height:34px;border-radius:10px;border:${p === d.page ? 'none' : '1px solid #E5E7EB'};background:${p === d.page ? '#2563EB' : '#fff'};color:${p === d.page ? '#fff' : '#374151'};font-size:13px;font-weight:${p === d.page ? '700' : '600'};cursor:pointer;">${p}</button>
          `).join('')}
          <button ${d.page >= d.totalPages ? 'disabled' : ''} onclick="window.contentGoPage(${d.page + 1})" style="width:34px;height:34px;border-radius:10px;border:1px solid #E5E7EB;background:#fff;cursor:${d.page >= d.totalPages ? 'default' : 'pointer'};display:flex;align-items:center;justify-content:center;opacity:${d.page >= d.totalPages ? '.4' : '1'};">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ── helpers ── */

function _filterChip(label, active, onclickFn) {
  return `
    <button onclick="${onclickFn}" style="padding:6px 16px;border-radius:99px;border:1px solid ${active ? '#2563EB' : '#E5E7EB'};background:${active ? '#EEF2FF' : '#fff'};font-size:13px;font-weight:600;color:${active ? '#2563EB' : '#6B7280'};cursor:pointer;font-family:inherit;transition:all .15s;">
      ${label}
    </button>`;
}

function _contentCard(item) {
  const s = item.isActive
    ? { bg: '#DCFCE7', color: '#166534', label: 'Nashr qilingan', dot: '#22C55E' }
    : { bg: '#F3F4F6', color: '#374151', label: 'Qoralama', dot: '#9CA3AF' };
  const diffMap = {
    'Oson': { bg: '#DCFCE7', color: '#166534' },
    "O'rta": { bg: '#FEF9C3', color: '#854D0E' },
    'Qiyin': { bg: '#FEE2E2', color: '#991B1B' }
  };
  const dd = diffMap[item.difficulty] || diffMap["O'rta"];

  return `
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <span style="font-size:12px;font-weight:600;color:#6B7280;display:flex;align-items:center;gap:5px;">🏥 ${item.category}</span>
        <span style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:600;background:${s.bg};color:${s.color};">
          <span style="width:6px;height:6px;border-radius:50%;background:${s.dot};"></span>
          ${s.label}
        </span>
      </div>

      <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 10px;line-height:1.4;flex:1;">${item.title}</h3>

      <div style="margin-bottom:14px;display:flex;gap:6px;">
        <span style="padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;background:${dd.bg};color:${dd.color};">${item.difficulty}</span>
        <span style="padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;background:#EFF6FF;color:#1E40AF;">${item.steps} qadam</span>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid #F3F4F6;">
        <div style="font-size:12px;color:#6B7280;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ${item.attempts} marta yechilgan
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-top:14px;">
        <button onclick="window.toggleCaseActive('${item.id}', ${item.isActive ? 'false' : 'true'})" style="flex:1;padding:8px;border-radius:10px;border:1px solid #E5E7EB;background:#fff;font-size:12px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;">
          ${item.isActive ? '📥 Qoralamaga' : '🚀 Nashr qilish'}
        </button>
        <button onclick="window.startCase('${item.id}')" style="flex:1;padding:8px;border-radius:10px;border:1px solid #DBEAFE;background:#EFF6FF;font-size:12px;font-weight:600;color:#2563EB;cursor:pointer;font-family:inherit;">
          ▶ Sinab ko'rish
        </button>
        <button onclick="window.deleteCaseContent('${item.id}')" style="padding:8px 12px;border-radius:10px;border:1px solid #FEE2E2;background:#FEF2F2;font-size:12px;font-weight:600;color:#EF4444;cursor:pointer;font-family:inherit;">
          🗑
        </button>
      </div>
    </div>`;
}
