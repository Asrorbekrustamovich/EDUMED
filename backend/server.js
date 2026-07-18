// Enforce Asia/Tashkent timezone globally for all date/time calculations
process.env.TZ = 'Asia/Tashkent';

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'edumed_super_secret_key_2026';

// Seeded random number generator
function getSeededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return function() {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// Selects exactly 10 cases daily using current date as seed
function getDailyCases(allCases) {
  if (allCases.length <= 10) return allCases;
  const todayStr = new Date().toLocaleDateString('en-US'); // e.g. "7/15/2026"
  const rand = getSeededRandom(todayStr);
  
  const shuffled = [...allCases];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 10);
}

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email: emailField, password, role, university } = req.body;

    // Support both username (new) and email (old) fields
    // If username provided, convert to internal email format for storage
    let storedEmail;
    if (username) {
      // If username contains @, use it directly; otherwise append domain
      storedEmail = username.includes('@') ? username : `${username}@edumed.local`;
    } else {
      storedEmail = emailField;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: storedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: "Bu foydalanuvchi ismi band, boshqa ism tanlang" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email: storedEmail,
        password: hashedPassword,
        role: role || 'student',
        university: university || 'TMA',
        year: '3',
      }
    });
    
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server xatosi" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, email: emailField, password } = req.body;

    let user = null;

    if (username) {
      // New username-based login
      // Try direct match first (existing email accounts: admin@edumed.uz etc.)
      user = await prisma.user.findUnique({ where: { email: username } });
      // If not found, try with @edumed.local suffix (new username-based accounts)
      if (!user) {
        const converted = username.includes('@') ? username : `${username}@edumed.local`;
        user = await prisma.user.findUnique({ where: { email: converted } });
      }
    } else {
      // Legacy email-based login (backward compatibility)
      user = await prisma.user.findUnique({ where: { email: emailField } });
    }

    if (!user) return res.status(400).json({ error: "Foydalanuvchi ismi yoki parol xato" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Foydalanuvchi ismi yoki parol xato" });
    
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Avtorizatsiya talab etiladi" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Yaroqsiz token" });
  }
};

// --- DATA ROUTES ---
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true, points: true, casesDone: true, university: true, year: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Xato yuz berdi" });
  }
});

app.put('/api/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, university } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, email, university },
      select: { id: true, name: true, email: true, role: true, points: true, casesDone: true, university: true, year: true }
    });
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xato yuz berdi. Balki email band." });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await prisma.case.findMany({ where: { isActive: true } });
    res.json(getDailyCases(cases));
  } catch (error) {
    res.status(500).json({ error: "Xato yuz berdi" });
  }
});

app.post('/api/results', authMiddleware, async (req, res) => {
  try {
    const { score, duration, caseId } = req.body;
    
    // Save result
    const result = await prisma.simulationResult.create({
      data: {
        score,
        duration,
        userId: req.user.userId,
        caseId: caseId
      }
    });
    
    // Update user stats
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        points: { increment: score },
        casesDone: { increment: 1 }
      }
    });
    
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xato yuz berdi" });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        steps: {
          include: {
            options: true
          },
          orderBy: { stepOrder: 'asc' }
        }
      }
    });
    if (!caseData) return res.status(404).json({ error: 'Case not found' });
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching case' });
  }
});

app.get('/api/ethics', async (req, res) => {
  try {
    // Get all questions and randomize
    const questions = await prisma.ethicsQuestion.findMany();
    const random = questions.sort(() => 0.5 - Math.random());
    res.json(random);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ethics questions' });
  }
});

