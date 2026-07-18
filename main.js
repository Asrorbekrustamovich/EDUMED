// EduMed Deontolog — Main Application Router & Shell
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
window.API = API;

// Import all page modules
import { renderLanding } from './pages/landing.js';
import { renderLogin, renderRegister, renderForgotPassword, renderOTP } from './pages/auth.js';
import { renderStudentDashboard } from './pages/studentDashboard.js';
import { renderSimulator } from './pages/simulator.js';
import { renderLaboratory } from './pages/laboratory.js';
import { renderEthicsTest } from './pages/ethicsTest.js';
import { renderResults } from './pages/results.js';
import { renderProfile } from './pages/profile.js';
import { renderTeacherDashboard } from './pages/teacherDashboard.js';
import { renderStudentDetails } from './pages/studentDetails.js';
import { renderScenarioBuilder } from './pages/scenarioBuilder.js';
import { renderContentManagement } from './pages/contentManagement.js';
import { renderVolunteer } from './pages/volunteer.js';
import { renderMonitoring } from './pages/monitoring.js';
import { renderAdminDashboard } from './pages/adminDashboard.js';
import { renderNotifications } from './pages/notifications.js';
import { renderSettings } from './pages/settings.js';

// SVG Icons
export const icons = {
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  simulation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  lab: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7.5L19.5 21h-15L9 10.5z"/><path d="M9 3h6"/></svg>`,
  ethics: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  results: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  profile: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  volunteer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  students: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  builder: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
  content: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  monitoring: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  admin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  arrowUp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  arrowDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
  logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  export: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  calendar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  trophy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

// Global Toast Notification System
window.showToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  
  let icon = 'ℹ️';
  let bgColor = 'var(--primary)';
  
  if (type === 'success' || message.toLowerCase().includes('muvaffaqiyat')) {
    icon = '✅';
    bgColor = 'var(--green)';
  } else if (type === 'error' || message.toLowerCase().includes('xato')) {
    icon = '❌';
    bgColor = 'var(--danger)';
  } else if (type === 'warning') {
    icon = '⚠️';
    bgColor = '#f59e0b';
  }

  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <div style="font-size:1.3rem;">${icon}</div>
      <div style="font-size:0.95rem; font-weight:500; letter-spacing:0.3px;">${message}</div>
    </div>
  `;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: bgColor,
    color: 'white',
    padding: '14px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
    zIndex: '9999',
    transform: 'translateY(100px) scale(0.9)',
    opacity: '0',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // bouncier transition
  });

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(0) scale(1)';
    toast.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(20px) scale(0.9)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// Override standard alert to use our beautiful toast
window.alert = function(msg) {
  window.showToast(msg);
};

// Toggle password visibility
window.togglePassword = function(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (!input || !eye) return;

  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  // Eye open (visible) icon
  const eyeOpen = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  // Eye closed (hidden) icon
  const eyeClosed = `<line x1="1" y1="1" x2="23" y2="23"/><path d="M10.58 10.58A3 3 0 0 0 14.41 14.41M9.88 9.88a3 3 0 0 1 4.23 4.23"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61"/>`;

  eye.innerHTML = isHidden ? eyeClosed : eyeOpen;
};

// App State
const state = {
  currentPage: 'landing',
  currentRole: 'student', // 'student' | 'teacher' | 'admin'
  user: null,
  appliedVolunteers: [],
  volunteerTimeline: [],
  adminActiveTab: 'system',
  showAddVolunteerModal: false,
  volunteerProjects: [
    {
      id: 'charity',
      avatar: '🏥',
      tag: 'Yangi',
      tagClass: 'badge-primary',
      title: 'Shifoxona Xayriya Tashrifi',
      description: 'Bemor bolalar kayfiyatini ko\'tarish va ularga psixologik yordam ko\'rsatish dasturi.',
      date: '20-Iyul, 2026 • 09:00 - 13:00',
      location: 'Shahar Bolalar Shifoxonasi №3',
      slotsMax: 20,
      slotsCurrent: 0,
      pointsReward: 500
    },
    {
      id: 'blood',
      avatar: '❤️',
      tag: 'Yangi',
      tagClass: 'badge-primary',
      title: 'Qon Topshirish Aksiyasi',
      description: '"Donor bo\'l - hayot qutqar!" shiori ostida markaziy qon quyish stansiyasida yordam.',
      date: '1-Avgust, 2026 • 08:00 - 15:00',
      location: 'Respublika Qon Markazi',
      slotsMax: 50,
      slotsCurrent: 0,
      pointsReward: 400
    },
    {
      id: 'education',
      avatar: '📚',
      tag: 'Yangi',
      tagClass: 'badge-primary',
      title: 'Maktablarda Tibbiy Ta\'lim',
      description: 'Maktab o\'quvchilariga birinchi yordam ko\'rsatish bo\'yicha amaliy mashg\'ulotlar o\'tish.',
      date: '25-Iyul, 2026 • 14:00 - 16:00',
      location: '15-umumiy o\'rta ta\'lim maktabi',
      slotsMax: 10,
      slotsCurrent: 0,
      pointsReward: 600
    }
  ],
  userStats: {
    completedCases: 15,
    totalCases: 20,
    ethicsScore: 88,
    clinicalScore: 92,
    weeklyHours: 12,
    weeklyData: [1.5, 2.3, 3.0, 1.8, 2.5, 3.2, 1.0],
    goals: [
      { text: 'Ertalabki viktorinani yakunlash', done: true },
      { text: 'Bemor muloqoti simulyatsiyasi', done: true },
      { text: "Tibbiy etika maqolasini o'qish", done: true },
      { text: 'Farmakologiya laboratoriyasi', done: false },
      { text: 'Kunlik refleksiya yozish', done: false }
    ],
    achievements: [
      { emoji: '🏆', title: 'Birinchi Keys', earned: true },
      { emoji: '🎯', title: '10 ta Simulyatsiya', earned: true },
      { emoji: '⭐', title: 'Etika Ustasi', earned: true },
      { emoji: '🔬', title: 'Lab Tadqiqotchi', earned: true },
      { emoji: '💡', title: 'Tez Fikrlovchi', earned: false },
      { emoji: '🏅', title: '100% Aniqlik', earned: false }
    ],
    timeline: [
      { title: 'Appenditsit keysini boshladi', time: 'Bugun, 10:30', color: 'var(--primary)' },
      { title: 'Etika testini yakunladi — 92%', time: 'Bugun, 09:15', color: 'var(--green)' },
      { title: 'Farmakologiya laboratoriyasi', time: 'Kecha, 16:40', color: 'var(--secondary)' },
      { title: 'Bemor muloqoti mashqi', time: 'Kecha, 14:20', color: 'var(--warning)' },
      { title: 'Yangi sertifikat olindi', time: '13-Iyul, 11:00', color: 'var(--green)' }
    ],
    radar: {
      diagnostics: 85,
      treatment: 88,
      communication: 92,
      ethics: 90,
      law: 80
    }
  }
};

