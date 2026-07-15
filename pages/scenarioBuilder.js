// Ssenariy Yaratish — real ishlaydigan konstruktor (bazaga saqlanadi)
export function renderScenarioBuilder(state, icons) {
  // Har safar ochilganda variantlar soni 3 ga qaytadi
  if (window.sbOptionCount === undefined) window.sbOptionCount = 3;

  return `
    <div class="page-header animate-in">
      <div class="flex items-center gap-3">
        <button class="btn-icon" onclick="window.navigate('${state.currentRole === 'admin' ? 'content-management' : 'teacher-dashboard'}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 style="font-size:1.4rem">Yangi Keys Yaratish</h1>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-outline" onclick="window.previewScenario()">👁 Oldindan ko'rish</button>
        <button class="btn btn-outline text-primary border-primary" onclick="window.saveScenario(false)">Qoralama Saqlash</button>
        <button class="btn btn-primary" onclick="window.saveScenario(true)">🚀 Nashr Qilish</button>
      </div>
    </div>

    <div class="page-body">
      <div class="grid-2 gap-6" style="align-items:start;">

        <!-- Keys pasporti -->
        <div class="card animate-in">
          <h3 class="card-title border-b border-border pb-3 mb-4">1. Keys Pasporti</h3>

          <div class="input-group mb-4">
            <label>Keys nomi *</label>
            <input type="text" id="sb-title" class="input w-full" placeholder="Masalan: O'tkir appenditsit shubhasi bo'lgan homilador bemor">
          </div>

          <div class="grid-2 gap-4 mb-4">
            <div class="input-group mb-0">
              <label>Kategoriya</label>
              <select id="sb-category" class="input select w-full">
                <option>Xirurgiya</option>
                <option>Terapiya</option>
                <option>Kardiologiya</option>
                <option>Ginekologiya</option>
                <option>Pediatriya</option>
                <option>Nevrologiya</option>
                <option>Onkologiya</option>
                <option>Umumiy</option>
              </select>
            </div>
            <div class="input-group mb-0">
              <label>Murakkablik</label>
              <select id="sb-difficulty" class="input select w-full">
                <option>Oson</option>
                <option selected>O'rta</option>
                <option>Qiyin</option>
              </select>
            </div>
          </div>

          <div class="input-group mb-4">
            <label>Qisqacha tavsif</label>
            <textarea id="sb-desc" class="input w-full" rows="3" placeholder="Bemorning dastlabki shikoyati va klinik vaziyat tavsifi..."></textarea>
          </div>

          <div class="input-group mb-0">
            <label>Boshlang'ich vaziyat matni (bemorning birinchi holati) *</label>
            <textarea id="sb-step-msg" class="input w-full" rows="4" placeholder="Keys boshlandi. Bemor ... shikoyat bilan qabulga keldi."></textarea>
          </div>

          <div class="card card-flat p-3 mt-4 bg-surface text-xs text-secondary" style="line-height:1.6;">
            💡 <strong>Eslatma:</strong> Keys 2 bosqichli qilib saqlanadi: siz kiritgan muloqot bosqichi + avtomatik qo'shiladigan deontologik-huquqiy qaror bosqichi. Har bir variantga ijobiy (+) yoki salbiy (−) ball bering.
          </div>
        </div>

        <!-- Variantlar -->
        <div class="card animate-in animate-delay-1">
          <h3 class="card-title border-b border-border pb-3 mb-4">2. Muloqot Variantlari (talabaga ko'rinadi)</h3>

          <div id="sb-options-wrap">
            <div class="card card-flat p-3 mb-2 bg-surface">
              <div class="text-xs font-semibold mb-1">A Variant (masalan: avtoritar — salbiy ball)</div>
              <input type="text" class="input w-full text-sm mb-2 sb-opt-text" placeholder="Shifokor javobi matni...">
              <input type="text" class="input w-full text-sm mb-2 sb-opt-resp" placeholder="Bemorning reaksiyasi...">
              <div class="flex gap-2 items-center">
                <label class="text-xs text-secondary" style="white-space:nowrap;">Ball:</label>
                <input type="number" class="input w-full text-sm sb-opt-score" value="-5">
              </div>
            </div>

            <div class="card card-flat p-3 mb-2 bg-surface">
              <div class="text-xs font-semibold mb-1">B Variant (masalan: neytral)</div>
              <input type="text" class="input w-full text-sm mb-2 sb-opt-text" placeholder="Shifokor javobi matni...">
              <input type="text" class="input w-full text-sm mb-2 sb-opt-resp" placeholder="Bemorning reaksiyasi...">
              <div class="flex gap-2 items-center">
                <label class="text-xs text-secondary" style="white-space:nowrap;">Ball:</label>
                <input type="number" class="input w-full text-sm sb-opt-score" value="3">
              </div>
            </div>

            <div class="card card-flat p-3 mb-2 bg-surface">
              <div class="text-xs font-semibold mb-1">C Variant (masalan: empatik — ijobiy ball)</div>
              <input type="text" class="input w-full text-sm mb-2 sb-opt-text" placeholder="Shifokor javobi matni...">
              <input type="text" class="input w-full text-sm mb-2 sb-opt-resp" placeholder="Bemorning reaksiyasi...">
              <div class="flex gap-2 items-center">
                <label class="text-xs text-secondary" style="white-space:nowrap;">Ball:</label>
                <input type="number" class="input w-full text-sm sb-opt-score" value="10">
              </div>
            </div>
          </div>

          <button class="btn btn-outline btn-sm w-full mt-2" onclick="window.addScenarioOption()">${icons.plus} Variant qo'shish</button>
        </div>
      </div>
    </div>
  `;
}