// GET user stats dynamically
app.get('/api/user/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        results: {
          include: { case: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });

    const allCases = await prisma.case.findMany({ where: { isActive: true } });
    const dailyCases = getDailyCases(allCases);
    const dailyCaseIds = dailyCases.map(c => c.id);
    const totalCases = 10;

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const completedToday = user.results.filter(r => 
      new Date(r.createdAt) >= todayStart && dailyCaseIds.includes(r.caseId)
    );
    const uniqueCompletedTodayIds = [...new Set(completedToday.map(r => r.caseId))];
    const completedCases = uniqueCompletedTodayIds.length;

    // Sum up duration for last 7 days grouped by weekday
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    let weeklyHours = 0;
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
    startOfWeek.setHours(0,0,0,0);
    
    user.results.forEach(res => {
      const resDate = new Date(res.createdAt);
      if (resDate >= startOfWeek) {
        // day index: 0 is Sun, 1 is Mon... in JS. We map to 0 Mon - 6 Sun.
        let dayIdx = resDate.getDay() - 1;
        if (dayIdx === -1) dayIdx = 6; // Sunday
        
        const hrs = res.duration / 60;
        weeklyData[dayIdx] += parseFloat(hrs.toFixed(1));
        weeklyHours += hrs;
      }
    });
    
    weeklyHours = parseFloat(weeklyHours.toFixed(1));

    // Calculate clinical score average
    const simulationScores = user.results.map(r => r.score);
    const avgClinical = simulationScores.length > 0 
      ? Math.round(simulationScores.reduce((a,b) => a+b, 0) / simulationScores.length)
      : 0;

    // Timeline entries
    const timeline = [];
    user.results.slice(0, 5).forEach(res => {
      timeline.push({
        title: `${res.case.title} keysini yakunladi — ${res.score}%`,
        time: new Date(res.createdAt).toLocaleDateString('uz-UZ') + ' ' + new Date(res.createdAt).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'}),
        color: res.score >= 80 ? 'var(--green)' : 'var(--primary)'
      });
    });
    
    // If empty timeline, push starter event
    if (timeline.length === 0) {
      timeline.push({
        title: "Tizimda ro'yxatdan o'tdi",
        time: new Date(user.createdAt).toLocaleDateString('uz-UZ'),
        color: 'var(--primary)'
      });
    }

    // Dynamic Achievements
    const achievements = [
      { emoji: '🏆', title: 'Birinchi Keys', earned: user.casesDone >= 1 },
      { emoji: '🎯', title: '10 ta Simulyatsiya', earned: user.casesDone >= 10 },
      { emoji: '⭐', title: 'Etika Ustasi', earned: user.ethicsScore >= 80 && user.ethicsDone >= 1 },
      { emoji: '🔬', title: 'Lab Tadqiqotchi', earned: user.casesDone >= 3 },
      { emoji: '💡', title: 'Tez Fikrlovchi', earned: user.results.some(r => r.duration < 10) },
      { emoji: '🏅', title: '100% Aniqlik', earned: user.results.some(r => r.score === 100) }
    ];

    // Checklist / Goals
    const goals = [
      { text: 'Ertalabki etika viktorinasini yakunlash', done: user.ethicsDone >= 1 },
      { text: 'Bemor muloqoti simulyatsiyasi', done: user.casesDone >= 1 },
      { text: 'Tibbiy etika qonunlarini o\'rganish', done: user.ethicsScore >= 70 },
      { text: 'Laboratoriya xulosalarini tasdiqlash', done: user.casesDone >= 1 },
      { text: 'Barcha keyslarni muvaffaqiyatli yakunlash', done: user.casesDone === totalCases && totalCases > 0 }
    ];

    // Competency Radar scores based on actual metrics
    const radar = {
      diagnostics: Math.min(100, Math.round(avgClinical * 0.95)) || 50,
      treatment: Math.min(100, Math.round(avgClinical * 0.9)) || 50,
      communication: Math.min(100, Math.round(avgClinical * 1.05)) || 50,
      ethics: user.ethicsScore || 50,
      law: Math.min(100, Math.round(user.ethicsScore * 0.9)) || 50
    };

    res.json({
      completedCases: user.casesDone,
      totalCases,
      ethicsScore: user.ethicsScore,
      clinicalScore: avgClinical || 50,
      weeklyHours,
      weeklyData,
      goals,
      achievements,
      timeline,
      radar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server stats error" });
  }
});