// Router
const routes = {
  'landing': renderLanding,
  'login': renderLogin,
  'register': renderRegister,
  'forgot-password': renderForgotPassword,
  'otp': renderOTP,
  'dashboard': renderStudentDashboard,
  'simulator': renderSimulator,
  'laboratory': renderLaboratory,
  'ethics-test': renderEthicsTest,
  'results': renderResults,
  'profile': renderProfile,
  'teacher-dashboard': renderTeacherDashboard,
  'student-details': renderStudentDetails,
  'scenario-builder': renderScenarioBuilder,
  'content-management': renderContentManagement,
  'volunteer': renderVolunteer,
  'monitoring': renderMonitoring,
  'admin-dashboard': renderAdminDashboard,
  'notifications': renderNotifications,
  'settings': renderSettings,
};

// Pages that need app layout (sidebar)
const appPages = [
  'dashboard', 'simulator', 'laboratory', 'ethics-test', 'results', 'profile',
  'volunteer', 'notifications', 'settings',
  'teacher-dashboard', 'student-details', 'scenario-builder', 'content-management', 'monitoring',
  'admin-dashboard'
];

// Sidebar navigation items per role
function getNavItems(role) {
  const unreadCount = state.notifications ? state.notifications.filter(n => n.unread).length : 0;

  if (role === 'teacher') {
    return [
      { section: 'Asosiy' },
      { id: 'teacher-dashboard', icon: icons.home, label: 'Dashboard' },
      { id: 'student-details', icon: icons.students, label: 'Talabalar' },
      { section: 'Kontentlar' },
      { id: 'scenario-builder', icon: icons.builder, label: 'Ssenariy yaratish' },
      { id: 'content-management', icon: icons.content, label: 'Kontent boshqaruvi' },
      { section: 'Tahlillar' },
      { id: 'monitoring', icon: icons.monitoring, label: 'Monitoring' },
      { section: 'Tizim' },
      { id: 'notifications', icon: icons.bell, label: 'Xabarnomalar', badge: unreadCount },
      { id: 'settings', icon: icons.settings, label: 'Sozlamalar' },
    ];
  }
  if (role === 'admin') {
    return [
      { section: 'Boshqaruv' },
      { id: 'admin-dashboard', icon: icons.admin, label: 'Admin Panel' },
      { id: 'student-details', icon: icons.students, label: 'Foydalanuvchilar' },
      { section: 'Kontentlar' },
      { id: 'scenario-builder', icon: icons.builder, label: 'Ssenariy yaratish' },
      { id: 'content-management', icon: icons.content, label: 'Kontent' },
      { section: 'Tahlillar' },
      { id: 'monitoring', icon: icons.monitoring, label: 'Monitoring' },
      { section: 'Tizim' },
      { id: 'notifications', icon: icons.bell, label: 'Xabarnomalar', badge: unreadCount },
      { id: 'settings', icon: icons.settings, label: 'Sozlamalar' },
    ];
  }
  // Student
  return [
    { section: 'Asosiy' },
    { id: 'dashboard', icon: icons.home, label: 'Dashboard' },
    { id: 'simulator', icon: icons.simulation, label: 'Simulyatsiya' },
    { id: 'laboratory', icon: icons.lab, label: 'Laboratoriya' },
    { id: 'ethics-test', icon: icons.ethics, label: 'Etika Testlari' },
    { section: 'Natijalar' },
    { id: 'results', icon: icons.results, label: 'Natijalar' },
    { id: 'profile', icon: icons.profile, label: 'Profil' },
    { section: 'Boshqa' },
    { id: 'volunteer', icon: icons.volunteer, label: 'Volontyorlik' },
    { id: 'notifications', icon: icons.bell, label: 'Xabarnomalar', badge: unreadCount },
    { id: 'settings', icon: icons.settings, label: 'Sozlamalar' },
  ];
}

