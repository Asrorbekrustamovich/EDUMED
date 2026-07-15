const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const subjects = [
  "16-yoshli o'smir bemor",
  "80-yoshli qariya",
  "Og'ir ahvoldagi bemor",
  "Homilador ayol",
  "Psixiatrik ro'yxatda turuvchi bemor",
  "Xorijlik fuqaro",
  "Mahbus bemor",
  "OITSga chalingan bemor",
  "Koma holatidagi bemorning qarindoshi",
  "Harbiy xizmatchi"
];

const situations = [
  {
    desc: "shoshilinch operatsiyadan bosh tortmoqda",
    law: "26-modda",
    correct: "Bemorga yoki uning qonuniy vakiliga aralashuvning maqsadi va rad etishning oqibatlarini tushuntirib, yozma ravishda rad javobini olish.",
    wrong1: "Bemorning qarshiligiga qaramay majburiy operatsiya qilish.",
    wrong2: "Bemorning qarindoshlarini chaqirib, ulardan ruxsat talab qilish.",
    wrong3: "Hech qanday hujjatlashtirmasdan bemorni kasalxonadan chiqarib yuborish."
  },
  {
    desc: "o'z tashxisi haqidagi ma'lumotlarni qarindoshlaridan sir saqlashni qat'iy talab qilmoqda",
    law: "45-modda (Shifokor siri)",
    correct: "Bemorning huquqini hurmat qilib, ma'lumotlarni sir saqlash va faqat bemorning o'ziga taqdim etish.",
    wrong1: "Qarindoshlari bilishga haqli deb hisoblab, ularga aytib qo'yish.",
    wrong2: "Faqat bo'lim mudiri ruxsati bilan qarindoshlarga ma'lumot berish.",
    wrong3: "Bemorni psixiatrik ekspertizaga yuborish."
  },
  {
    desc: "shifokorni o'zgartirishni va boshqa mutaxassisga o'tishni so'ramoqda",
    law: "24-modda (Bemorning huquqlari)",
    correct: "Bemorning shifokor tanlash huquqini ta'minlash va boshqa shifokorga yo'naltirishga yordam berish.",
    wrong1: "Bemorga qo'pollik qilib, faqat o'zi davolashini aytish.",
    wrong2: "Boshqa shifokorlar bandligini ro'kach qilib, arizani rad etish.",
    wrong3: "Bemorni shifoxonadan chiqarib yuborish."
  },
  {
    desc: "og'riqni qoldirish uchun evtanaziya (o'limni tezlashtirish) qo'llashni yalinib so'ramoqda",
    law: "31-modda (Evtanaziyani taqiqlash)",
    correct: "O'zbekiston qonunchiligida evtanaziya taqiqlanganligini tushuntirib, palliativ yordam (og'riq qoldiruvchi terapiya) kuchaytirish.",
    wrong1: "Bemorning azoblarini yengillashtirish uchun uning iltimosini bajarish.",
    wrong2: "Bemorning qarindoshlaridan evtanaziyaga yozma ruxsat olish.",
    wrong3: "Bemor bilan muloqotni to'xtatib, e'tiborsiz qoldirish."
  },
  {
    desc: "diniy e'tiqodi sababli hayotiy zarur bo'lgan qon quyish amaliyotini qat'iyan rad etmoqda",
    law: "26-modda",
    correct: "Rad etishning o'limga olib kelishi mumkin bo'lgan barcha oqibatlarini tushuntirish va rad etish haqida yozma hujjat rasmiylashtirish.",
    wrong1: "Bemor hushini yo'qotishini kutib, so'ngra qon quyish.",
    wrong2: "Diniy qarashlarini kamsitib, majburlash.",
    wrong3: "Zudlik bilan qon quyish, chunki shifokor burchi hayotni saqlab qolish."
  },
  {
    desc: "bepul tibbiy xizmatlar doirasida o'ziga qimmat dori vositalarini yozib berishni talab qilmoqda",
    law: "Davlat kafolatlangan tibbiy yordam",
    correct: "Davlat tomonidan kafolatlangan bepul xizmatlar va dorilar ro'yxati haqida xolis ma'lumot berish va muqobil variantlarni tushuntirish.",
    wrong1: "Bemor bilan tortishib, uni palatadan haydab chiqarish.",
    wrong2: "O'z hisobidan dorilarni olib kelib berish.",
    wrong3: "Yolg'on va'dalar berib, vaqtni cho'zish."
  },
  {
    desc: "o'zining tibbiy kartasidan ko'chirma va tahlil natijalari nushalarini berishni talab qilmoqda",
    law: "25-modda",
    correct: "Bemorga o'z sog'lig'i holati haqidagi ma'lumotlarni qulay shaklda va to'liq taqdim etish.",
    wrong1: "Tibbiy karta kasalxona mulki ekanligini aytib, rad etish.",
    wrong2: "Faqat sud yoki prokuratura so'rovi bilangina ma'lumot berishini aytish.",
    wrong3: "Nushalarni pul evaziga sotish."
  },
  {
    desc: "tibbiyot muassasasida uning ruxsatisiz tibbiyot talabalari amaliyot o'tayotganiga norozilik bildirmoqda",
    law: "Bemor daxlsizligi va roziligi",
    correct: "Bemorning noroziligini hurmat qilib, talabalarni ko'rikdan chetlashtirish.",
    wrong1: "Bu o'quv bazasi ekanligini aytib, bemorni ko'rikka majburlash.",
    wrong2: "Talabalarga bildirmasdan ko'rishni davom ettirish.",
    wrong3: "Bemorni shifoxonadan javob qilib yuborish."
  },
  {
    desc: "konsilium (shifokorlar yig'ilishi) o'tkazilishini va murakkab tashxisni qayta ko'rib chiqishni talab qilmoqda",
    law: "24-modda",
    correct: "Bemorning huquqini ta'minlab, bo'lim mudiriga konsilium chaqirish haqida xabar berish.",
    wrong1: "O'zining yuqori malakali shifokor ekanligini aytib, konsiliumni rad etish.",
    wrong2: "Konsilium pullik xizmat ekanligini aytish.",
    wrong3: "Bemorni ko'rikdan o'tkazishni umuman to'xtatish."
  },
  {
    desc: "davolanish natija bermayotganidan asabiylashib, shifokorni haqorat qilmoqda",
    law: "Deontologiya qoidalari",
    correct: "O'zini vazmin tutib, provokatsiyaga berilmasdan, davolash rejasini xotirjam tushuntirish va kerak bo'lsa psixolog jalb qilish.",
    wrong1: "Bemorga javoban haqorat bilan javob qaytarish.",
    wrong2: "Bemorni davolashdan darhol voz kechib, tashlab ketish.",
    wrong3: "Kuch ishlatib bemorni tinchlantirishga harakat qilish."
  }
];