// POST ethics test result
app.post('/api/ethics-results', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body; // percentage (0-100)
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newCount = user.ethicsDone + 1;
    const newScore = Math.round(((user.ethicsScore * user.ethicsDone) + score) / newCount);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ethicsScore: newScore,
        ethicsDone: newCount,
        points: { increment: Math.round(score / 5) }
      }
    });
    res.json({ success: true, ethicsScore: newScore, ethicsDone: newCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error submitting ethics results" });
  }
});

// GET user notifications dynamically
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        results: { include: { case: true }, orderBy: { createdAt: 'desc' } },
        feedbacks: { orderBy: { createdAt: 'desc' } }
      }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });

    const notifications = [];

    // 1. Welcome
    notifications.push({
      id: "welcome",
      icon: "👋",
      title: "Platformaga xush kelibsiz!",
      desc: "EduMed Deontolog platformasida tibbiy etika, deontologiya va klinik muloqotni rivojlantiring.",
      time: new Date(user.createdAt).toLocaleDateString('uz-UZ'),
      unread: false,
      type: "primary"
    });

    // 2. Simulation results
    user.results.forEach((r, idx) => {
      notifications.push({
        id: `sim-${r.id}`,
        icon: "🔬",
        title: "Klinik simulyatsiya yakunlandi",
        desc: `"${r.case.title}" keysini ${r.score}% natija bilan yakunladingiz. Davomiyligi: ${r.duration} daqiqa.`,
        time: new Date(r.createdAt).toLocaleDateString('uz-UZ') + ' ' + new Date(r.createdAt).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'}),
        unread: idx === 0 && (new Date() - new Date(r.createdAt) < 600000),
        type: r.score >= 80 ? "success" : (r.score >= 60 ? "primary" : "warning")
      });
    });

    // 3. Ethics test
    if (user.ethicsDone > 0) {
      notifications.push({
        id: "ethics-summary",
        icon: "🛡️",
        title: "Etiko-deontologik testlar topshirildi",
        desc: `Siz jami ${user.ethicsDone} marta etika testlarini yakunladingiz. O'rtacha ko'rsatkich: ${user.ethicsScore}%.`,
        time: "Faol",
        unread: false,
        type: user.ethicsScore >= 80 ? "success" : "primary"
      });
    }

    // 4. Achievements
    if (user.casesDone >= 1) {
      notifications.push({
        id: "ach-1",
        icon: "🏆",
        title: "Yangi yutuq ochildi!",
        desc: "Tabriklaymiz! Birinchi keysni yakunlaganingiz uchun 'Birinchi Keys' yutug'ini qo'lga kiritdingiz.",
        time: "Faol",
        unread: false,
        type: "success"
      });
    }

    // 5. Direct Feedbacks from Teachers
    if (user.feedbacks) {
      user.feedbacks.forEach(f => {
        notifications.push({
          id: `feedback-${f.id}`,
          icon: "💬",
          title: `${f.teacherName} (O'qituvchi) dan xabar`,
          desc: f.message,
          time: new Date(f.createdAt).toLocaleDateString('uz-UZ') + ' ' + new Date(f.createdAt).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'}),
          unread: !f.isRead,
          type: "info"
        });
      });

      // Automatically mark fetched feedbacks as read
      await prisma.feedback.updateMany({
        where: { userId: req.user.userId, isRead: false },
        data: { isRead: true }
      });
    }

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server notifications error" });
  }
});

// POST log incorrect answer
app.post('/api/wrong-answers', authMiddleware, async (req, res) => {
  try {
    const { questionText, selectedOption, correctOption, type } = req.body;
    if (!questionText || !selectedOption || !correctOption || !type) {
      return res.status(400).json({ error: "Barcha maydonlarni kiriting" });
    }
    const wrong = await prisma.incorrectAnswer.create({
      data: {
        userId: req.user.userId,
        questionText,
        selectedOption,
        correctOption,
        type
      }
    });
    res.json({ success: true, wrong });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error logging wrong answer" });
  }
});

