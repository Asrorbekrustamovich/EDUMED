window.applyForVolunteerProject = async function(projectId, points) {
  const token = localStorage.getItem('edumed_token');
  if (!token) {
    alert('Tizimga kirmagansiz!');
    return;
  }
  
  try {
    const res = await fetch(`${window.API}/api/volunteer/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ projectId, pointsReward: points })
    });
    
    if (res.ok) {
      const data = await res.json();
      
      // Update global user points in state
      window.app.user.points = data.points;
      
      if (!window.app.appliedVolunteers) window.app.appliedVolunteers = [];
      window.app.appliedVolunteers.push(projectId);
      
      // Prepend to timeline
      if (!window.app.volunteerTimeline) window.app.volunteerTimeline = [];
      window.app.volunteerTimeline.unshift({
        title: projectId === 'charity' ? 'Shifoxona Xayriya Tashrifi' : 'Qon Topshirish Aksiyasi',
        meta: `Bugun • +${points} ball • Arizangiz qabul qilindi`
      });
      
      alert('Arizangiz muvaffaqiyatli qabul qilindi! Ballar hisobingizga qo\'shildi.');
      window.render();
    } else {
      alert('Arizani topshirib bo\'lmadi.');
    }
  } catch (err) {
    console.error('Error applying for volunteer:', err);
    alert('Server bilan aloqa uzildi.');
  }
};

export function renderVolunteer(state, icons) {
  const userPoints = state.user.points || 0;
  
  // Calculate level
  const isGold = userPoints >= 3000;
  const levelName = isGold ? 'Oltin' : 'Kumush';
  const nextMilestone = isGold ? 5000 : 3000;
  const nextLevelName = isGold ? 'Platina' : 'Oltin';
  const pointsNeeded = Math.max(0, nextMilestone - userPoints);
  const progressPercent = Math.min(100, Math.round((userPoints / nextMilestone) * 100));

  const applied = state.appliedVolunteers || [];
  const timelineItems = state.volunteerTimeline || [];

  return `
    <div class="page-header animate-in">
      <div>
        <h1 style="font-size:1.4rem">Tibbiy Volontyorlik</h1>
        <div class="text-sm text-secondary">Nazariy bilimlarni jamiyat uchun amaliyotga tadbiq eting</div>
      </div>
      <div class="page-header-actions">
        <div class="badge badge-primary px-3 py-2 text-sm" style="font-size: 0.9rem">
          <span class="mr-2">⭐</span> Ballar: ${userPoints}
        </div>
      </div>
    </div>
    
    <div class="page-body">
      <!-- Active Projects -->
      <h3 class="font-semibold mb-4 animate-in">Dolzarb Volontyorlik Loyihalari</h3>
      <div class="grid-3 mb-8 animate-in animate-delay-1">
        ${(state.volunteerProjects || []).map(proj => {
          const isApplied = applied.includes(proj.id);
          const currentSlots = isApplied ? proj.slotsCurrent + 1 : proj.slotsCurrent;
          const fillPercent = Math.round((currentSlots / proj.slotsMax) * 100);
          
          return `
            <div class="card" ${isApplied ? 'style="border: 1px solid var(--primary);"' : ''}>
              <div class="flex-between mb-3">
                <div class="avatar bg-primary-light text-primary" style="font-size:1.5rem">${proj.avatar}</div>
                ${isApplied 
                  ? `<span class="badge badge-success">Siz Qabul Qilingansiz</span>`
                  : `<span class="badge ${proj.tagClass || 'badge-primary'}">${proj.tag}</span>`
                }
              </div>
              <h4 class="font-semibold mb-2">${proj.title}</h4>
              <p class="text-sm text-secondary mb-4 line-clamp-2">${proj.description}</p>
              
              <div class="flex-col gap-2 mb-4">
                <div class="flex items-center gap-2 text-sm text-muted">
                  ${icons.calendar} <span>${proj.date}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted">
                  <span style="width:20px;text-align:center">📍</span> <span>${proj.location}</span>
                </div>
              </div>
              
              <div class="mb-4">
                <div class="flex-between text-xs font-semibold mb-1">
                  <span>Qabul Qilinganlar</span>
                  <span>${currentSlots}/${proj.slotsMax} ta joy</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${fillPercent}%"></div></div>
              </div>
              ${isApplied
                ? `<button class="btn btn-outline w-full" disabled>Ariza topshirildi</button>`
                : `<button class="btn btn-primary w-full" onclick="window.applyForVolunteerProject('${proj.id}', ${proj.pointsReward})">Ariza Berish (+${proj.pointsReward} ball)</button>`
              }
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- Stats & Timeline -->
      <div class="grid-2 mb-6 animate-in animate-delay-2">
        <div class="card">
          <h3 class="card-title mb-4">Faoliyat Tarixi</h3>
          <div class="timeline">
            ${timelineItems.length > 0 ? timelineItems.map(item => `
              <div class="timeline-item">
                <div class="timeline-dot green"></div>
                <div class="timeline-content">
                  <div class="timeline-title">${item.title}</div>
                  <div class="timeline-meta">${item.meta}</div>
                </div>
              </div>
            `).join('') : `
              <div style="padding:20px 0; text-align:center; color:var(--text-secondary); font-size:0.85rem;">
                Hozircha faoliyatlar tarixi mavjud emas.
              </div>
            `}
          </div>
        </div>
        
        <div class="card bg-primary-light" style="border:none">
          <div class="flex-col h-full flex-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-3xl">🌟</span>
                <h3 class="font-bold text-primary text-xl">Volontyorlik Darajasi: ${levelName}</h3>
              </div>
              <p class="text-sm text-secondary mb-6">
                Siz hozirda faol volontyorlar reytingida o'sib boryapsiz. ${nextLevelName} darajaga yetish uchun yana ${pointsNeeded} ball to'plashingiz kerak.
              </p>
              
              <div class="mb-2 flex-between text-sm font-semibold">
                <span>${userPoints} ball</span>
                <span>${nextMilestone} ball (${nextLevelName})</span>
              </div>
              <div class="progress-bar mb-6" style="height: 12px;"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
            </div>
            
            <div class="p-4 bg-white rounded-lg">
              <h4 class="font-semibold text-sm mb-2">Oltin Daraja Imtiyozlari:</h4>
              <ul class="text-sm text-secondary" style="padding-left: 20px;">
                <li class="mb-1">Respublika tibbiyot konferensiyalariga bepul yo'llanma</li>
                <li class="mb-1">Platformadagi premium klinik keyslarga ruxsat</li>
                <li>Rektorat tomonidan maxsus stipendiya tavsiyasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;
}
