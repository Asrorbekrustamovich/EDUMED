# EduMed Deontolog — Ishga tushirish qo'llanmasi

## Eng oson yo'l

**START.bat** faylini ikki marta bosing. U avtomatik ravishda:

1. Backend serverni ishga tushiradi (http://localhost:3000)
2. Frontend'ni ishga tushiradi (http://localhost:5173)
3. Brauzerni ochadi

Ochilgan ikkita qora oynani (terminal) yopmang — ular server hisoblanadi.

## Qo'lda ishga tushirish

Ikkita alohida terminal oching:

**1-terminal (Backend):**
```
cd backend
node server.js
```

**2-terminal (Frontend):**
```
npm run dev
```

Keyin brauzerda http://localhost:5173 ni oching.

## Kirish ma'lumotlari

| Rol | Email | Parol |
|---|---|---|
| Admin | admin@edumed.uz | admin123 |
| Talaba | student@edumed.uz | student123 |

O'qituvchi sifatida kirish uchun ro'yxatdan o'tish sahifasida "O'qituvchi" rolini tanlab yangi hisob oching.

## Tizim tarkibi (hammasi real ma'lumotlar bilan ishlaydi)

- **Talaba:** Dashboard, 1000+ klinik keys simulyatsiyasi (real taymer, dinamik hayotiy ko'rsatkichlar), etika testlari (qonun moddalari sharhi bilan), laboratoriya, natijalar tahlili (qarorlar xronologiyasi, xatolar tahlili), profil (real reyting, sertifikatlar), volontyorlik.
- **O'qituvchi:** real talabalar ro'yxati va ko'rsatkichlari, taqsimot diagrammasi, eng qiyin keyslar, talaba tafsiloti (radar, tarix), yangi keys yaratish konstruktori (bazaga saqlanadi).
- **Admin:** real foydalanuvchilar/rol taqsimoti, monitoring (real faollik xaritasi, CSV/PDF hisobotlar), kontent boshqaruvi (qidiruv, sahifalash, nashr/qoralama, o'chirish), volontyorlik loyihalari, haqiqiy zaxira nusxalar (backend/backups papkasiga saqlanadi).

## Eslatmalar

- Ma'lumotlar bazasi: `backend/prisma/dev.db` (SQLite). Zaxira nusxalar: `backend/backups/`.
- `app.py` (Flask) — eski muqobil variant, ishlatilmaydi. Asosiy backend — `backend/server.js` (Node.js).
- Bazani qayta to'ldirish kerak bo'lsa: `cd backend && node seed.js && node seed-cases.js && node seed-ethics.js` (diqqat: mavjud natijalarni o'chiradi).