// POST send teacher feedback to a student
app.post('/api/feedback', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, message } = req.body;
    if (!studentId || !message) {
      return res.status(400).json({ error: "Talaba ID va xabarni kiriting" });
    }
    
    const teacher = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!teacher) return res.status(404).json({ error: "O'qituvchi topilmadi" });

    const feedback = await prisma.feedback.create({
      data: {
        userId: studentId,
        teacherId: teacher.id,
        teacherName: teacher.name,
        message
      }
    });
    res.json({ success: true, feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error saving feedback" });
  }
});

// Seed initial volunteer projects if they don't exist
async function seedVolunteers() {
  try {
    const count = await prisma.volunteerProject.count();
    if (count === 0) {
      await prisma.volunteerProject.createMany({
        data: [
          {
            id: 'charity',
            avatar: '🏥',
            title: 'Shifoxona Xayriya Tashrifi',
            description: 'Bemor bolalar kayfiyatini ko\'tarish va ularga psixologik yordam ko\'rsatish dasturi.',
            date: '20-Iyul, 2026 • 09:00 - 13:00',
            location: 'Shahar Bolalar Shifoxonasi №3',
            slotsMax: 20,
            pointsReward: 500
          },
          {
            id: 'blood',
            avatar: '❤️',
            title: 'Qon Topshirish Aksiyasi',
            description: '"Donor bo\'l - hayot qutqar!" shiori ostida markaziy qon quyish stansiyasida yordam.',
            date: '1-Avgust, 2026 • 08:00 - 15:00',
            location: 'Respublika Qon Markazi',
            slotsMax: 50,
            pointsReward: 400
          },
          {
            id: 'education',
            avatar: '📚',
            title: 'Maktablarda Tibbiy Ta\'lim',
            description: 'Maktab o\'quvchilariga birinchi yordam ko\'rsatish bo\'yicha amaliy mashg\'ulotlar o\'tish.',
            date: '25-Iyul, 2026 • 14:00 - 16:00',
            location: '15-umumiy o\'rta ta\'lim maktabi',
            slotsMax: 10,
            pointsReward: 600
          }
        ]
      });
      console.log('🌱 Volunteer projects seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding volunteer projects:', err);
  }
}
seedVolunteers();

// GET all volunteer projects
app.get('/api/volunteer/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.volunteerProject.findMany({
      include: {
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = projects.map(p => {
      const isApplied = p.applications.some(a => a.userId === req.user.userId);
      return {
        id: p.id,
        avatar: p.avatar,
        title: p.title,
        description: p.description,
        date: p.date,
        location: p.location,
        slotsMax: p.slotsMax,
        slotsCurrent: p.applications.length,
        pointsReward: p.pointsReward,
        tag: isApplied ? 'Siz Qabul Qilingansiz' : 'Yangi',
        tagClass: isApplied ? 'badge-success' : 'badge-primary'
      };
    });
    
    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loyihalarni yuklab bo'lmadi" });
  }
});

