export function renderLogin(state, icons) {
  return `
    <div class="auth-layout">
      <div class="auth-visual">
        <div class="logo">
          <div class="logo-icon">🏥</div>
          EduMed Deontolog
        </div>
        <p class="tagline">Kelajak shifokorlari uchun mo'ljallangan birinchi raqamli AI-simulyatsiya platformasiga xush kelibsiz.</p>
        <div class="illustration">🩺👩‍⚕️🏥</div>
      </div>
      <div class="auth-form-container">
        <div class="auth-form animate-in">
          <h2>Xush Kelibsiz! 👋</h2>
          <p class="subtitle">Profilingizga kirish uchun ma'lumotlarni kiriting.</p>
          
          <div id="login-error" class="text-danger text-sm mb-3 font-semibold" style="display:none"></div>
          
          <div class="input-group">
            <label>Foydalanuvchi ismi</label>
            <input type="text" id="login-username" class="input" autocomplete="off">
          </div>
          <div class="input-group">
            <label>Parol</label>
            <div style="position:relative;">
              <input type="password" id="login-password" class="input" placeholder="••••••••" style="padding-right:44px;">
              <button type="button" onclick="window.togglePassword('login-password', 'login-eye')" tabindex="-1"
                style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;display:flex;align-items:center;">
                <svg id="login-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="auth-row">
            <label class="checkbox-group">
              <input type="checkbox">
              <span class="text-sm">Eslab qolish</span>
            </label>
            <a href="#" class="text-sm" onclick="window.navigate('forgot-password')">Parolni unutdingizmi?</a>
          </div>
          
          <button class="btn btn-primary" onclick="window.handleLogin()" id="login-btn">Tizimga Kirish</button>
          
          <div class="auth-divider">yoki</div>
          
          <div class="social-btns">
            <button class="btn" onclick="window.showToast('Google orqali kirish hozircha mavjud emas — email va parol bilan kiring', 'warning')"><img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google"> Google</button>
            <button class="btn" onclick="window.showToast('Apple orqali kirish hozircha mavjud emas — email va parol bilan kiring', 'warning')"><img src="https://www.svgrepo.com/show/511330/apple-173.svg" width="18" height="18" alt="Apple"> Apple</button>
          </div>
          
          <p class="text-center mt-6 text-sm">
            Akkauntingiz yo'qmi? <a href="#" class="font-semibold" onclick="window.navigate('register')">Ro'yxatdan o'tish</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderRegister(state, icons) {
  return `
    <div class="auth-layout">
      <div class="auth-visual">
        <div class="logo">
          <div class="logo-icon">🏥</div>
          EduMed Deontolog
        </div>
        <p class="tagline">Tibbiyot ta'limida yangi tajriba - amaliy va nazariy bilimlarni birga oshiring.</p>
        <div class="illustration">📚🔬✨</div>
      </div>
      <div class="auth-form-container">
        <div class="auth-form animate-in">
          <h2>Ro'yxatdan O'tish</h2>
          <p class="subtitle">Platformadan foydalanish uchun hisob yarating.</p>
          
          <div id="register-error" class="text-danger text-sm mb-3 font-semibold" style="display:none"></div>
          
          <div class="mb-4">
            <label class="text-sm font-semibold mb-2" style="display:block">Rolingizni tanlang</label>
            <div class="grid-2 gap-2">
              <div id="role-student" class="choice-card text-center active" onclick="window.selectRegRole('student')" style="padding:10px; cursor:pointer;">👨‍🎓<br>Talaba</div>
              <div id="role-teacher" class="choice-card text-center" onclick="window.selectRegRole('teacher')" style="padding:10px; cursor:pointer;">👨‍🏫<br>O'qituvchi</div>
            </div>
          </div>
          
          <div class="input-group">
            <label>Foydalanuvchi ismi</label>
            <input type="text" id="reg-name" class="input" autocomplete="off">
          </div>
          <div class="input-group" style="display:none;">
            <input type="text" id="reg-username" autocomplete="off">
          </div>
          <div class="input-group">
            <label>Parol</label>
            <div style="position:relative;">
              <input type="password" id="reg-password" class="input" placeholder="Kamida 8 belgi" style="padding-right:44px;">
              <button type="button" onclick="window.togglePassword('reg-password', 'reg-eye')" tabindex="-1"
                style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;display:flex;align-items:center;">
                <svg id="reg-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          
          <label class="checkbox-group mt-4 mb-4">
            <input type="checkbox" id="reg-terms">
            <span class="text-sm">Foydalanish shartlari va maxfiylik siyosatiga roziman</span>
          </label>
          
          <button class="btn btn-primary" onclick="window.handleRegister()" id="reg-btn">Hisob Yaratish</button>
          
          <p class="text-center mt-6 text-sm">
            Allaqachon hisobingiz bormi? <a href="#" class="font-semibold" onclick="window.navigate('login')">Kirish</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderForgotPassword(state, icons) {
  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--surface);padding:24px;">
      <div class="card auth-form animate-in" style="width:100%;max-width:400px;box-shadow:var(--shadow-lg);">
        <div class="text-center mb-6">
          <div class="logo-icon mx-auto mb-4" style="width:48px;height:48px;background:var(--primary-light);color:var(--primary);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 16px;">🔒</div>
          <h2>Parolni Tiklash</h2>
          <p class="subtitle mt-2">Elektron pochtangizni kiriting va biz parolni tiklash havolasini yuboramiz.</p>
        </div>
        <div class="input-group mb-5">
          <label>Elektron pochta</label>
          <input type="email" class="input" placeholder="ism@universitet.edu">
        </div>
        <button class="btn btn-primary w-full" onclick="window.navigate('login')">Havolani Yuborish</button>
        <div class="text-center mt-5">
          <a href="#" class="text-sm text-secondary" onclick="window.navigate('login')">← Orqaga qaytish</a>
        </div>
      </div>
    </div>
  `;
}

export function renderOTP(state, icons) {
  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--surface);padding:24px;">
      <div class="card auth-form animate-in" style="width:100%;max-width:400px;box-shadow:var(--shadow-lg);">
        <div class="text-center mb-6">
          <div class="logo-icon mx-auto mb-4" style="width:48px;height:48px;background:var(--green-light);color:var(--green);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 16px;">✉️</div>
          <h2>Pochtani Tasdiqlash</h2>
          <p class="subtitle mt-2">ism@universitet.edu manziliga yuborilgan 6 xonali kodni kiriting.</p>
        </div>
        
        <div class="otp-inputs">
          <input type="text" class="otp-input" maxlength="1" value="4">
          <input type="text" class="otp-input" maxlength="1" value="8">
          <input type="text" class="otp-input" maxlength="1" value="1">
          <input type="text" class="otp-input" maxlength="1">
          <input type="text" class="otp-input" maxlength="1">
          <input type="text" class="otp-input" maxlength="1">
        </div>
        
        <button class="btn btn-primary w-full" onclick="window.navigate('dashboard')">Tasdiqlash</button>
      </div>
    </div>
  `;
}