// Render sidebar
function renderSidebar() {
  const navItems = getNavItems(state.currentRole);
  const roleLabel = state.currentRole === 'teacher' ? "O'qituvchi" : state.currentRole === 'admin' ? 'Administrator' : 'Talaba';
  
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">🏥</div>
        <div>
          <div class="logo-text">EduMed</div>
          <div class="logo-sub">Deontolog</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${navItems.map(item => {
          if (item.section) return `<div class="nav-section-title">${item.section}</div>`;
          return `
            <button class="nav-item ${state.currentPage === item.id ? 'active' : ''}" onclick="window.navigate('${item.id}')">
              <span class="icon">${item.icon}</span>
              <span>${item.label}</span>
              ${item.badge ? `<span class="badge-count">${item.badge}</span>` : ''}
            </button>
          `;
        }).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="window.navigate('profile')">
          <div class="avatar">${state.user.initials}</div>
          <div class="info">
            <div class="name">${state.user.name}</div>
            <div class="role">${roleLabel}</div>
          </div>
        </div>
        <button class="nav-item" style="margin-top:8px" onclick="window.logout()">
          <span class="icon">${icons.logout}</span>
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  `;
}

// Navigate


window.logout = function() {
  localStorage.removeItem('edumed_token');
  state.user = null;
  state.currentPage = 'landing';
  render();
};

// Main render
function render() {
  const app = document.getElementById('app');
  let page = state.currentPage;

  // Guard for protected pages
  if (appPages.includes(page) && !state.user) {
    page = 'login';
    state.currentPage = 'login';
  }

  const renderFn = routes[page];

  if (!renderFn) {
    app.innerHTML = '<div style="padding:100px;text-align:center"><h1>404</h1><p>Sahifa topilmadi</p></div>';
    return;
  }

  if (appPages.includes(page)) {
    app.innerHTML = `
      <div class="app-layout">
        ${renderSidebar()}
        <main class="main-content">
          ${renderFn(state, icons)}
        </main>
      </div>
    `;
  } else {
    app.innerHTML = renderFn(state, icons);
  }

  // Trigger animations after render
  requestAnimationFrame(() => {
    document.querySelectorAll('.animate-in').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.04}s`;
    });
  });
}

// Make state available globally
window.app = state;
window.render = render;

window.fetchNotifications = async function() {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  try {
    const res = await fetch(`${API}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      state.notifications = await res.json();
    }
  } catch (err) {
    console.error('Error fetching notifications:', err);
  }
};

window.fetchUserStats = async function() {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  try {
    const res = await fetch(`${API}/api/user/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      state.userStats = await res.json();
    }
  } catch (err) {
    console.error('Error fetching user stats:', err);
  }
};

window.postSimulationResult = async function(score, duration, caseId) {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  try {
    const res = await fetch(`${API}/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ score, duration, caseId })
    });
    if (res.ok) {
      console.log('Simulation result posted successfully');
      await window.fetchUserStats();
    }
  } catch (err) {
    console.error('Error posting simulation result:', err);
  }
};

window.postEthicsResult = async function(score) {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  
  try {
    const res = await fetch(`${API}/api/ethics-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ score })
    });
    if (res.ok) {
      console.log('Ethics result posted successfully');
      await window.fetchUserStats();
    }
  } catch (err) {
    console.error('Error posting ethics result:', err);
  }
};