// GET user volunteer applications (history timeline)
app.get('/api/volunteer/my-applications', authMiddleware, async (req, res) => {
  try {
    const apps = await prisma.volunteerApplication.findMany({
      where: { userId: req.user.userId },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Arizalarni yuklab bo'lmadi" });
  }
});

// POST apply for volunteer project
app.post('/api/volunteer/apply', authMiddleware, async (req, res) => {
  try {
    const { projectId, pointsReward } = req.body;
    
    // Check if already applied
    const existing = await prisma.volunteerApplication.findFirst({
      where: { projectId, userId: req.user.userId }
    });
    if (existing) {
      return res.status(400).json({ error: "Siz ushbu loyihaga allaqachon ariza berib bo'lgansiz." });
    }

    // Create application
    await prisma.volunteerApplication.create({
      data: {
        projectId,
        userId: req.user.userId
      }
    });

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        points: { increment: pointsReward }
      }
    });
    res.json({ success: true, points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Volontyorlik arizasi saqlanmadi" });
  }
});

// POST create volunteer project (Admin only)
app.post('/api/volunteer/projects', authMiddleware, async (req, res) => {
  try {
    const { avatar, title, description, date, location, slotsMax, pointsReward } = req.body;
    const project = await prisma.volunteerProject.create({
      data: {
        avatar,
        title,
        description,
        date,
        location,
        slotsMax: parseInt(slotsMax) || 20,
        pointsReward: parseInt(pointsReward) || 500
      }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loyihani yaratib bo'lmadi" });
  }
});

// DELETE volunteer project (Admin only)
app.delete('/api/volunteer/projects/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.volunteerProject.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loyihani o'chirib bo'lmadi" });
  }
});

// ======================================================
// ===  REAL DATA ENDPOINTS (teacher / admin / content) ===
// ======================================================
const fs = require('fs');
const path = require('path');

// Role guard helper
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    next();
  };
}

// --- TEACHER: real overview (students, distribution, hardest cases) ---
app.get('/api/teacher/overview', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'student' },
      include: { results: { include: { case: true }, orderBy: { createdAt: 'desc' } } },
      orderBy: { points: 'desc' }
    });

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    const totalCases = await prisma.case.count({ where: { isActive: true } });
    const todaySessions = await prisma.simulationResult.count({ where: { createdAt: { gte: todayStart } } });
    const newThisWeek = students.filter(s => new Date(s.createdAt) >= weekAgo).length;

    const rows = students.map(s => {
      const scores = s.results.map(r => r.score);
      const avgCognitive = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const aks = s.ethicsDone > 0 ? s.ethicsScore : 0;
      let status = 'Boshlanmagan';
      if (s.casesDone > 0 || s.ethicsDone > 0) {
        const composite = (avgCognitive + aks) / 2;
        status = composite >= 86 ? "A'lo" : composite >= 71 ? 'Yaxshi' : composite >= 56 ? 'Qoniqarli' : 'Diqqat kerak';
      }
      return {
        id: s.id, name: s.name, email: s.email,
        casesDone: s.casesDone, ethicsDone: s.ethicsDone,
        points: s.points, cognitive: avgCognitive, axiological: aks, status,
        lastActive: s.results[0] ? s.results[0].createdAt : s.createdAt
      };
    });

    // Distribution buckets by composite score (only students with activity)
    const active = rows.filter(r => r.casesDone > 0 || r.ethicsDone > 0);
    const bucket = { alo: 0, yaxshi: 0, qoniqarli: 0, qoniqarsiz: 0 };
    active.forEach(r => {
      const c = (r.cognitive + r.axiological) / 2;
      if (c >= 86) bucket.alo++;
      else if (c >= 71) bucket.yaxshi++;
      else if (c >= 56) bucket.qoniqarli++;
      else bucket.qoniqarsiz++;
    });

    // Hardest cases: lowest average score among cases with results
    const grouped = await prisma.simulationResult.groupBy({
      by: ['caseId'],
      _avg: { score: true },
      _count: { caseId: true }
    });
    grouped.sort((a, b) => (a._avg.score || 0) - (b._avg.score || 0));
    const hardest = [];
    for (const g of grouped.slice(0, 3)) {
      const c = await prisma.case.findUnique({ where: { id: g.caseId }, select: { id: true, title: true } });
      if (c) hardest.push({ id: c.id, title: c.title, avgScore: Math.round(g._avg.score || 0), attempts: g._count.caseId });
    }

    const ethicsAvgArr = rows.filter(r => r.ethicsDone > 0).map(r => r.axiological);
    const avgEthics = ethicsAvgArr.length ? Math.round(ethicsAvgArr.reduce((a, b) => a + b, 0) / ethicsAvgArr.length) : 0;

    // Real alerts
    const alerts = [];
    const weak = rows.filter(r => (r.casesDone > 0 || r.ethicsDone > 0) && r.axiological < 50);
    if (weak.length) alerts.push({ icon: '⚠️', type: 'red', title: 'Diqqat talab etiladi', desc: `${weak.length} ta talaba etika (aksiologik) bo'yicha 50% dan past: ${weak.slice(0, 3).map(w => w.name).join(', ')}${weak.length > 3 ? '…' : ''}` });
    if (todaySessions > 0) alerts.push({ icon: '✅', type: 'green', title: 'Bugungi faollik', desc: `Bugun ${todaySessions} ta simulyatsiya sessiyasi yakunlandi.` });
    if (newThisWeek > 0) alerts.push({ icon: '👋', type: 'blue', title: 'Yangi talabalar', desc: `So'nggi 7 kunda ${newThisWeek} ta yangi talaba ro'yxatdan o'tdi.` });
    if (!alerts.length) alerts.push({ icon: 'ℹ️', type: 'blue', title: "Ma'lumot", desc: 'Hozircha yangi hodisalar yo\'q.' });

    res.json({
      totalStudents: students.length,
      newThisWeek,
      activeCases: totalCases,
      avgEthics,
      todaySessions,
      students: rows,
      distribution: { total: active.length, ...bucket },
      hardestCases: hardest,
      alerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Teacher overview xatosi' });
  }
});

