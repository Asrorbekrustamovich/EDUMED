// EduMed Deontolog — Landing Page Module

export function renderLanding(state, icons) {
  return `
    <!-- ======= NAVIGATION ======= -->
    <nav class="landing-nav">
      <div class="logo">
        <div class="logo-icon">🏥</div>
        <span>EduMed Deontolog</span>
      </div>
      <div class="nav-links">
        <a href="#platform">Platforma</a>
        <a href="#features">Xususiyatlar</a>
        <a href="#cases">Keyslar</a>
        <a href="#pricing">Narxlar</a>
      </div>
      <div class="nav-actions">
        <button class="btn btn-ghost" onclick="window.navigate('login')">Kirish</button>
        <button class="btn btn-primary" onclick="window.navigate('register')">Boshlash</button>
      </div>
    </nav>

    <!-- ======= HERO SECTION ======= -->
    <section class="hero">
      <div class="hero-content">
        <div style="display:inline-flex;align-items:center;gap:8px;background:var(--primary-light);padding:6px 16px;border-radius:var(--radius-full);margin-bottom:24px;">
          <span style="width:8px;height:8px;border-radius:50%;background:var(--green);display:inline-block;"></span>
          <span style="font-size:0.8rem;font-weight:600;color:var(--primary);">Yangi: AI-asosidagi tahlil moduli ishga tushdi</span>
        </div>
        <h1>Kelajak Shifokorlari Uchun <span>AI-Simulyatsiya</span> Platformasi</h1>
        <p>
          Tibbiy etika va deontologiyani interaktiv klinik keyslar orqali o'rganing. 
          Sun'iy intellekt yordamida real bemorlar bilan ishlash tajribasini oshiring va 
          professional qarorlar qabul qilishni mashq qiling.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" onclick="window.navigate('login')">
            Simulyatsiyani Boshlash
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="btn btn-outline btn-lg" onclick="window.navigate('login')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Demo Ko'rish
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:32px;">
          <div style="display:flex;">
            <div class="avatar avatar-sm" style="border:2px solid white;margin-right:-8px;background:#DBEAFE;color:#2563EB;font-size:0.65rem;">AT</div>
            <div class="avatar avatar-sm" style="border:2px solid white;margin-right:-8px;background:#D1FAE5;color:#059669;font-size:0.65rem;">SM</div>
            <div class="avatar avatar-sm" style="border:2px solid white;margin-right:-8px;background:#FEF3C7;color:#D97706;font-size:0.65rem;">NK</div>
            <div class="avatar avatar-sm" style="border:2px solid white;background:#E0E7FF;color:#4F46E5;font-size:0.65rem;">FR</div>
          </div>
          <div>
            <span style="font-size:0.8rem;color:var(--text-secondary);">
              <strong style="color:var(--text);">Bo'lajak shifokorlar</strong> uchun virtual-klinik ta'lim muhiti
            </span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-illustration">
          <div style="position:absolute;inset:0;overflow:hidden;border-radius:var(--radius-2xl);">
            <div style="position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(37,99,235,0.08);top:-60px;right:-60px;"></div>
            <div style="position:absolute;width:250px;height:250px;border-radius:50%;background:rgba(34,197,94,0.08);bottom:-40px;left:-40px;"></div>
            <div style="position:absolute;width:180px;height:180px;border-radius:50%;background:rgba(14,165,233,0.08);top:50%;left:50%;transform:translate(-50%,-50%);"></div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;z-index:1;">
            <div style="display:flex;gap:16px;align-items:flex-end;">
              <span style="font-size:4rem;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.06));">🩺</span>
              <span style="font-size:6rem;filter:drop-shadow(0 4px 20px rgba(0,0,0,0.08));">👨‍⚕️</span>
              <span style="font-size:4rem;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.06));">🏥</span>
            </div>
            <div style="margin-top:16px;background:white;border-radius:var(--radius-lg);padding:12px 20px;box-shadow:var(--shadow-md);display:flex;align-items:center;gap:10px;">
              <div style="width:10px;height:10px;border-radius:50%;background:var(--green);"></div>
              <span style="font-size:0.8rem;font-weight:600;color:var(--text);">AI Simulyatsiya aktiv</span>
              <span style="font-size:0.733rem;color:var(--text-muted);">•  Real-time</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <div style="background:white;border-radius:var(--radius-md);padding:8px 14px;box-shadow:var(--shadow-sm);font-size:0.733rem;color:var(--text-secondary);">❤️ Vital Signs</div>
              <div style="background:white;border-radius:var(--radius-md);padding:8px 14px;box-shadow:var(--shadow-sm);font-size:0.733rem;color:var(--text-secondary);">🧠 Diagnostika</div>
              <div style="background:white;border-radius:var(--radius-md);padding:8px 14px;box-shadow:var(--shadow-sm);font-size:0.733rem;color:var(--text-secondary);">💊 Davolash</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= STATISTICS BAR ======= -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">1,000+</div>
          <div class="stat-label">Klinik Keyslar</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">1,000+</div>
          <div class="stat-label">Etika Test Savollari</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">4</div>
          <div class="stat-label">Ta'lim Moduli</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Ochiq Platforma</div>
        </div>
      </div>
    </section>

    <!-- ======= FEATURES SECTION ======= -->
    <section class="section-gray" id="features">
      <div class="section" style="padding-top:80px;padding-bottom:80px;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:var(--primary-light);padding:5px 14px;border-radius:var(--radius-full);margin-bottom:16px;margin-left:auto;margin-right:auto;display:flex;width:fit-content;">
          <span style="font-size:0.75rem;font-weight:600;color:var(--primary);">✨ Xususiyatlar</span>
        </div>
        <h2 class="section-title">Nima Uchun EduMed?</h2>
        <p class="section-subtitle">Zamonaviy texnologiyalar va pedagogik yondashuvlar asosida yaratilgan platformada tibbiy ta'limning yangi darajasini kashf eting.</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🩺</div>
            <h3>Interaktiv Klinik Keyslar</h3>
            <p>Real klinik holatlarni simulyatsiya qiluvchi 1,000 dan ortiq interaktiv keyslar. Har bir keys tarmoqlangan (branching) ssenariy asosida qurilgan.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon secondary">🤖</div>
            <h3>AI Tahlil</h3>
            <p>Sun'iy intellekt yordamida qarorlaringizni real vaqtda tahlil qiling. Kuchli va zaif tomonlaringizni aniqlang.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon green">⚖️</div>
            <h3>Etika va Deontologiya</h3>
            <p>Tibbiy etika tamoyillarini amaliy keyslar orqali o'rganing. Bemorlar huquqi va shifokor burchini chuqur tushuning.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:var(--danger-light);">❤️</div>
            <h3>Real-time Vital Signs</h3>
            <p>Bemorning hayotiy ko'rsatkichlarini real vaqtda kuzating. Yurak urishi, bosim, harorat va boshqa parametrlarni nazorat qiling.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:var(--warning-light);">🔀</div>
            <h3>Tarmoqlangan Ssenariylar</h3>
            <p>Har bir qaroringiz boshqa natijaga olib boradi. Murakkab klinik vaziyatlarda turli yondashuvlarni sinab ko'ring.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon secondary">📊</div>
            <h3>Natijalar Tahlili</h3>
            <p>Batafsil tahlil hisobotlari orqali o'z rivojlanishingizni kuzating. Grafik va statistik ko'rsatkichlar bilan.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= HOW IT WORKS ======= -->
    <section class="section" id="cases">
      <div style="display:inline-flex;align-items:center;gap:8px;background:var(--green-light);padding:5px 14px;border-radius:var(--radius-full);margin-bottom:16px;display:flex;width:fit-content;margin-left:auto;margin-right:auto;">
        <span style="font-size:0.75rem;font-weight:600;color:var(--green-dark);">🚀 Qanday ishlaydi</span>
      </div>
      <h2 class="section-title">4 Oddiy Qadamda Boshlang</h2>
      <p class="section-subtitle">Platformani ishlatish juda oson. Bir necha daqiqada birinchi simulyatsiyangizni boshlang.</p>
      <div class="steps-grid" style="margin-top:48px;">
        <div class="step-item">
          <div class="step-number">1</div>
          <h4>Ro'yxatdan O'ting</h4>
          <p>Universitetingiz orqali yoki mustaqil ro'yxatdan o'ting va profilingizni to'ldiring.</p>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <h4>Keys Tanlang</h4>
          <p>Mavjud klinik keyslar kutubxonasidan sizga mos bo'lgan keysni tanlang.</p>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <h4>Simulyatsiyani O'ting</h4>
          <p>Virtual bemor bilan muloqot qiling, tashxis qo'ying va davolash rejasini tuzing.</p>
        </div>
        <div class="step-item">
          <div class="step-number">4</div>
          <h4>Natijalarni Ko'ring</h4>
          <p>AI tahlili asosida batafsil hisobotni oling va bilimlaringizni mustahkamlang.</p>
        </div>
      </div>
    </section>

    <!-- ======= TESTIMONIALS ======= -->
    <section class="section-gray">
      <div class="section" style="padding-top:80px;padding-bottom:80px;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:var(--primary-light);padding:5px 14px;border-radius:var(--radius-full);margin-bottom:16px;display:flex;width:fit-content;margin-left:auto;margin-right:auto;">
          <span style="font-size:0.75rem;font-weight:600;color:var(--primary);">💬 Fikrlar</span>
        </div>
        <h2 class="section-title">Talabalar Nima Deyishadi?</h2>
        <p class="section-subtitle">Minglab talabalar allaqachon platformadan foydalanmoqda va yuqori baho bermoqda.</p>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div style="display:flex;gap:4px;margin-bottom:16px;">
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
            </div>
            <p class="testimonial-text">"EduMed platformasi mening tibbiy etika bo'yicha bilimlarimni tubdan o'zgartirdi. Interaktiv keyslar orqali murakkab vaziyatlarni hal qilishni o'rgandim. Haqiqiy bemorlar bilan ishlashdan oldin ajoyib tayyorgarlik."</p>
            <div class="testimonial-author">
              <div class="avatar" style="background:#DBEAFE;color:#2563EB;">SM</div>
              <div>
                <div class="name">Sobirova Malika</div>
                <div class="role">4-kurs talabasi, TTA</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div style="display:flex;gap:4px;margin-bottom:16px;">
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
            </div>
            <p class="testimonial-text">"AI tahlil tizimi har bir qarorimning natijasini ko'rsatib, kuchli va zaif tomonlarimni aniqlashga yordam berdi. Tarmoqlangan ssenariylar orqali klinik fikrlashni rivojlantirdim."</p>
            <div class="testimonial-author">
              <div class="avatar" style="background:#D1FAE5;color:#059669;">KR</div>
              <div>
                <div class="name">Karimov Rustam</div>
                <div class="role">5-kurs talabasi, SamTU</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div style="display:flex;gap:4px;margin-bottom:16px;">
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
              <span style="color:#F59E0B;">★</span>
            </div>
            <p class="testimonial-text">"O'qituvchi sifatida aytishim mumkinki, bu platforma talabalarning amaliy ko'nikmalarini sezilarli darajada oshirdi. Ssenariy yaratish moduli juda qulay va moslashuvchan."</p>
            <div class="testimonial-author">
              <div class="avatar" style="background:#FEF3C7;color:#D97706;">NA</div>
              <div>
                <div class="name">Nazarova Aziza</div>
                <div class="role">Dotsent, BuxTU</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= PARTNERS ======= -->
    <section class="section">
      <h2 class="section-title" style="font-size:1.2rem;color:var(--text-muted);font-weight:500;margin-bottom:32px;">Ishonch bildirgan hamkorlar</h2>
      <div class="partners-section">
        <div class="partner-logo">🏛️ Toshkent Tibbiyot Akademiyasi</div>
        <div class="partner-logo">🏛️ Samarkand Tibbiyot Universiteti</div>
        <div class="partner-logo">🏛️ Buxoro Tibbiyot Universiteti</div>
        <div class="partner-logo">🏛️ Andijon Tibbiyot Instituti</div>
        <div class="partner-logo">🏛️ Farg'ona Tibbiyot Instituti</div>
      </div>
    </section>

    <!-- ======= CTA SECTION ======= -->
    <section style="background:var(--primary);padding:80px 48px;text-align:center;">
      <div style="max-width:680px;margin:0 auto;">
        <h2 style="color:white;font-size:2.2rem;font-weight:700;margin-bottom:16px;letter-spacing:-0.02em;">Kelajak shifokorlari bilan birga o'sib boring</h2>
        <p style="color:rgba(255,255,255,0.8);font-size:1.05rem;line-height:1.7;margin-bottom:36px;">
          Hoziroq platformaga qo'shiling va tibbiy ta'limning yangi darajasini kashf eting. 
          Bepul demo versiyadan boshlang.
        </p>
        <div style="display:flex;gap:16px;justify-content:center;">
          <button class="btn btn-lg" style="background:white;color:var(--primary);font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.15);" onclick="window.navigate('register')">
            Bepul Boshlash
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:white;border:1.5px solid rgba(255,255,255,0.3);" onclick="window.navigate('login')">
            Kirish
          </button>
        </div>
      </div>
    </section>

    <!-- ======= FOOTER ======= -->
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="width:36px;height:36px;background:var(--primary);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1rem;">🏥</div>
            <span style="font-size:1.2rem;font-weight:700;color:white;">EduMed Deontolog</span>
          </div>
          <p style="max-width:280px;line-height:1.8;">
            AI-asosidagi virtual klinik simulyatsiya platformasi. Tibbiy etika va deontologiyani interaktiv tarzda o'rganing.
          </p>
          <div style="display:flex;gap:12px;margin-top:20px;">
            <div style="width:36px;height:36px;border-radius:var(--radius-md);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;">📘</div>
            <div style="width:36px;height:36px;border-radius:var(--radius-md);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;">📸</div>
            <div style="width:36px;height:36px;border-radius:var(--radius-md);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;">💬</div>
            <div style="width:36px;height:36px;border-radius:var(--radius-md);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;">📺</div>
          </div>
        </div>
        <div>
          <h4>Platforma</h4>
          <a href="#" onclick="event.preventDefault();window.navigate('login')">Simulyatsiya</a><br/>
          <a href="#" onclick="event.preventDefault()">Klinik Keyslar</a><br/>
          <a href="#" onclick="event.preventDefault()">Laboratoriya</a><br/>
          <a href="#" onclick="event.preventDefault()">Etika Testlari</a><br/>
          <a href="#" onclick="event.preventDefault()">AI Tahlil</a>
        </div>
        <div>
          <h4>Kompaniya</h4>
          <a href="#" onclick="event.preventDefault()">Biz Haqimizda</a><br/>
          <a href="#" onclick="event.preventDefault()">Hamkorlik</a><br/>
          <a href="#" onclick="event.preventDefault()">Yangiliklar</a><br/>
          <a href="#" onclick="event.preventDefault()">Bog'lanish</a><br/>
          <a href="#" onclick="event.preventDefault()">Karyera</a>
        </div>
        <div>
          <h4>Yordam</h4>
          <a href="#" onclick="event.preventDefault()">Qo'llanma</a><br/>
          <a href="#" onclick="event.preventDefault()">Ko'p So'raladigan Savollar</a><br/>
          <a href="#" onclick="event.preventDefault()">Texnik Yordam</a><br/>
          <a href="#" onclick="event.preventDefault()">Maxfiylik Siyosati</a><br/>
          <a href="#" onclick="event.preventDefault()">Foydalanish Shartlari</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 EduMed Deontolog. Barcha huquqlar himoyalangan.</span>
        <span>O'zbekiston 🇺🇿</span>
      </div>
    </footer>
  `;
}