// Fetch user profile from Backend
window.loadUserProfile = async function() {
  const token = localStorage.getItem('edumed_token');
  if (!token) {
    render();
    return;
  }
  
  try {
    const res = await fetch(`${API}/api/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const userData = await res.json();
      state.user = {
        ...userData,
        initials: userData.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
      };
      state.currentRole = userData.role;
      await window.fetchUserStats();
      
      // Navigate to correct dashboard based on role
      if (state.currentPage === 'landing' || state.currentPage === 'login' || state.currentPage === 'register') {
        if (state.currentRole === 'teacher') state.currentPage = 'teacher-dashboard';
        else if (state.currentRole === 'admin') state.currentPage = 'admin-dashboard';
        else state.currentPage = 'dashboard';
      }
    } else {
      localStorage.removeItem('edumed_token');
    }
  } catch (err) {
    console.error("API xatosi:", err);
  }
  render();
};

// Auth Functions
window.handleLogin = async function() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  
  if(!username || !password) {
    errorEl.innerText = "Barcha maydonlarni to'ldiring";
    errorEl.style.display = "block";
    return;
  }
  
  btn.innerText = "Yuklanmoqda...";
  btn.disabled = true;
  errorEl.style.display = "none";
  
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Xato yuz berdi");
    }
    
    localStorage.setItem('edumed_token', data.token);
    await window.loadUserProfile();
  } catch(err) {
    errorEl.innerText = err.message;
    errorEl.style.display = "block";
    btn.innerText = "Tizimga Kirish";
    btn.disabled = false;
  }
};

window.selectedRegRole = 'student';
window.selectRegRole = function(role) {
  window.selectedRegRole = role;
  const studentEl = document.getElementById('role-student');
  const teacherEl = document.getElementById('role-teacher');
  if (studentEl) studentEl.classList.remove('active');
  if (teacherEl) teacherEl.classList.remove('active');
  const activeEl = document.getElementById('role-' + role);
  if (activeEl) activeEl.classList.add('active');
};

window.handleRegister = async function() {
  // reg-name is used as both display name and username (single field)
  const username = document.getElementById('reg-name').value.trim();
  const password = document.getElementById('reg-password').value;
  const terms = document.getElementById('reg-terms').checked;
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('reg-btn');
  
  if(!username || !password) {
    errorEl.innerText = "Barcha maydonlarni to'ldiring";
    errorEl.style.display = "block";
    return;
  }

  if (username.includes('@')) {
    errorEl.innerText = "Foydalanuvchi ismi @ belgisisiz bo'lishi kerak";
    errorEl.style.display = "block";
    return;
  }

  if(!terms) {
    errorEl.innerText = "Shartlarga rozi bo'lishingiz kerak";
    errorEl.style.display = "block";
    return;
  }
  
  btn.innerText = "Yuklanmoqda...";
  btn.disabled = true;
  errorEl.style.display = "none";
  
  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, username, password, role: window.selectedRegRole, university: 'TMA' })
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Xato yuz berdi");
    }
    
    localStorage.setItem('edumed_token', data.token);
    await window.loadUserProfile();
  } catch(err) {
    errorEl.innerText = err.message;
    errorEl.style.display = "block";
    btn.innerText = "Hisob Yaratish";
    btn.disabled = false;
  }
};

// Start app
window.loadUserProfile();

// Simulation and Ethics Test global handlers
window.selectChoice = function(index) {
  const step = state.currentSimulationStep;
  if (!step) return;

  const opt = step.options[index];

  // Log sub-optimal/incorrect choice
  const maxScoreDelta = Math.max(...step.options.map(o => o.scoreDelta));
  if (opt.scoreDelta < maxScoreDelta) {
    const correctOpt = step.options.find(o => o.scoreDelta === maxScoreDelta);
    const caseTitle = state.currentCase ? state.currentCase.title : "Simulyatsiya";
    const questionText = `${caseTitle} — ${step.systemMessage}`;
    window.logWrongAnswer(questionText, opt.text, correctOpt ? correctOpt.text : "Noma'lum", 'simulation');
  }

  if (!state.simulationHistory) state.simulationHistory = [];

  // Update history (scoreDelta saqlanadi — natijalar sahifasi uchun)
  state.simulationHistory.push({
    systemMessage: step.systemMessage,
    doctorChoice: opt.text,
    patientResponse: opt.patientResponse,
    emotionText: opt.emotionText,
    emotionClass: opt.emotionClass,
    vitalsHr: opt.vitalsHr,
    scoreDelta: opt.scoreDelta,
    at: Date.now()
  });

  // Calculate score (opt.scoreDelta)
  if (!state.currentScore) state.currentScore = 50; // base score
  state.currentScore += opt.scoreDelta;
  state.currentScore = Math.max(0, Math.min(100, state.currentScore));

  // Next step logic
  if (opt.nextStepId) {
    state.currentSimulationStep = state.currentCase.steps.find(s => s.id === opt.nextStepId);
  } else {
    // End of simulation — haqiqiy davomiylikni hisoblaymiz
    state.currentSimulationStep = null;
    const elapsedMs = state.simStartTime ? (Date.now() - state.simStartTime) : 0;
    const durationMin = Math.max(1, Math.round(elapsedMs / 60000));
    state.lastSimulation = {
      caseId: state.currentCase.id,
      title: state.currentCase.title,
      score: state.currentScore,
      duration: durationMin,
      durationSec: Math.max(5, Math.round(elapsedMs / 1000)),
      history: [...state.simulationHistory],
      finishedAt: Date.now()
    };
    window.postSimulationResult(state.currentScore || 50, durationMin, state.currentCase.id);
  }

  // Render to apply changes
  render();

  setTimeout(() => {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  }, 10);
};

window.app = state;

window.fetchEthicsQuestions = async function() {
  try {
    const res = await fetch(`${API}/api/ethics`);
    const data = await res.json();
    state.ethicsQuestions = data.map(q => ({
      ...q,
      options: JSON.parse(q.options),
      explanations: JSON.parse(q.explanations)
    }));
  } catch (err) {
    console.error('Error fetching ethics questions:', err);
  }
};

window.fetchCases = async function() {
  try {
    const res = await fetch(`${API}/api/cases`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching cases:', err);
    return [];
  }
};

window.fetchVolunteerProjects = async function() {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/volunteer/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      state.volunteerProjects = await res.json();
    }
  } catch (err) {
    console.error('Error fetching volunteer projects:', err);
  }
};

window.fetchVolunteerApplications = async function() {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/volunteer/my-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const apps = await res.json();
      state.appliedVolunteers = apps.map(a => a.projectId);
      state.volunteerTimeline = apps.map(a => ({
        title: a.project.title,
        meta: `${new Date(a.createdAt).toLocaleDateString('uz-UZ')} • +${a.project.pointsReward} ball • Arizangiz qabul qilindi`
      }));
    }
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
  }
};

window.fetchCaseDetails = async function(id) {
  try {
    const res = await fetch(`${API}/api/cases/${id}`);
    const data = await res.json();
    state.currentCase = data;
    state.currentSimulationStep = data.steps.find(s => s.stepOrder === 0);
    state.simulationHistory = [];
  } catch (err) {
    console.error('Error fetching case details:', err);
  }
};

// ===== Real ma'lumot fetcherlari (teacher/admin/content/profile) =====
// API is defined globally at the top of the file
function authHeaders() {
  const token = localStorage.getItem('edumed_token');
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

window.fetchTeacherOverview = async function() {
  try {
    const res = await fetch(`${API}/api/teacher/overview`, { headers: authHeaders() });
    if (res.ok) state.teacherData = await res.json();
  } catch (e) { console.error('teacher overview:', e); }
};

window.openStudent = async function(id) {
  try {
    const res = await fetch(`${API}/api/teacher/students/${id}`, { headers: authHeaders() });
    if (res.ok) {
      state.selectedStudent = await res.json();
      state.currentPage = 'student-details';
      render();
      window.scrollTo(0, 0);
    }
  } catch (e) { console.error('student details:', e); }
};

window.fetchAdminOverview = async function() {
  try {
    const res = await fetch(`${API}/api/admin/overview`, { headers: authHeaders() });
    if (res.ok) state.adminData = await res.json();
  } catch (e) { console.error('admin overview:', e); }
};

window.fetchContent = async function(page = 1, q = '', status = '') {
  try {
    const params = new URLSearchParams({ page, perPage: 9 });
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    const res = await fetch(`${API}/api/content?${params}`, { headers: authHeaders() });
    if (res.ok) {
      state.contentData = await res.json();
      state.contentQuery = q;
      state.contentStatus = status;
    }
  } catch (e) { console.error('content:', e); }
};

window.contentGoPage = async function(p) {
  await window.fetchContent(p, state.contentQuery || '', state.contentStatus || '');
  render();
};

window.contentSearch = async function() {
  const el = document.getElementById('content-search-input');
  await window.fetchContent(1, el ? el.value : '', state.contentStatus || '');
  render();
  setTimeout(() => {
    const inp = document.getElementById('content-search-input');
    if (inp) { inp.value = state.contentQuery || ''; inp.focus(); }
  }, 0);
};

window.contentFilter = async function(status) {
  await window.fetchContent(1, state.contentQuery || '', status);
  render();
};

window.toggleCaseActive = async function(id, makeActive) {
  try {
    const res = await fetch(`${API}/api/cases/${id}`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ isActive: makeActive })
    });
    if (res.ok) {
      window.showToast(makeActive ? 'Keys nashr qilindi!' : 'Keys qoralamaga o\'tkazildi', 'success');
      await window.fetchContent(state.contentData?.page || 1, state.contentQuery || '', state.contentStatus || '');
      render();
    }
  } catch (e) { window.showToast('Xato yuz berdi', 'error'); }
};

window.deleteCaseContent = async function(id) {
  if (!confirm("Haqiqatan ham bu keysni butunlay o'chirmoqchimisiz? Unga oid natijalar ham o'chadi.")) return;
  try {
    const res = await fetch(`${API}/api/cases/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) {
      window.showToast("Keys o'chirildi", 'success');
      await window.fetchContent(state.contentData?.page || 1, state.contentQuery || '', state.contentStatus || '');
      render();
    } else {
      window.showToast("Keysni o'chirib bo'lmadi", 'error');
    }
  } catch (e) { window.showToast('Tizim xatosi', 'error'); }
};