const locations = [
  "shoshilinch qabul bo'limida",
  "jonlantirish bo'limida",
  "kardiologiya palatasida",
  "poliklinika ko'rigida",
  "operatsiya xonasi oldida",
  "reabilitatsiya markazida",
  "yuqumli kasalliklar bo'limida",
  "oilaviy poliklinikada",
  "tug'ruqxona bo'limida",
  "xususiy tibbiyot markazida"
];

async function seedEthics1000() {
  console.log('Seeding approximately 1000 ethics questions...');
  
  // Clear existing to avoid duplicates if run multiple times
  await prisma.ethicsQuestion.deleteMany({});
  
  const generatedQuestions = [];
  
  // 10 subjects * 10 situations * 10 locations = 1000 variations
  for (let subj of subjects) {
    for (let sit of situations) {
      for (let loc of locations) {
        
        // Randomize the order of options (A, B, C, D)
        const allOptions = [
          { text: sit.correct, isCorrect: true },
          { text: sit.wrong1, isCorrect: false },
          { text: sit.wrong2, isCorrect: false },
          { text: sit.wrong3, isCorrect: false }
        ];
        
        // Shuffle options
        const shuffled = allOptions.sort(() => 0.5 - Math.random());
        const correctIndex = shuffled.findIndex(opt => opt.isCorrect);
        
        const questionText = `Sizning oldingizga ${loc} ${subj} keldi va ${sit.desc}. O'zbekiston Respublikasining qonunchiligi va deontologiya qoidalariga muvofiq qanday yo'l tutasiz?`;
        
        generatedQuestions.push({
          question: questionText,
          lawText: sit.law,
          options: JSON.stringify(shuffled.map(o => o.text)),
          correctAnswer: correctIndex,
          explanations: JSON.stringify(shuffled.map(o => 
            o.isCorrect ? "To'g'ri qaror: Bemor huquqlari va qonunchilikka to'la mos keladi." : "Noto'g'ri: Bu harakat qonun buzilishi yoki qo'pol deontologik xato hisoblanadi."
          )),
          explanationCorrect: sit.correct
        });
      }
    }
  }
  
  // Insert in chunks to avoid SQLite limits
  const chunkSize = 100;
  for (let i = 0; i < generatedQuestions.length; i += chunkSize) {
    const chunk = generatedQuestions.slice(i, i + chunkSize);
    await prisma.ethicsQuestion.createMany({
      data: chunk
    });
    console.log(`Inserted chunk ${i / chunkSize + 1}/${Math.ceil(generatedQuestions.length / chunkSize)}`);
  }
  
  console.log(`Successfully inserted ${generatedQuestions.length} unique ethics questions!`);
}

seedEthics1000().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