// --- TEACHER: single student details (real) ---
app.get('/api/teacher/students/:id', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const s = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        results: { include: { case: true }, orderBy: { createdAt: 'desc' } },
        incorrectAnswers: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!s) return res.status(404).json({ error: 'Talaba topilmadi' });

    const scores = s.results.map(r => r.score);
    const avgCognitive = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const aks = s.ethicsDone > 0 ? s.ethicsScore : 0;

    // Group averages for comparison
    const allStudents = await prisma.user.findMany({ where: { role: 'student' }, include: { results: true } });
    const gCog = [], gAks = [];
    allStudents.forEach(u => {
      const sc = u.results.map(r => r.score);
      if (sc.length) gCog.push(Math.round(sc.reduce((a, b) => a + b, 0) / sc.length));
      if (u.ethicsDone > 0) gAks.push(u.ethicsScore);
    });
    const groupCognitive = gCog.length ? Math.round(gCog.reduce((a, b) => a + b, 0) / gCog.length) : 0;
    const groupAxiological = gAks.length ? Math.round(gAks.reduce((a, b) => a + b, 0) / gAks.length) : 0;

    const totalCases = await prisma.case.count({ where: { isActive: true } });
    const weakResults = s.results.filter(r => r.score < 60).slice(0, 5);

    res.json({
      id: s.id, name: s.name, email: s.email, university: s.university, year: s.year,
      createdAt: s.createdAt, points: s.points,
      casesDone: s.casesDone, ethicsDone: s.ethicsDone,
      cognitive: avgCognitive, axiological: aks,
      groupCognitive, groupAxiological, totalCases,
      results: s.results.slice(0, 20).map(r => ({
        id: r.id, title: r.case.title, score: r.score, duration: r.duration, date: r.createdAt
      })),
      weakResults: weakResults.map(r => ({ title: r.case.title, score: r.score, date: r.createdAt })),
      incorrectAnswers: s.incorrectAnswers || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Talaba tafsilotlari xatosi' });
  }
});

