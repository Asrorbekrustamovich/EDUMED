const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const maleFirstNames = ["Dilshod", "Jasur", "Sardor", "Bekzod", "Nodir", "Odil", "Zafar", "Rustam", "Sherzod", "Botir", "Bobur", "Davron", "Olim", "Anvar", "Farruh", "Siroj", "Eldor", "Ulug'bek", "Temur", "Ilhom"];
const maleLastNames = ["Umarov", "Toshev", "Rahimov", "Soliyev", "Hakimov", "Azimov", "Nabiyev", "Karimov", "Alimov", "Saidov", "Jalolov", "G'ofurov", "Hasanov", "Fayzullayev", "Ortiqov", "Yusupov", "Akramov", "Murodov", "Sodiqov", "Tursunov"];

const femaleFirstNames = ["Anora", "Umida", "Laylo", "Nigora", "Malika", "Feruza", "Kamola", "Dildora", "Nilufar", "Madina", "Shirin", "Guli", "Zuhra", "Sevara", "Shahnoza", "Rayhon", "Lola", "Oydin", "Nafisa", "Aziza"];
const femaleLastNames = ["Karimova", "Alimova", "Saidova", "Umarova", "Tosheva", "Rahimova", "Soliyeva", "Hakimova", "Azimova", "Nabiyeva", "Jalolova", "G'ofurova", "Hasanova", "Fayzullayeva", "Ortiqova", "Yusupova", "Akramova", "Murodova", "Sodiqova", "Tursunova"];

