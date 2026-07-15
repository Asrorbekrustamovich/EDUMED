// Helper to generate dynamic lab findings based on case parameters
function getLabTestsForCase(caseObj) {
  if (!caseObj) return [];
  const category = caseObj.category || 'Terapiya';
  const title = caseObj.title || '';
  
  const tests = [];
  
  if (category === 'Xirurgiya') {
    tests.push({
      id: 'cbc',
      category: 'qon',
      icon: '🩸',
      title: 'Umumiy Qon Tahlili (CBC)',
      status: 'Tayyor',
      time: 'Bugun, 09:30',
      type: 'values',
      data: [
        { label: 'WBC (Leykotsitlar)', value: '12.4 x10⁹/L ↑', highlight: true },
        { label: 'RBC (Eritrotsitlar)', value: '4.5 x10¹²/L' },
        { label: 'HGB (Gemoglobin)', value: '13.2 g/dL' },
        { label: 'PLT (Trombotsitlar)', value: '245 x10⁹/L' }
      ]
    });
    tests.push({
      id: 'urine',
      category: 'siydik',
      icon: '🧪',
      title: 'Siydik Tahlili',
      status: 'Tayyor',
      time: 'Bugun, 09:45',
      type: 'values',
      data: [
        { label: 'Rangi', value: 'Saman-sariq' },
        { label: 'Tiniqligi', value: 'Tiniq' },
        { label: 'Oqsil', value: 'Yo\'q' },
        { label: 'Leykotsitlar', value: '1-2 ta ko\'ruv maydonida' }
      ]
    });
    tests.push({
      id: 'uzi',
      category: 'uzi',
      icon: '📡',
      title: 'Qorin Ultratovush (UZI)',
      status: 'Tayyor',
      time: 'Bugun, 10:15',
      type: 'text',
      data: title.toLowerCase().includes('appenditsit')
        ? 'Xulosa: O\'tkir appenditsit belgilari. Chuvalchangsimon o\'simta qalinligi 9mm, devorlari qalinlashgan, peristaltika yo\'q. Atrof to\'qimalarda oz miqdorda yallig\'lanish suyuqligi aniqlandi. Homila holati me\'yorda.'
        : 'Xulosa: Qorin bo\'shlig\'i a\'zolari (jigar, o\'t pufagi, taloq) o\'lchamlari me\'yorda. O\'tkir patologik o\'zgarishlar aniqlanmadi.'
    });
  } else if (category === 'Kardiologiya') {
    tests.push({
      id: 'ekg',
      category: 'uzi',
      icon: '📈',
      title: 'Elektrokardiogramma (EKG)',
      status: 'Tayyor',
      time: 'Bugun, 08:15',
      type: 'text',
      data: title.toLowerCase().includes('infarkt')
        ? 'Xulosa: EKGda II, III, aVF tarmoqlarida ST segmenti ko\'tarilishi (STEMI), o\'tkir orqa-diapozitar miokard infarkti belgilari aniqlandi. Ritm sinusli, YQS 95 t/m.'
        : 'Xulosa: Sinusli ritm, yurak qisqarishlar soni 78 t/m. Normada.'
    });
    tests.push({
      id: 'troponin',
      category: 'qon',
      icon: '🩸',
      title: 'Kardiomarkerlar (Troponin)',
      status: 'Tayyor',
      time: 'Bugun, 08:30',
      type: 'values',
      data: [
        { label: 'Troponin I', value: title.toLowerCase().includes('infarkt') ? '1.8 ng/ml ↑' : '0.01 ng/ml', highlight: title.toLowerCase().includes('infarkt') },
        { label: 'CK-MB', value: title.toLowerCase().includes('infarkt') ? '42 U/L ↑' : '15 U/L', highlight: title.toLowerCase().includes('infarkt') },
        { label: 'Miyoglobin', value: '45 ng/ml' }
      ]
    });
    tests.push({
      id: 'coag',
      category: 'qon',
      icon: '🩸',
      title: 'Koagulyatsiya Paneli',
      status: 'Tayyor',
      time: 'Bugun, 08:30',
      type: 'values',
      data: [
        { label: 'INR', value: '1.1' },
        { label: 'Fibrinogen', value: '3.5 g/L' },
        { label: 'APTT', value: '30 s' }
      ]
    });
  } else {
    tests.push({
      id: 'cbc',
      category: 'qon',
      icon: '🩸',
      title: 'Umumiy Qon Tahlili (CBC)',
      status: 'Tayyor',
      time: 'Bugun, 09:00',
      type: 'values',
      data: [
        { label: 'WBC (Leykotsitlar)', value: '8.2 x10⁹/L' },
        { label: 'RBC (Eritrotsitlar)', value: '4.2 x10¹²/L' },
        { label: 'HGB (Gemoglobin)', value: '12.8 g/dL' }
      ]
    });
    tests.push({
      id: 'biochem',
      category: 'qon',
      icon: '🩸',
      title: 'Biokimyoviy Tahlil',
      status: 'Tayyor',
      time: 'Bugun, 09:15',
      type: 'values',
      data: [
        { label: 'Glyukoza', value: title.toLowerCase().includes('diabet') ? '14.2 mmol/L ↑' : '5.1 mmol/L', highlight: title.toLowerCase().includes('diabet') },
        { label: 'Kreatinin', value: '75 µmol/L' },
        { label: 'Mochevina', value: '5.2 mmol/L' }
      ]
    });
    tests.push({
      id: 'urine',
      category: 'siydik',
      icon: '🧪',
      title: 'Siydik Tahlili',
      status: 'Tayyor',
      time: 'Bugun, 09:20',
      type: 'values',
      data: [
        { label: 'Oqsil', value: 'Yo\'q' },
        { label: 'Glyukoza', value: title.toLowerCase().includes('diabet') ? 'Musbat (++) ↑' : 'Yo\'q', highlight: title.toLowerCase().includes('diabet') },
        { label: 'Ketonlar', value: title.toLowerCase().includes('diabet') ? 'Musbat (+) ↑' : 'Yo\'q', highlight: title.toLowerCase().includes('diabet') }
      ]
    });
  }
  
  return tests;
}