// --- ADMIN: real system overview (also used by Monitoring page) ---
app.get('/api/admin/overview', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true, casesDone: true, ethicsScore: true, points: true } });
    const casesCount = await prisma.case.count({ where: { isActive: true } });
    const casesAll = await prisma.case.count();
    const ethicsCount = await prisma.ethicsQuestion.count();
    const projectsCount = await prisma.volunteerProject.count();

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const results = await prisma.simulationResult.findMany({
      include: { user: { select: { name: true } }, case: { select: { title: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const todayResults = results.filter(r => new Date(r.createdAt) >= todayStart);
    const durations = results.map(r => r.duration).filter(d => d > 0);
    const avgSession = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const avgSuccess = results.length ? Math.round(results.map(r => r.score).reduce((a, b) => a + b, 0) / results.length) : 0;

    // Heatmap: sessions per day, current month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const heatmap = Array(daysInMonth).fill(0);
    results.forEach(r => {
      const d = new Date(r.createdAt);
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        heatmap[d.getDate() - 1]++;
      }
    });

    // Real DB size
    let dbSizeMB = 0;
    try {
      const st = fs.statSync(path.join(__dirname, 'prisma', 'dev.db'));
      dbSizeMB = +(st.size / (1024 * 1024)).toFixed(1);
    } catch (e) { /* ignore */ }

    // Activity journal: recent results + recent registrations, merged
    const activity = [];
    results.slice(0, 8).forEach(r => activity.push({
      user: r.user.name,
      action: `"${r.case.title}" keysini ${r.score}% natija bilan yakunladi`,
      time: r.createdAt,
      color: r.score >= 80 ? '#22C55E' : r.score >= 60 ? '#2563EB' : '#EF4444'
    }));
    users.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).forEach(u => activity.push({
      user: u.name, action: `tizimda ro'yxatdan o'tdi (${u.role})`, time: u.createdAt, color: '#6B7280'
    }));
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      counts: {
        users: users.length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'admin').length,
        cases: casesCount, casesAll, ethicsQuestions: ethicsCount, projects: projectsCount,
        resultsTotal: results.length, resultsToday: todayResults.length
      },
      avgSession, avgSuccess, dbSizeMB, heatmap,
      month: now.getMonth() + 1, year: now.getFullYear(),
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, casesDone: u.casesDone, points: u.points })),
      activity: activity.slice(0, 10)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Admin overview xatosi' });
  }
});

// --- CONTENT: paginated real case list for CMS ---
app.get('/api/content', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const perPage = Math.min(30, parseInt(req.query.perPage) || 9);
    const q = (req.query.q || '').trim();
    const status = req.query.status; // 'active' | 'draft'

    const where = {};
    if (q) where.title = { contains: q };
    if (status === 'active') where.isActive = true;
    if (status === 'draft') where.isActive = false;

    const total = await prisma.case.count({ where });
    const items = await prisma.case.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { title: 'asc' },
      include: { _count: { select: { results: true, steps: true } } }
    });
    const ethicsCount = await prisma.ethicsQuestion.count();
    const activeCount = await prisma.case.count({ where: { isActive: true } });
    const draftCount = await prisma.case.count({ where: { isActive: false } });

    res.json({
      page, perPage, total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      counts: { cases: activeCount + draftCount, active: activeCount, draft: draftCount, ethics: ethicsCount },
      items: items.map(c => ({
        id: c.id, title: c.title, description: c.description,
        difficulty: c.difficulty, category: c.category, isActive: c.isActive,
        attempts: c._count.results, steps: c._count.steps
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kontent yuklashda xato' });
  }
});

// --- CASES: create (Scenario Builder) ---
app.post('/api/cases', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, difficulty, category, isActive, steps } = req.body;
    if (!title || !steps || !steps.length) {
      return res.status(400).json({ error: "Sarlavha va kamida bitta qadam kiritilishi shart" });
    }
    const crypto = require('crypto');
    const stepIds = steps.map(() => crypto.randomUUID());

    const created = await prisma.case.create({
      data: {
        title,
        description: description || '',
        difficulty: difficulty || "O'rta",
        category: category || 'Umumiy',
        isActive: isActive !== false,
        steps: {
          create: steps.map((s, i) => ({
            id: stepIds[i],
            systemMessage: s.systemMessage,
            stepOrder: i,
            options: {
              create: (s.options || []).map(o => ({
                text: o.text,
                patientResponse: o.patientResponse || '...',
                emotionClass: (o.scoreDelta || 0) > 0 ? 'calm' : 'anxious',
                emotionText: (o.scoreDelta || 0) > 0 ? '😌 Tinchlangan' : '😰 Tashvishlangan',
                vitalsHr: (o.scoreDelta || 0) > 0 ? 85 : 105,
                scoreDelta: parseInt(o.scoreDelta) || 0,
                nextStepId: i < steps.length - 1 ? stepIds[i + 1] : null
              }))
            }
          }))
        }
      }
    });
    res.json({ success: true, id: created.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Keys yaratishda xato' });
  }
});

// --- CASES: update meta / publish-unpublish ---
app.put('/api/cases/:id', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, difficulty, category, isActive } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (difficulty !== undefined) data.difficulty = difficulty;
    if (category !== undefined) data.category = category;
    if (isActive !== undefined) data.isActive = isActive;
    const updated = await prisma.case.update({ where: { id: req.params.id }, data });
    res.json({ success: true, case: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Keysni yangilashda xato' });
  }
});