window.fetchProfileData = async function() {
  try {
    const res = await fetch(`${API}/api/user/results`, { headers: authHeaders() });
    if (res.ok) state.profileData = await res.json();
  } catch (e) { console.error('profile:', e); }
};

window.markAllNotificationsRead = function() {
  (state.notifications || []).forEach(n => n.unread = false);
  window.showToast("Barcha xabarnomalar o'qilgan deb belgilandi", 'success');
  render();
};

window.copyShareLink = function() {
  const link = window.location.origin + '/#natijalar';
  const done = () => window.showToast('Ulashish havolasi nusxalandi!', 'success');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(done).catch(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = link; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove(); done();
  }
};

// --- CSV eksport (real ma'lumotlardan) ---
function downloadCSV(filename, rows) {
  const csv = '﻿' + rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  window.showToast(`${filename} yuklab olindi`, 'success');
}

window.exportStudentsCSV = async function() {
  if (!state.teacherData) await window.fetchTeacherOverview();
  const students = state.teacherData ? state.teacherData.students : [];
  const rows = [['F.I.Sh', 'Email', 'Keyslar', 'Kognitiv %', 'Aksiologik %', 'Ball', 'Holat']];
  students.forEach(s => rows.push([s.name, s.email, s.casesDone, s.cognitive, s.axiological, s.points, s.status]));
  downloadCSV('Talabalar_natijalari.csv', rows);
};

window.exportActivityCSV = function() {
  const act = state.adminData ? state.adminData.activity : [];
  const rows = [['Foydalanuvchi', 'Harakat', 'Vaqt']];
  act.forEach(a => rows.push([a.user, a.action, new Date(a.time).toLocaleString('uz-UZ')]));
  downloadCSV('Faollik_jurnali.csv', rows);
};

window.exportMonitoringCSV = function() {
  const d = state.adminData;
  if (!d) { window.showToast("Ma'lumot hali yuklanmadi", 'warning'); return; }
  const rows = [
    ['Ko\'rsatkich', 'Qiymat'],
    ['Jami foydalanuvchilar', d.counts.users],
    ['Talabalar', d.counts.students],
    ["O'qituvchilar", d.counts.teachers],
    ['Adminlar', d.counts.admins],
    ['Faol keyslar', d.counts.cases],
    ['Test savollari', d.counts.ethicsQuestions],
    ['Jami natijalar', d.counts.resultsTotal],
    ['Bugungi sessiyalar', d.counts.resultsToday],
    ["O'rtacha sessiya (min)", d.avgSession],
    ["O'rtacha muvaffaqiyat (%)", d.avgSuccess],
    ['Baza hajmi (MB)', d.dbSizeMB]
  ];
  downloadCSV('Monitoring_hisoboti.csv', rows);
};

// --- Parolni o'zgartirish (real) ---
window.togglePasswordModal = function(show) {
  state.showPasswordModal = show;
  render();
};

window.submitPasswordChange = async function(e) {
  if (e) e.preventDefault();
  const oldP = document.getElementById('pw-old').value;
  const newP = document.getElementById('pw-new').value;
  const newP2 = document.getElementById('pw-new2').value;
  if (newP !== newP2) { window.showToast('Yangi parollar mos kelmadi', 'error'); return; }
  try {
    const res = await fetch(`${API}/api/me/password`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ oldPassword: oldP, newPassword: newP })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xato');
    state.showPasswordModal = false;
    window.showToast("Parol muvaffaqiyatli o'zgartirildi!", 'success');
    render();
  } catch (err) {
    window.showToast(err.message, 'error');
  }
};

// --- Lokal sozlamalarni saqlash ---
window.savePrefs = function() {
  const g = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };
  localStorage.setItem('edumed_prefs', JSON.stringify({
    email: g('pref-email'), push: g('pref-push'), sms: g('pref-sms')
  }));
};

// --- Zaxira nusxalar (real fayllar) ---
window.fetchBackups = async function() {
  try {
    const res = await fetch(`${API}/api/admin/backups`, { headers: authHeaders() });
    if (res.ok) state.backups = await res.json();
  } catch (e) { console.error('backups:', e); }
};

