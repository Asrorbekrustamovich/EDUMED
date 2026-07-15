const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log("Ma'lumotlar bazasi initsializatsiya qilinmoqda...");

  // 1. Tozalash (Clear DB)
  await prisma.simulationOption.deleteMany();
  await prisma.simulationStep.deleteMany();
  await prisma.simulationResult.deleteMany();
  await prisma.case.deleteMany();
  await prisma.ethicsQuestion.deleteMany();
  await prisma.user.deleteMany();

  // 2. Foydalanuvchilar (Users)
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: { name: 'Super Admin', email: 'admin@edumed.uz', password: hashedAdmin, role: 'admin' }
  });

  const hashedStudent = await bcrypt.hash('student123', 10);
  await prisma.user.create({
    data: { name: 'Asadov Temur', email: 'student@edumed.uz', password: hashedStudent, role: 'student', university: 'Toshkent Tibbiyot Akademiyasi', year: '3-kurs' }
  });

  // 3. Etika Savollari (Ethics Questions)
  const ethicsQuestions = [
    {
      question: "Fuqarolar sog'lig'ini saqlash to'g'risidagi Qonunga muvofiq, tibbiy aralashuvga rozilik berish yoki uni rad etish huquqi birinchi navbatda kimga tegishli?",
      lawText: "26-modda",
      options: JSON.stringify([
        "Bemorning turmush o'rtog'i yoki ota-onasiga",
        "Davolovchi shifokor va bo'lim mudiri konsiliumiga",
        "Voyaga yetgan va muomalaga layoqatli bemorning o'ziga",
        "Tibbiy muassasa ma'muriyati va huquqshunosiga"
      ]),
      correctAnswer: 2,
      explanations: JSON.stringify([
        "Turmush o'rtog'i yoki ota-onaning roziligi faqat bemor muomalaga layoqatsiz bo'lgan yoki voyaga yetmagan hollarda talab etiladi.",
        "Konsilium tibbiy qaror qabul qiladi, lekin rozilik berish huquqi bemorning o'ziga tegishli.",
        "",
        "Tibbiy muassasa ma'muriyati bemorning shaxsiy tibbiy qarorlarida ishtirok etish huquqiga ega emas."
      ]),
      explanationCorrect: "26-moddaga muvofiq, voyaga yetgan va muomalaga layoqatli fuqaro tibbiy aralashuvga rozilik berish yoki uni rad etish huquqiga ega."
    },
    {
      question: "Tibbiyot xodimining sir saqlash majburiyati (Shifokor siri) qaysi holatda bemorning roziligisiz oshkor qilinishi mumkin?",
      lawText: "45-modda",
      options: JSON.stringify([
        "Bemorning ish beruvchisi so'rov xati yuborganda",
        "O'tkir yuqumli kasalliklar tarqalish xavfi tug'ilganda",
        "Bemorning qarindoshlari qiziqib so'raganda",
        "OAV (jurnalistlar) tomonidan ma'lumot so'ralganda"
      ]),
      correctAnswer: 1,
      explanations: JSON.stringify([
        "Ish beruvchiga ma'lumot faqat bemorning yozma roziligi bilan berilishi mumkin.",
        "",
        "Voyaga yetgan bemorning qarindoshlariga ma'lumot faqat bemorning roziligi bilan beriladi.",
        "OAVga bemor haqida ma'lumot berish shifokor sirini buzish hisoblanadi."
      ]),
      explanationCorrect: "Shifokor siri quyidagi holatlarda bemor roziligisiz oshkor etilishi mumkin: yuqumli kasallik tarqalish xavfi bo'lganda, tergov organlari talab qilganda va bemor o'z holatini tushuntirib bera olmaydigan darajada og'ir ahvolda bo'lganda."
    },
    {
      question: "Etanaziya (bemorning hayotini uning iltimosiga ko'ra sun'iy ravishda to'xtatish) O'zbekiston Respublikasi qonunchiligiga ko'ra qanday baholanadi?",
      lawText: "Tibbiy huquq",
      options: JSON.stringify([
        "Faqat og'ir onkologik kasalliklarda ruxsat etiladi",
        "Bemor va uning qarindoshlari yozma roziligi bilan ruxsat etiladi",
        "Qat'iyan man etiladi va jinoiy javobgarlikka sabab bo'ladi",
        "Maxsus tibbiy komissiya xulosasi asosida qo'llanilishi mumkin"
      ]),
      correctAnswer: 2,
      explanations: JSON.stringify([
        "Hech qanday kasallik holatida ruxsat etilmaydi.",
        "Qarindoshlar roziligi qonunni chetlab o'tishga asos bo'la olmaydi.",
        "",
        "Tibbiy komissiya bunday qaror qabul qilish vakolatiga ega emas."
      ]),
      explanationCorrect: "O'zbekiston Respublikasi qonunchiligiga ko'ra evtanaziya qat'iyan man etiladi. Tibbiyot xodimi bemorning hayotini qasddan to'xtatishda ishtirok etsa, qonunga muvofiq jinoiy javobgarlikka tortiladi."
    }
  ];

  for (const q of ethicsQuestions) {
    await prisma.ethicsQuestion.create({ data: q });
  }

  // 4. Dinamik Simulyator Keyslari (Branching Scenarios)
  const step1Id = crypto.randomUUID();
  const step2Id = crypto.randomUUID();

  const demoCase = await prisma.case.create({
    data: {
      title: "Keys №12: Homilador Bemorda O'tkir Appenditsit",
      description: "Bemorda qorin bo'shlig'ida og'riq kuzatilmoqda. Zudlik bilan tekshiruv zarur.",
      difficulty: "O'rta",
      category: "Xirurgiya",
      steps: {
        create: [
          {
            id: step1Id,
            stepOrder: 0,
            systemMessage: "Keys boshlandi. 22 haftalik homilador bemor qabul bo'limiga qorindagi kuchli og'riq bilan keldi.",
            options: {
              create: [
                {
                  text: "Vahima qilmang! Hozir zudlik bilan operatsiya qilishimiz kerak, rozilik xatiga qo'l qo'ying!",
                  patientResponse: "Yo'q, men tushunmayapman... Qanday operatsiya?! Iltimos, boshqa shifokor chaqiring!",
                  emotionClass: "distressed",
                  emotionText: "😫 Vahimada",
                  vitalsHr: 115,
                  scoreDelta: -3,
                  nextStepId: null // Tugaydi
                },
                {
                  text: "Qo'rquvingiz o'rinli. Keling, avval ultratovush tekshiruvini qilib holatni aniq bilaylik.",
                  patientResponse: "Xo'p doktor. Lekin UZI bolamga zarar qilmaydimi?",
                  emotionClass: "anxious",
                  emotionText: "😰 Tashvishlangan",
                  vitalsHr: 95,
                  scoreDelta: 2,
                  nextStepId: step2Id // Keyingi bosqichga
                },
                {
                  text: "Sizni va xavotirlaringizni juda yaxshi tushunaman. Xavotirlanmang, eng xavfsiz tekshiruvlardan boshlaymiz.",
                  patientResponse: "Katta rahmat doktor. Sizga ishonaman, tayyorman.",
                  emotionClass: "calm",
                  emotionText: "😌 Tinchlangan",
                  vitalsHr: 88,
                  scoreDelta: 5,
                  nextStepId: step2Id // Keyingi bosqichga
                }
              ]
            }
          },
          {
            id: step2Id,
            stepOrder: 1,
            systemMessage: "Bemor tinchlandi. UZI natijasida appendiks 9mm kattalashgani va yallig'lanish borligi aniqlandi.",
            options: {
              create: [
                {
                  text: "Sizda appenditsit. Zudlik bilan operatsiya qilamiz, boshqa iloj yo'q.",
                  patientResponse: "Bolamga nimadir bo'lsa sizni sudga beraman! Menga tushuntirib bering!",
                  emotionClass: "distressed",
                  emotionText: "😫 Vahimada",
                  vitalsHr: 120,
                  scoreDelta: -5,
                  nextStepId: null // Tugaydi (Yomon natija)
                },
                {
                  text: "Tahlillar appenditsitni ko'rsatmoqda. Akusher va jarrohlar konsiliumini chaqirib, siz uchun eng xavfsiz usulni tanlaymiz.",
                  patientResponse: "Rahmat doktor, iltimos, mutaxassislar bilan maslahatlashing.",
                  emotionClass: "calm",
                  emotionText: "😌 Ishonch",
                  vitalsHr: 85,
                  scoreDelta: 10,
                  nextStepId: null // Tugaydi (Muvaffaqiyatli)
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Keys yaratildi:', demoCase.title);
  console.log("✅ Baza to'ldirildi.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