const templates = [
  {
    category: "Xirurgiya",
    difficulty: "O'rta",
    baseTitle: "O'tkir Appenditsit",
    descTemplate: "Qorin sohasida o'tkir og'riq va ko'ngil aynishi shikoyati.",
    step1Msg: "Keys boshlandi. Bemor o'ng yonbosh sohasidagi chidab bo'lmas og'riq bilan qabulga keldi.",
    optA: { text: "Vahima qilmang! Hozir zudlik bilan operatsiya qilishimiz kerak, rozilik xatiga qo'l qo'ying!", response: "Operatsiya?! Shoshilmang shifokor, bolamga zarar yetmaydimi? Juda qo'rqyapman...", delta: -5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 105 },
    optB: { text: "Qo'rquvingiz o'rinli. Keling, avval ultratovush tekshiruvini qilib holatni aniq bilaylik.", response: "Rahmat shifokor, UZI xavfsizroq bo'lsa shuni qilaylik.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 88 },
    optC: { text: "Sizni tushunaman, keling zudlik bilan og'riqsizlantiruvchi ukol qilamiz va uyingizga ruxsat beramiz.", response: "Ukol yaxshi, lekin og'riq qaytalab qolsa nima qilaman?", delta: -15, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 95 }
  },
  {
    category: "Kardiologiya",
    difficulty: "Qiyin",
    baseTitle: "O'tkir Miokard Infarkti shubhasi",
    descTemplate: "Ko'krak qafasi ortida kuchli qisuvchi og'riq, chap yelkaga tarqalishi.",
    step1Msg: "Keys boshlandi. Bemor to'satdan boshlangan ko'krak qafasidagi yondiruvchi og'riq bilan keldi.",
    optA: { text: "Sizda infarkt bo'lishi mumkin! Zudlik bilan yotishingiz va harakat qilmasligingiz shart!", response: "Infarkt?! Voy yuragim, ahvolim og'irmi shifokor?", delta: 5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 110 },
    optB: { text: "Hozir EKG tekshiruvi o'tkazamiz, xavotir olmang, hammasi nazorat ostida.", response: "Yaxshi shifokor, tezroq yordam bering, nafasim qisilyapti.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 92 },
    optC: { text: "Bu shunchaki qovurg'alararo nevralgiya, hozir og'riqsizlantiruvchi beraman, o'tib ketadi.", response: "Lekin og'riq chap yelkamga ham tarqalyapti, xavotirdaman...", delta: -20, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 115 }
  },
  {
    category: "Terapiya",
    difficulty: "Oson",
    baseTitle: "O'tkir Gastrit xuruji",
    descTemplate: "Ovqatdan keyin epigastral sohada achishish, ko'ngil aynishi shikoyati.",
    step1Msg: "Keys boshlandi. Bemor noto'g'ri ovqatlanishdan so'ng oshqozon sohasidagi qattiq achishish bilan murojaat qildi.",
    optA: { text: "Nega ehtiyot bo'lmadingiz? Tezda yotib zond yutishingiz kerak!", response: "Zond?! Shartmi shifokor, u juda noqulay-ku...", delta: -5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 98 },
    optB: { text: "Oshqozon shilliq qavatini tekshirish uchun gastroskopiya tavsiya etiladi. Jarayon biroz yoqimsiz, lekin tez o'tadi.", response: "Tushundim shifokor, diagnoz aniq bo'lishi uchun chidashga tayyorman.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 80 },
    optC: { text: "Muhim narsa emas, dorixonadan o'zingiz xohlagan oshqozon dorisini olib ichavering.", response: "O'zim dorimi? Lekin shifokor ko'rigisiz zarar qilmaydimi?", delta: -10, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 88 }
  },
  {
    category: "Ginekologiya",
    difficulty: "O'rta",
    baseTitle: "Homiladorlik toksikozi",
    descTemplate: "Homiladorlikning 12-haftasida tinimsiz ko'ngil aynishi va qusish.",
    step1Msg: "Keys boshlandi. [BEMOR] to'xtovsiz qusish va holsizlik bilan qabulga keldi.",
    optA: { text: "Nega bunchalik kech keldingiz? Bola nobud bo'lishi mumkinligini bilmaysizmi?", response: "Rostdanmi?! Iltimos yordam bering, bolamga zarar yetmasin!", delta: -10, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 115 },
    optB: { text: "Bu homiladorlikdagi toksikoz belgisi. Hozir organizmni suvsizlanishdan asrash uchun tomchilatib ukol (kapelnitsa) qilamiz.", response: "Rahmat shifokor, kapelnitsadan keyin bolam yaxshi bo'ladimi?", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 90 },
    optC: { text: "Toksikoz o'tib ketadi. Uyingizga boring, ko'proq limonli suv iching.", response: "Lekin suv ham icholmayapman, qusish to'xtamayapti-ku...", delta: -15, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 108 }
  },
  {
    category: "Pediatriya",
    difficulty: "Oson",
    baseTitle: "O'tkir bronxit xuruji",
    descTemplate: "Yosh bolada kuchli quruq yo'tal, isitma va holsizlik.",
    step1Msg: "Keys boshlandi. Ona 5 yoshli farzandida tunda boshlangan kuchli yo'tal va 38.5C isitma bilan murojaat qildi.",
    optA: { text: "Bolani shamollatib qo'yibsiz-ku! Nega vaqtida issiq kiydirmadingiz?", response: "Kechiring shifokor, judayam xavotirdaman, tezroq yordam bering.", delta: -5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 120 },
    optB: { text: "Xavotirlanmang, hozir bolaning o'pkasini eshitib ko'ramiz. Kichkintoy, keling ayiqcha kabi nafas olamiz.", response: "Bola shifokorga jilmaydi va ko'rikka rozi bo'ldi.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 100 },
    optC: { text: "Darhol kuchli antibiotik yozib beraman, kuniga 3 mahal ichirasiz.", response: "Antibiotik? Analiz topshirmasdan bersak zarar qilmaydimi?", delta: -10, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 110 }
  },
  {
    category: "Nevrologiya",
    difficulty: "Qiyin",
    baseTitle: "Ishemik Insult shubhasi",
    descTemplate: "Tana chap yarmi uyushishi, nutqning chalkashishi.",
    step1Msg: "Keys boshlandi. Bemorda to'satdan yuzining qiyshayishi va gapirishga qiynalish alomatlari paydo bo'ldi.",
    optA: { text: "Tezda KT tekshiruviga yuguring! Har bir daqiqa g'animat, tez bo'ling!", response: "KT? Qayerga boraman, gapira olmayapman axir...", delta: 5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 105 },
    optB: { text: "Sizni tushunib turibman, tinchlaning. Hozir biz zudlik bilan nevrologik tekshiruv va KT o'tkazamiz. Sizga eng yaxshi yordamni ko'rsatamiz.", response: "Bemor biroz tinchlandi va boshi bilan tasdiqladi.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 90 },
    optC: { text: "Bu shunchaki charchoq yoki stress. Uyingizga borib yaxshilab dam oling.", response: "Lekin qo'limni umuman his qilmayapman, ketolmayman...", delta: -25, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 112 }
  },
  {
    category: "Terapiya",
    difficulty: "O'rta",
    baseTitle: "Saxarli Diabet dekompensatsiyasi",
    descTemplate: "Kuchli tashnalik, tez-tez siyish, nafasda meva hidi.",
    step1Msg: "Keys boshlandi. Qandli diabeti bor bemor holsizlik, og'iz qurishi va ko'ngil aynishi bilan murojaat qildi.",
    optA: { text: "Nega parhezga amal qilmayapsiz? Glukozangiz juda yuqori, hayotingiz xavfda!", response: "Kechiring shifokor, parhezni buzgan edim. Qanday yordam bera olasiz?", delta: 5, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 100 },
    optB: { text: "Keling, avval qondagi qand miqdorini tekshiramiz va organizmdagi ketoatsidoz holatini aniqlaymiz. Keyin insulin dozasini to'g'rilaymiz.", response: "Rahmat shifokor, sizga ishonaman.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 85 },
    optC: { text: "O'tgan safargi insulin dozasini ikki barobar oshirib iching yoki ukol qiling.", response: "Ikki barobar? Gipoglikemiyaga tushib qolmaymanmi?", delta: -15, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 95 }
  },
  {
    category: "Xirurgiya",
    difficulty: "Oson",
    baseTitle: "Ingichka ichak churrasi qisilib qolishi",
    descTemplate: "Kindik atrofida og'riqli shish, tugun paydo bo'lishi.",
    step1Msg: "Keys boshlandi. Bemor kindik sohasidagi og'riqli, qaytmas shish va qusish shikoyati bilan keldi.",
    optA: { text: "Darhol shishni qo'limiz bilan kuch bilan joyiga tiqishga harakat qilamiz!", response: "Voy og'riyapti! Shifokor, iltimos bu og'riqqa chidab bo'lmaydi!", delta: -20, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 120 },
    optB: { text: "Bu qisilgan churra bo'linger. Hozir zudlik bilan jarroh ko'rigidan o'tasiz va operatsiyaga tayyorgarlik ko'ramiz.", response: "Tushundim, jarroh operatsiya qilishi kerak bo'lsa rozi bo'laman.", delta: 10, emotionClass: "calm", emotionText: "😌 Tinchlangan", hr: 90 },
    optC: { text: "Bemorga og'riqsizlantiruvchi surtma yozamiz va uyda issiq vanna qabul qilishni aytamiz.", response: "Lekin churra qattiq og'riyapti, issiq vanna mumkinligiga aminmisiz?", delta: -25, emotionClass: "anxious", emotionText: "😰 Tashvishlangan", hr: 110 }
  }
];

async function main() {
  console.log("1000 ta klinik simulyatsiya keyslarini yaratish boshlandi...");

  // Clear existing cases and relations in proper dependency order
  await prisma.simulationResult.deleteMany();
  await prisma.simulationOption.deleteMany();
  await prisma.simulationStep.deleteMany();
  await prisma.case.deleteMany();
  console.log("Eski keyslar va unga bog'liq natijalar, qadamlar o'chirildi.");

  let created = 0;
  for (let i = 1; i <= 1000; i++) {
    const template = templates[i % templates.length];
    
    let gender = 'male';
    let age = 18 + ((i * 13) % 65);
    
    if (template.category === 'Ginekologiya' || template.baseTitle.toLowerCase().includes('homilador')) {
      gender = 'female';
      age = 18 + ((i * 7) % 25); // 18 to 42
    } else if (template.category === 'Pediatriya') {
      age = 2 + ((i * 3) % 11); // 2 to 12
      gender = i % 2 === 0 ? 'male' : 'female';
    } else {
      gender = i % 2 === 0 ? 'male' : 'female';
    }

    let firstName = '';
    let lastName = '';
    let avatar = '';

    if (gender === 'female') {
      firstName = femaleFirstNames[(i * 3) % femaleFirstNames.length];
      lastName = femaleLastNames[(i * 7) % femaleLastNames.length];
      avatar = "👩‍🦰";
    } else {
      firstName = maleFirstNames[(i * 3) % maleFirstNames.length];
      lastName = maleLastNames[(i * 7) % maleLastNames.length];
      avatar = "👨";
    }
    
    const patientName = `${firstName} ${lastName}`;
    
    const title = `Keys №${i + 12}: ${template.baseTitle} (${patientName}, ${age} yosh)`;
    const description = `${patientName}, ${age} yosh. ${template.descTemplate} Diagnostika va bemor bilan etiko-deontologik muloqot rejasini tuzing.`;

    const step1Id = crypto.randomUUID();
    const step2Id = crypto.randomUUID();

    const systemMsg = `${template.step1Msg.replace("[BEMOR]", `12 haftalik homilador ayol`)} Bemor yoshi ${age} da, jinsi ${avatar === "👩‍🦰" ? "Ayol" : "Erkak"}.`;

    await prisma.case.create({
      data: {
        title,
        description,
        difficulty: template.difficulty,
        category: template.category,
        isActive: true,
        steps: {
          create: [
            {
              id: step1Id,
              systemMessage: systemMsg,
              stepOrder: 0,
              options: {
                create: [
                  {
                    text: template.optA.text,
                    patientResponse: template.optA.response,
                    emotionClass: template.optA.emotionClass,
                    emotionText: template.optA.emotionText,
                    vitalsHr: template.optA.hr,
                    scoreDelta: template.optA.delta,
                    nextStepId: step2Id
                  },
                  {
                    text: template.optB.text,
                    patientResponse: template.optB.response,
                    emotionClass: template.optB.emotionClass,
                    emotionText: template.optB.emotionText,
                    vitalsHr: template.optB.hr,
                    scoreDelta: template.optB.delta,
                    nextStepId: step2Id
                  },
                  {
                    text: template.optC.text,
                    patientResponse: template.optC.response,
                    emotionClass: template.optC.emotionClass,
                    emotionText: template.optC.emotionText,
                    vitalsHr: template.optC.hr,
                    scoreDelta: template.optC.delta,
                    nextStepId: step2Id
                  }
                ]
              }
            },
            {
              id: step2Id,
              systemMessage: "Ikkinchi bosqich. Bemorning dastlabki holati va reaktsiyasini ko'rib chiqib, endi tibbiy huquq va deontologiya doirasidagi keyingi to'g'ri qarorni qabul qiling.",
              stepOrder: 1,
              options: {
                create: [
                  {
                    text: "Bemorga va uning yaqinlariga barcha xavf-xatarlar va kutilayotgan davolash asoratlarini tushuntirib, yozma rozilik olamiz.",
                    patientResponse: "Tushundim shifokor, batafsil tushuntirganingiz uchun rahmat. Rozilik varaqasiga qo'l qo'yaman.",
                    emotionClass: "calm",
                    emotionText: "😌 Tinchlangan",
                    vitalsHr: 82,
                    scoreDelta: 15,
                    nextStepId: null
                  },
                  {
                    text: "Rozilik olish shart emas, zudlik bilan tibbiy aralashuvga kirishamiz (bemor hayotiy xavfda deb hisoblab).",
                    patientResponse: "Nega mendan so'ramayapsizlar? Men hali rozilik berganim yo'q-ku! Huquqim bormi o'zi?",
                    emotionClass: "anxious",
                    emotionText: "😰 Tashvishlangan",
                    vitalsHr: 110,
                    scoreDelta: -10,
                    nextStepId: null
                  },
                  {
                    text: "Qaror qabul qilishni bemorning yaqinlariga topshiramiz va bemorning fikrini inobatga olmaymiz.",
                    patientResponse: "Nima uchun qarindoshlarim hal qiladi? Men voyaga yetganman-ku, o'zim qaror qabul qilaman!",
                    emotionClass: "anxious",
                    emotionText: "😰 Tashvishlangan",
                    vitalsHr: 102,
                    scoreDelta: -5,
                    nextStepId: null
                  }
                ]
              }
            }
          ]
        }
      }
    });

    created++;
    if (created % 100 === 0) {
      console.log(`${created} ta keys muvaffaqiyatli bazaga yuklandi.`);
    }
  }

  console.log(`Tabriklaymiz! Jami ${created} ta klinik simulyatsiya keyslari SQLite bazasiga muvaffaqiyatli yuklandi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