// Global actions registered once on window
window.filterLab = function(category, element) {
  document.querySelectorAll('.lab-nav-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  
  document.querySelectorAll('.lab-card').forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.confirmLabTest = function(testTitle) {
  if (!window.app.confirmedLabs) window.app.confirmedLabs = [];
  if (!window.app.confirmedLabs.includes(testTitle)) {
    window.app.confirmedLabs.push(testTitle);
    
    // Append to active simulator chat session
    if (window.app.simulationHistory) {
      window.app.simulationHistory.push({
        speaker: 'system',
        text: `Laboratoriya xulosasi ko'rildi va tasdiqlandi: ${testTitle}`
      });
    }
  }
  alert(`"${testTitle}" xulosasi tasdiqlandi va simulyatsiya tarixiga yozildi!`);
  window.navigate('simulator');
};

export function renderLaboratory(state, icons) {
  const activeCase = state.currentCase;
  
  if (!activeCase) {
    return `
      <div class="page-header animate-in">
        <h1 style="font-size:1.4rem">Klinik Laboratoriya</h1>
      </div>
      <div class="page-body flex-center" style="min-height: 400px; flex-direction:column; text-align:center;">
        <div style="font-size:4rem; margin-bottom:16px;">🔬</div>
        <h2 style="font-size:1.25rem; margin-bottom:8px; color:var(--text);">Faol Simulyatsiya Mavjud Emas</h2>
        <p style="color:var(--text-secondary); max-width:400px; margin-bottom:24px; font-size:0.95rem; line-height:1.5;">
          Bemor tahlillari bilan ishlash uchun avval "Simulyatsiya" bo'limidan biror keysni boshlang.
        </p>
        <button class="btn btn-primary" onclick="window.navigate('simulator')">
          Keysni Boshlash
        </button>
      </div>
    `;
  }

  const tests = getLabTestsForCase(activeCase);
  const counts = {
    qon: tests.filter(t => t.category === 'qon').length,
    siydik: tests.filter(t => t.category === 'siydik').length,
    uzi: tests.filter(t => t.category === 'uzi').length
  };

  return `
    <div class="page-header animate-in">
      <div class="flex items-center gap-3">
        <button class="btn-icon" onclick="window.navigate('simulator')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h1 style="font-size:1.4rem">Klinik Laboratoriya</h1>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">Bemor: ${activeCase.patientName || 'Noma\'lum'}</div>
        </div>
      </div>
    </div>
    
    <div class="page-body">
      <div class="grid-sidebar h-full">
        <!-- Sidebar -->
        <div class="card h-full" style="padding: 16px 0;">
          <h3 class="px-4 mb-4 text-sm uppercase tracking-wider text-muted">Kategoriyalar</h3>
          <div class="nav-item lab-nav-item active px-4" style="border-radius: 0; margin-bottom: 2px; cursor:pointer;" onclick="window.filterLab('all', this)">
            <span>📋 Barchasi</span>
          </div>
          <div class="nav-item lab-nav-item px-4" style="border-radius: 0; margin-bottom: 2px; cursor:pointer;" onclick="window.filterLab('qon', this)">
            <span>🩸 Qon Tahlillari</span>
            <span class="badge badge-gray ml-auto">${counts.qon}</span>
          </div>
          <div class="nav-item lab-nav-item px-4" style="border-radius: 0; margin-bottom: 2px; cursor:pointer;" onclick="window.filterLab('siydik', this)">
            <span>🧪 Siydik Tahlillari</span>
            <span class="badge badge-gray ml-auto">${counts.siydik}</span>
          </div>
          <div class="nav-item lab-nav-item px-4" style="border-radius: 0; margin-bottom: 2px; cursor:pointer;" onclick="window.filterLab('uzi', this)">
            <span>📡 UZI & Diagnostika</span>
            <span class="badge badge-gray ml-auto">${counts.uzi}</span>
          </div>
        </div>
        
        <!-- Grid of Tests -->
        <div class="grid-3">
          ${tests.map((t, idx) => `
            <div class="card card-flat lab-card animate-in" data-category="${t.category}" style="display:flex; flex-direction:column; justify-content:space-between; animation-delay: ${idx * 0.05}s;">
              <div>
                <div class="flex-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="avatar avatar-sm text-primary bg-primary-light" style="font-size:1.2rem;">${t.icon}</div>
                    <span class="font-semibold text-sm">${t.title}</span>
                  </div>
                  <span class="badge badge-success">${t.status}</span>
                </div>
                <div class="text-xs text-muted mb-4">${t.time}</div>
                
                ${t.type === 'values' ? `
                  <div class="flex-col gap-2 mb-4">
                    ${t.data.map(d => `
                      <div class="flex-between text-sm">
                        <span class="text-secondary">${d.label}</span>
                        <span class="font-semibold ${d.highlight ? 'text-danger' : ''}">${d.value}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div class="p-2 bg-primary-light rounded-md text-sm mb-4" style="border-left: 3px solid var(--primary); line-height:1.4;">
                    <strong>Xulosa:</strong> ${t.data}
                  </div>
                `}
              </div>
              
              <button class="btn btn-primary btn-sm w-full" style="margin-top:16px;" onclick="window.confirmLabTest('${t.title}')">
                Xulosani Tasdiqlash
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
