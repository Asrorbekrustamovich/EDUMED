// Sozlamalar — real saqlash (profil API, parol API, lokal sozlamalar)
export function renderSettings(state, icons) {
  const prefs = JSON.parse(localStorage.getItem('edumed_prefs') || '{"email":true,"push":true,"sms":false}');

  const passwordModal = state.showPasswordModal ? `
    <div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(4px);">
      <div class="card animate-in" style="width:420px; max-width:90%; padding:24px;">
        <div class="flex-between mb-4">
          <h3 class="card-title">Parolni O'zgartirish</h3>
          <button class="btn-icon" onclick="window.togglePasswordModal(false)">❌</button>
        </div>
        <form onsubmit="window.submitPasswordChange(event)">
          <div class="input-group mb-3">
            <label>Joriy parol</label>
            <input type="password" id="pw-old" class="input w-full" required autocomplete="current-password">
          </div>
          <div class="input-group mb-3">
            <label>Yangi parol (kamida 6 belgi)</label>
            <input type="password" id="pw-new" class="input w-full" required minlength="6" autocomplete="new-password">
          </div>
          <div class="input-group mb-4">
            <label>Yangi parolni takrorlang</label>
            <input type="password" id="pw-new2" class="input w-full" required minlength="6" autocomplete="new-password">
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="btn btn-outline" onclick="window.togglePasswordModal(false)">Bekor qilish</button>
            <button type="submit" class="btn btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>` : '';

  return `
    <div class="page-header animate-in">
      <h1 style="font-size:1.4rem">Sozlamalar</h1>
    </div>

    <div class="page-body grid-32 gap-6" style="max-width: 1000px; margin: 0 auto;">

      <div class="flex-col gap-6 animate-in animate-delay-1">
        <!-- Profil Ma'lumotlari -->
        <div class="card">
          <h3 class="card-title border-b border-border pb-3 mb-4">Profil Ma'lumotlari</h3>
          <div class="flex items-center gap-4 mb-6">
            <div class="avatar avatar-xl bg-primary text-white text-3xl">${state.user.initials}</div>
            <div class="text-sm text-secondary">Avatar ism-familiya bosh harflaridan avtomatik yaratiladi</div>
          </div>
          <div class="grid-2 gap-4 mb-4">
            <div class="input-group mb-0">
              <label>Ism Familiya</label>
              <input type="text" id="setting-name" class="input w-full" value="${state.user.name}">
            </div>
            <div class="input-group mb-0">
              <label>Elektron pochta</label>
              <input type="email" id="setting-email" class="input w-full" value="${state.user.email}">
            </div>
          </div>
          <div class="input-group mb-0">
            <label>Universitet</label>
            <input type="text" id="setting-university" class="input w-full" value="${state.user.university || ''}">
          </div>
        </div>

        <!-- Xavfsizlik -->
        <div class="card">
          <h3 class="card-title border-b border-border pb-3 mb-4">Xavfsizlik</h3>

          <div class="flex-between items-center">
            <div>
              <div class="font-semibold text-sm">Parolni O'zgartirish</div>
              <div class="text-xs text-secondary mt-1">Joriy parolni tasdiqlab, yangisini o'rnating</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.togglePasswordModal(true)">O'zgartirish</button>
          </div>
        </div>
      </div>

      <div class="flex-col gap-6 animate-in animate-delay-2">
        <!-- Xabarnomalar -->
        <div class="card">
          <h3 class="card-title border-b border-border pb-3 mb-4">Xabarnomalar</h3>

          <div class="flex-col gap-4">
            <div class="flex-between items-center">
              <div class="text-sm font-semibold">Email xabarnomalar</div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-email" ${prefs.email ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex-between items-center">
              <div class="text-sm font-semibold">Push xabarnomalar (Brauzer)</div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-push" ${prefs.push ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex-between items-center">
              <div class="text-sm font-semibold">SMS xabarnomalar</div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-sms" ${prefs.sms ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Til va Mavzu -->
        <div class="card">
          <h3 class="card-title border-b border-border pb-3 mb-4">Ilova Sozlamalari</h3>

          <div class="mb-5">
            <label class="text-sm font-semibold mb-2 block">Tizim tili</label>
            <select class="input select w-full" disabled title="Hozircha faqat o'zbek tili qo'llab-quvvatlanadi">
              <option selected>O'zbek (Lotin)</option>
            </select>
            <div class="text-xs text-muted mt-1">Hozircha faqat o'zbek (lotin) tili mavjud</div>
          </div>

          <div>
            <label class="text-sm font-semibold mb-2 block">Mavzu</label>
            <div class="flex gap-3">
              <div class="card card-flat p-3 text-center border-primary bg-primary-light flex-1">
                <div class="text-2xl mb-1">☀️</div>
                <div class="text-xs font-semibold text-primary">Yorug' (joriy)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-full flex justify-end gap-3 mt-2 animate-in animate-delay-3">
        <button class="btn btn-outline" onclick="window.navigate('dashboard')">Bekor Qilish</button>
        <button class="btn btn-primary" onclick="window.savePrefs(); window.saveSettings();">O'zgarishlarni Saqlash</button>
      </div>

    </div>

    ${passwordModal}
  `;
}