window.createBackup = async function() {
  try {
    const res = await fetch(`${API}/api/admin/backup`, { method: 'POST', headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xato');
    window.showToast(`Zaxira nusxa yaratildi: ${data.file} (${data.sizeMB} MB)`, 'success');
    await window.fetchBackups();
    render();
  } catch (err) { window.showToast(err.message, 'error'); }
};

// --- Ssenariy yaratish (Scenario Builder, real saqlash) ---
window.sbOptionCount = 3;
window.addScenarioOption = function() {
  window.sbOptionCount = Math.min(5, window.sbOptionCount + 1);
  const wrap = document.getElementById('sb-options-wrap');
  if (!wrap) return;
  const i = window.sbOptionCount - 1;
  const letter = String.fromCharCode(65 + i);
  const div = document.createElement('div');
  div.className = 'card card-flat p-3 mb-2 bg-surface';
  div.innerHTML = `
    <div class="text-xs font-semibold mb-1">${letter} Variant</div>
    <input type="text" class="input w-full text-sm mb-2 sb-opt-text" placeholder="Shifokor javobi matni...">
    <input type="text" class="input w-full text-sm mb-2 sb-opt-resp" placeholder="Bemorning reaksiyasi...">
    <div class="flex gap-2">
      <input type="number" class="input w-full text-sm sb-opt-score" value="0" placeholder="Ball">
    </div>`;
  wrap.appendChild(div);
};

window.saveScenario = async function(publish) {
  const title = (document.getElementById('sb-title') || {}).value || '';
  const category = (document.getElementById('sb-category') || {}).value || 'Umumiy';
  const difficulty = (document.getElementById('sb-difficulty') || {}).value || "O'rta";
  const description = (document.getElementById('sb-desc') || {}).value || '';
  const stepMsg = (document.getElementById('sb-step-msg') || {}).value || '';

  if (!title.trim() || !stepMsg.trim()) {
    window.showToast('Keys nomi va boshlang\'ich vaziyat matnini kiriting', 'warning');
    return;
  }

  const texts = [...document.querySelectorAll('.sb-opt-text')].map(el => el.value);
  const resps = [...document.querySelectorAll('.sb-opt-resp')].map(el => el.value);
  const scores = [...document.querySelectorAll('.sb-opt-score')].map(el => parseInt(el.value) || 0);
  const options = texts.map((t, i) => ({ text: t, patientResponse: resps[i], scoreDelta: scores[i] }))
    .filter(o => o.text && o.text.trim());

  if (options.length < 2) {
    window.showToast('Kamida 2 ta variant matnini kiriting', 'warning');
    return;
  }

  const steps = [
    { systemMessage: stepMsg, options },
    {
      systemMessage: "Ikkinchi bosqich. Endi tibbiy huquq va deontologiya doirasidagi keyingi to'g'ri qarorni qabul qiling.",
      options: [
        { text: "Bemorga barcha xavf-xatarlarni tushuntirib, yozma rozilik olamiz.", patientResponse: "Tushundim shifokor, rozilik varaqasiga qo'l qo'yaman.", scoreDelta: 15 },
        { text: "Rozilik olish shart emas, zudlik bilan aralashuvga kirishamiz.", patientResponse: "Nega mendan so'ramayapsizlar? Huquqim bormi o'zi?", scoreDelta: -10 },
        { text: "Qarorni bemorning yaqinlariga topshiramiz.", patientResponse: "Men voyaga yetganman-ku, o'zim qaror qabul qilaman!", scoreDelta: -5 }
      ]
    }
  ];

  try {
    const res = await fetch(`${API}/api/cases`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ title, description, difficulty, category, isActive: publish, steps })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xato');
    window.showToast(publish ? 'Keys nashr qilindi va talabalarga ochildi!' : 'Keys qoralama sifatida saqlandi', 'success');
    window.sbOptionCount = 3;
    window.navigate(state.currentRole === 'admin' ? 'content-management' : 'teacher-dashboard');
  } catch (err) {
    window.showToast(err.message, 'error');
  }
};

window.previewScenario = function() {
  const title = (document.getElementById('sb-title') || {}).value || 'Nomsiz keys';
  const stepMsg = (document.getElementById('sb-step-msg') || {}).value || '';
  const texts = [...document.querySelectorAll('.sb-opt-text')].map(el => el.value).filter(Boolean);
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(4px);';
  overlay.onclick = (ev) => { if (ev.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="card" style="width:560px;max-width:92%;max-height:80vh;overflow:auto;padding:28px;">
      <div class="flex-between mb-4">
        <h3 class="card-title">👁 Oldindan ko'rish</h3>
        <button class="btn-icon" onclick="this.closest('div[style*=fixed]')?.remove() || this.parentElement.parentElement.parentElement.remove()">❌</button>
      </div>
      <h2 style="font-size:1.1rem;margin-bottom:10px;">${title}</h2>
      <div class="chat-bubble system" style="margin-bottom:14px;">${stepMsg || '(Vaziyat matni kiritilmagan)'}</div>
      ${texts.map((t, i) => `
        <div class="choice-card" style="padding:10px 14px;margin-bottom:8px;border:1px solid var(--border);border-radius:10px;">
          <div style="font-size:0.65rem;font-weight:700;color:var(--primary);">Variant ${String.fromCharCode(65 + i)}</div>
          <div style="font-size:0.85rem;">${t}</div>
        </div>`).join('') || '<p class="text-sm text-secondary">Variantlar kiritilmagan</p>'}
    </div>`;
  document.body.appendChild(overlay);
};

// --- Simulyatsiya taymeri (real) ---
setInterval(() => {
  const el = document.getElementById('sim-timer');
  if (el && state.simStartTime && state.currentCase) {
    const s = Math.floor((Date.now() - state.simStartTime) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.textContent = `⏱️ ${mm}:${ss}`;
  }
}, 1000);

window.navigate = async function(page) {
  state.currentPage = page;

  if (page === 'ethics-test') {
    if (!state.ethicsQuestions || state.ethicsQuestions.length === 0) {
      await window.fetchEthicsQuestions();
    }
    if (!state.ethicsSession || state.ethicsSession.current >= state.ethicsSession.total && state.ethicsSession.completed) {
      state.ethicsSession = { total: 5, current: 1, correct: 0, completed: false };
    }
    if (state.ethicsQuestions && state.ethicsQuestions.length > 0) {
      state.currentEthicsQuestion = state.ethicsQuestions[Math.floor(Math.random() * state.ethicsQuestions.length)];
    }
  } else if (page === 'simulator') {
    state.cases = await window.fetchCases();
  } else if (page === 'dashboard') {
    state.currentCase = null;
    state.currentSimulationStep = null;
    state.currentScore = 50;
    state.simulationHistory = [];
    state.cases = await window.fetchCases();
    await window.fetchNotifications();
    await window.fetchUserStats();
  } else if (page === 'notifications') {
    await window.fetchNotifications();
  } else if (page === 'volunteer') {
    await window.fetchVolunteerProjects();
    await window.fetchVolunteerApplications();
  } else if (page === 'admin-dashboard') {
    await window.fetchVolunteerProjects();
    await window.fetchVolunteerApplications();
    await window.fetchAdminOverview();
    await window.fetchBackups();
  } else if (page === 'teacher-dashboard') {
    await window.fetchTeacherOverview();
  } else if (page === 'monitoring') {
    await window.fetchAdminOverview();
  } else if (page === 'content-management') {
    await window.fetchAdminOverview();
    await window.fetchContent(1, '', '');
  } else if (page === 'profile') {
    await window.fetchUserStats();
    await window.fetchProfileData();
  } else if (page === 'results') {
    if (!state.userStats) await window.fetchUserStats();
  } else if (page === 'student-details' && !state.selectedStudent) {
    page = 'teacher-dashboard';
    state.currentPage = page;
    await window.fetchTeacherOverview();
  }

  render();
  window.scrollTo(0, 0);
};

window.startCase = async function(id) {
  await window.fetchCaseDetails(id);
  state.simStartTime = Date.now();
  state.currentScore = 50;
  state.currentPage = 'simulator'; // qaysi sahifadan bosilmasin, simulyatorga o'tadi
  render();
  window.scrollTo(0, 0);
};

window.filterSimulatorCases = function() {
  const queryEl = document.getElementById('case-search-input');
  if (!queryEl) return;
  const query = queryEl.value.toLowerCase();
  const cards = document.querySelectorAll('.case-selection-card');
  cards.forEach(card => {
    const title = card.getAttribute('data-title') || '';
    const category = card.getAttribute('data-category') || '';
    if (title.includes(query) || category.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
};

window.selectAnswer = function(n) {
  if (!state.currentEthicsQuestion) return;
  const q = state.currentEthicsQuestion;
  const correctAnswer = q.correctAnswer;
  const cards = document.querySelectorAll('.ethics-choice');
  const feedbackEl = document.getElementById('ethics-feedback');
  
  if (!feedbackEl || feedbackEl.style.display === 'block') return;

  cards.forEach((card, i) => {
    card.style.pointerEvents = 'none';
    if (i === n && n === correctAnswer) {
      card.classList.add('correct');
      card.style.borderColor = 'var(--green)';
      card.style.background = 'var(--green-light)';
    } else if (i === n && n !== correctAnswer) {
      card.classList.add('incorrect');
      card.style.borderColor = 'var(--danger)';
      card.style.background = 'var(--danger-light)';
      
      cards[correctAnswer].classList.add('correct');
      cards[correctAnswer].style.borderColor = 'var(--green)';
      cards[correctAnswer].style.background = 'var(--green-light)';
      
      window.logWrongAnswer(q.question, q.options[n], q.options[correctAnswer], 'ethics');
    } else if (i === correctAnswer && n !== correctAnswer) {
      // handled above
    } else {
      card.style.opacity = '0.5';
    }
  });

  feedbackEl.style.display = 'block';
  feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const isLast = state.ethicsSession && state.ethicsSession.current >= state.ethicsSession.total;
  const nextBtnText = isLast ? "Testni yakunlash" : "Keyingi savol →";

  if (n === correctAnswer) {
    if (state.ethicsSession) state.ethicsSession.correct++;
    feedbackEl.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--green-light);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">✅</div>
        <div style="flex:1;">
          <div style="font-size:0.933rem;font-weight:700;color:var(--green-dark);margin-bottom:6px;">To'g'ri javob!</div>
          <div style="font-size:0.867rem;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
            ${q.explanationCorrect}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-success">+1 to'g'ri javob</span>
            <span class="badge badge-primary">${state.ethicsSession ? `Savol ${state.ethicsSession.current}/${state.ethicsSession.total}` : 'Etika testi'}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn btn-outline" onclick="window.navigate('results')">Natijalarni ko'rish</button>
        <button class="btn btn-primary" onclick="window.nextEthicsQuestion()">${nextBtnText}</button>
      </div>
    `;
    feedbackEl.style.borderColor = 'var(--green)';
    feedbackEl.style.background = 'var(--green-light)';
  } else {
    feedbackEl.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--danger-light);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">❌</div>
        <div style="flex:1;">
          <div style="font-size:0.933rem;font-weight:700;color:var(--danger);margin-bottom:6px;">Noto'g'ri javob</div>
          <div style="font-size:0.867rem;color:var(--text-secondary);line-height:1.7;margin-bottom:8px;">
            ${q.explanations[n]}
          </div>
          <div style="font-size:0.867rem;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
            <strong>To'g'ri javob — ${(String.fromCharCode(65 + correctAnswer))}:</strong> ${q.explanationCorrect}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-danger">0 ball</span>
            <span class="badge badge-primary">${state.ethicsSession ? `Savol ${state.ethicsSession.current}/${state.ethicsSession.total}` : 'Etika testi'}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn btn-outline" onclick="window.navigate('results')">Natijalarni ko'rish</button>
        <button class="btn btn-primary" onclick="window.nextEthicsQuestion()">${nextBtnText}</button>
      </div>
    `;
    feedbackEl.style.borderColor = 'var(--danger)';
    feedbackEl.style.background = 'var(--danger-light)';
  }
};

window.nextEthicsQuestion = function() {
  if (state.ethicsSession) {
    if (state.ethicsSession.current >= state.ethicsSession.total) {
      state.ethicsSession.completed = true;
      state.ethicsSession.finishedAt = Date.now();
      const pct = Math.round((state.ethicsSession.correct / state.ethicsSession.total) * 100);
      window.postEthicsResult(pct);
      window.navigate('results');
      return;
    }
    state.ethicsSession.current++;
  }
  if (state.ethicsQuestions && state.ethicsQuestions.length > 0) {
    state.currentEthicsQuestion = state.ethicsQuestions[Math.floor(Math.random() * state.ethicsQuestions.length)];
    render();
    window.scrollTo(0, 0);
  }
};

window.saveSettings = async function() {
  const nameEl = document.getElementById('setting-name');
  const emailEl = document.getElementById('setting-email');
  const uniEl = document.getElementById('setting-university');
  
  if (!nameEl || !emailEl || !uniEl) return;
  
  const name = nameEl.value;
  const email = emailEl.value;
  const university = uniEl.value;
  
  const token = localStorage.getItem('edumed_token');
  if (!token) {
    alert("Avtorizatsiya yo'q!");
    return;
  }
  
  try {
    const res = await fetch(`${API}/api/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ name, email, university })
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Saqlashda xatolik');
    }
    
    const updatedUser = await res.json();
    state.user = { ...state.user, ...updatedUser };
    
    if (updatedUser.name) {
      state.user.initials = updatedUser.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
    
    alert('Sozlamalar muvaffaqiyatli saqlandi!');
    window.navigate('dashboard');
  } catch(err) {
    alert(err.message);
  }
};