// --- CASES: delete (with relations) ---
app.delete('/api/cases/:id', authMiddleware, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.simulationResult.deleteMany({ where: { caseId: id } });
    const steps = await prisma.simulationStep.findMany({ where: { caseId: id }, select: { id: true } });
    await prisma.simulationOption.deleteMany({ where: { stepId: { in: steps.map(s => s.id) } } });
    await prisma.simulationStep.deleteMany({ where: { caseId: id } });
    await prisma.case.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Keysni o'chirishda xato" });
  }
});

// --- ME: change password (real) ---
app.put('/api/me/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Joriy parol xato' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.userId }, data: { password: hashed } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Parolni o'zgartirishda xato" });
  }
});

// --- ME: personal results history + real rank (for Profile page) ---
app.get('/api/user/results', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { results: { include: { case: { select: { title: true } } }, orderBy: { createdAt: 'desc' } } }
    });
    if (!user) return res.status(404).json({ error: 'User topilmadi' });

    const students = await prisma.user.findMany({ where: { role: 'student' }, select: { id: true, points: true }, orderBy: { points: 'desc' } });
    const rank = students.findIndex(s => s.id === user.id) + 1;

    const scores = user.results.map(r => r.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const certificates = user.results.filter(r => r.score >= 80).slice(0, 10).map(r => ({
      title: r.case.title, score: r.score, date: r.createdAt
    }));

    res.json({
      memberSince: user.createdAt,
      points: user.points,
      casesDone: user.casesDone,
      ethicsScore: user.ethicsScore,
      ethicsDone: user.ethicsDone,
      avgScore,
      rank: rank > 0 ? rank : students.length,
      totalStudents: students.length,
      certificates,
      results: user.results.slice(0, 25).map(r => ({
        title: r.case.title, score: r.score, duration: r.duration, date: r.createdAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Natijalar tarixini yuklashda xato' });
  }
});

// --- ADMIN: real backups (copy of SQLite DB) ---
const BACKUP_DIR = path.join(__dirname, 'backups');
app.post('/api/admin/backup', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const file = `backup-${stamp}.db`;
    fs.copyFileSync(path.join(__dirname, 'prisma', 'dev.db'), path.join(BACKUP_DIR, file));
    const st = fs.statSync(path.join(BACKUP_DIR, file));
    res.json({ success: true, file, sizeMB: +(st.size / (1024 * 1024)).toFixed(1) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Zaxira nusxa yaratishda xato' });
  }
});

app.get('/api/admin/backups', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return res.json([]);
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.db'));
    const list = files.map(f => {
      const st = fs.statSync(path.join(BACKUP_DIR, f));
      return { file: f, sizeMB: +(st.size / (1024 * 1024)).toFixed(1), createdAt: st.mtime };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Zaxiralar ro\'yxatini olishda xato' });
  }
});

const PORT_FINAL = process.env.PORT || 3000;
app.listen(PORT_FINAL, () => {
  console.log(`🚀 Backend is running on port ${PORT_FINAL}`);
});
