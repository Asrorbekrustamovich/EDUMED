// Xabarnomalar — real (backenddan keladi), "hammasini o'qish" ishlaydi
export function renderNotifications(state, icons) {
  const notifs = state.notifications || [];
  const unreadCount = notifs.filter(n => n.unread).length;

  return `
    <div class="page-header animate-in">
      <div class="flex items-center gap-3">
        <h1 style="font-size:1.4rem">Xabarnomalar</h1>
        <span class="badge ${unreadCount > 0 ? 'badge-primary' : 'badge-gray'}" id="notif-badge-header">${unreadCount} ta yangi</span>
      </div>
      <div class="page-header-actions">
        ${unreadCount > 0 ? `<a href="#" class="text-sm text-primary font-semibold" onclick="event.preventDefault(); window.markAllNotificationsRead();">Hammasini O'qilgan Deb Belgilash</a>` : ''}
      </div>
    </div>

    <div class="page-body" style="max-width: 800px; margin: 0 auto;">

      <div class="flex-col gap-3 animate-in animate-delay-2" style="display:flex; flex-direction:column; gap:12px;">
        ${notifs.length === 0 ? `
          <div style="text-align:center; padding:40px; color:var(--text-secondary);">
            Xabarnomalar mavjud emas.
          </div>
        ` : notifs.map(n => `
          <div class="notification-card ${n.unread ? 'unread' : ''} p-4 card card-flat shadow-sm" style="display:flex; gap:16px; align-items:center; ${n.unread ? '' : 'opacity:0.8;'}">
            <div class="notification-icon text-xl" style="width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center; flex-shrink:0; background:var(--primary-light); color:var(--primary);">
              ${n.icon}
            </div>
            <div class="notification-body flex-1" style="display:flex; flex-direction:column; gap:4px; width:100%;">
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:12px;">
                <div class="notification-title font-bold text-base" style="color:var(--text);">${n.title}</div>
                <div class="notification-time text-xs" style="color:var(--text-muted); flex-shrink:0;">${n.time}</div>
              </div>
              <div class="notification-desc text-sm text-secondary" style="color:var(--text-secondary); line-height:1.5;">${n.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