window.downloadPDF = function(filename) {
  if (typeof html2pdf === 'undefined') {
    alert("PDF kutubxonasi yuklanmoqda, iltimos qayta urinib ko'ring.");
    return;
  }
  const element = document.querySelector('.page-body');
  if (!element) return;
  
  const opt = {
    margin:       0.2,
    filename:     filename || 'EduMed_Result.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};

window.filterLab = function(category, element) {
  document.querySelectorAll('.lab-nav-item').forEach(el => el.classList.remove('active'));
  if(element) element.classList.add('active');
  
  const cards = document.querySelectorAll('.lab-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.downloadCertificate = function() {
  if (typeof html2pdf === 'undefined') {
    alert("PDF kutubxonasi yuklanmoqda, iltimos qayta urinib ko'ring.");
    return;
  }
  
  const certHtml = `
    <div id="print-cert" style="width: 1056px; height: 816px; padding: 40px; background: #ffffff; font-family: 'Inter', sans-serif; position: relative; border: 20px solid #2563EB; box-sizing: border-box;">
      <div style="border: 2px solid #E5E7EB; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; box-sizing: border-box;">
        <h1 style="font-size: 3.5rem; color: #2563EB; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 4px; font-weight: 800;">Sertifikat</h1>
        <p style="font-size: 1.5rem; color: #6B7280; margin-bottom: 40px; font-weight: 500;">Muvaffaqiyatli yakunlanganligi uchun beriladi</p>
        
        <h2 style="font-size: 3rem; color: #111827; margin-bottom: 30px; font-weight: 700; border-bottom: 2px solid #2563EB; padding-bottom: 10px; display: inline-block;">${state.user?.name || 'Hurmatli Foydalanuvchi'}</h2>
        
        <p style="font-size: 1.4rem; color: #4B5563; margin-bottom: 50px; max-width: 80%; line-height: 1.6;">
          Ushbu sertifikat egasi <b>EduMed Deontolog</b> tizimida klinik va axloqiy vaziyatlar bo'yicha tibbiy etika, deontologiya va bemor bilan muloqot qilish bo'yicha amaliy testlarni muvaffaqiyatli yakunlab, o'zining yuksak bilim va ko'nikmalarini namoyon etganligini tasdiqlaydi.
        </p>
        
        <div style="display: flex; justify-content: space-between; width: 100%; margin-top: auto; padding: 0 40px;">
          <div style="text-align: left;">
            <div style="font-size: 1.2rem; font-weight: 600; color: #111827; margin-bottom: 8px;">Sana:</div>
            <div style="font-size: 1.2rem; color: #4B5563;">${new Date().toLocaleDateString('uz-UZ')}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 4rem; line-height: 1;">🏥</div>
            <div style="font-weight: 800; color: #2563EB; font-size: 1.2rem; margin-top: 8px;">EduMed</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.2rem; font-weight: 600; color: #111827; margin-bottom: 8px;">Imzo:</div>
            <div style="font-size: 1.2rem; color: #4B5563; font-style: italic;">___________________</div>
            <div style="font-size: 1rem; color: #9CA3AF; margin-top: 4px;">Klinika Boshlig'i</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  // Fixed positioning and z-index behind everything so it renders properly without viewport crop
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-9999';
  container.style.background = '#fff';
  container.innerHTML = certHtml;
  document.body.appendChild(container);

  const opt = {
    margin:       0,
    filename:     'Sertifikat_EduMed.pdf',
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 1056, windowHeight: 816 },
    jsPDF:        { unit: 'px', format: [1056, 816], orientation: 'landscape' }
  };
  
  // A slight delay ensures styles and fonts are applied before canvas capture
  setTimeout(() => {
    html2pdf().set(opt).from(container.firstElementChild).save().then(() => {
      document.body.removeChild(container);
    });
  }, 100);
};

// Log incorrect student answers (ethics and simulation)
window.logWrongAnswer = async function(questionText, selectedOption, correctOption, type) {
  const token = localStorage.getItem('edumed_token');
  if (!token) return;

  try {
    await fetch(`${API}/api/wrong-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ questionText, selectedOption, correctOption, type })
    });
  } catch (err) {
    console.error("Error logging wrong answer:", err);
  }
};

// Send direct feedback/message from teacher to student
window.sendTeacherFeedback = async function(studentId) {
  const input = document.getElementById('feedback-message-input');
  if (!input) return;
  const message = input.value.trim();
  if (!message) {
    window.showToast("Xabar matnini kiriting", "warning");
    return;
  }

  const token = localStorage.getItem('edumed_token');
  if (!token) return;

  try {
    const res = await fetch(`${API}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ studentId, message })
    });

    if (res.ok) {
      window.showToast("Fikr-mulohaza talabaga muvaffaqiyatli yuborildi!", "success");
      input.value = '';
    } else {
      const data = await res.json();
      window.showToast(data.error || "Xato yuz berdi", "error");
    }
  } catch (err) {
    console.error(err);
    window.showToast("Tizim xatosi", "error");
  }
};
