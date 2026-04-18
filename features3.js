/* ═══════════════════════════════════════════════════
   features3.js — Profil, Badjlər, Timetable, Analitika
═══════════════════════════════════════════════════ */

/* ════════════════════════════════════════
   👤 PROFİL & AYARLAR
════════════════════════════════════════ */
function showProfile() {
  const cu = getCurUser();
  if (!cu) return;
  
  const users = getUsers();
  const userHist = users[cu.username]?.history || [];
  
  // Statistika hesabla
  const totalExams = userHist.length;
  const avgScore = totalExams > 0 
    ? Math.round(userHist.reduce((sum, h) => sum + (h.bal700 || 0), 0) / totalExams)
    : 0;
  const bestScore = totalExams > 0 
    ? Math.max(...userHist.map(h => h.bal700 || 0))
    : 0;
  
  const modal = el('modal-profile');
  if (!modal) return;
  
  modal.style.display = 'flex';
  const content = el('profile-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar" style="background:linear-gradient(135deg, #4F8EF7, #7B5CF5)">
        ${cu.name.charAt(0).toUpperCase()}
      </div>
      <div class="profile-info">
        <h2>${cu.name}</h2>
        <p style="color:var(--txt2);font-size:14px;margin-top:4px">
          ${cu.grade}-ci sinif ${cu.role === 'teacher' ? '(Müəllim)' : ''}
        </p>
      </div>
    </div>
    
    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-val">${totalExams}</div>
        <div class="stat-label">Keçilən sınaq</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">${avgScore}</div>
        <div class="stat-label">Orta bal</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">${bestScore}</div>
        <div class="stat-label">Ən yaxşı bal</div>
      </div>
    </div>
    
    <div class="profile-section">
      <h3 style="margin-bottom:1rem;font-size:14px;font-weight:600;text-transform:uppercase;color:var(--txt2)">Ayarlar</h3>
      <div class="settings-item">
        <div>
          <div style="font-weight:500;margin-bottom:4px">Şifəni dəyiş</div>
          <input type="password" id="new-password" placeholder="Yeni şifrə" style="width:100%;padding:8px;border:1px solid var(--bd);border-radius:8px;background:var(--surface);color:var(--txt);font-family:inherit;margin-top:6px">
        </div>
        <button class="btn small" onclick="updatePassword()" style="align-self:flex-end;margin-top:6px">Yenilə</button>
      </div>
      <div class="settings-item" style="margin-top:1rem">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="notify-checkbox" ${localStorage.getItem('az_notify') !== 'false' ? 'checked' : ''} onchange="toggleNotifications()">
          <span>Bildirişləri aç</span>
        </label>
      </div>
    </div>
    
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1.5rem">
      <button class="btn" onclick="closeProfile()">Bağla</button>
    </div>
  `;
}

function updatePassword() {
  const cu = getCurUser();
  if (!cu) return;
  const newPass = el('new-password')?.value;
  if (!newPass || newPass.length < 4) {
    alert('Şifrə ən az 4 simvol olmalıdır');
    return;
  }
  const users = getUsers();
  users[cu.username].pass = newPass;
  saveUsers(users);
  alert('✓ Şifrə uğurla dəyişildi');
  el('new-password').value = '';
}

function toggleNotifications() {
  const state = el('notify-checkbox')?.checked;
  localStorage.setItem('az_notify', state ? 'true' : 'false');
}

function closeProfile() {
  const modal = el('modal-profile');
  if (modal) modal.style.display = 'none';
}

/* ════════════════════════════════════════
   🏅 BADJLAR (ACHIEVEMENTS)
════════════════════════════════════════ */
const BADGES = {
  'first_exam': { name:'🎯 İlk Adım', desc:'İlk sınaqlı bitirmə' },
  'ten_exams': { name:'📚 Tələbə', desc:'10 sınaq bitirmə' },
  'hundred_bal': { name:'⭐ Mükəmməl', desc:'700 bal almaq' },
  'streak_3': { name:'🔥 3 Gün Ardıcıl', desc:'3 gün ardıcıl sınaq' },
  'streak_7': { name:'🌟 7 Gün Ardıcıl', desc:'7 gün ardıcıl sınaq' },
  'perfect_day': { name:'💯 Mükəmməl Gün', desc:'Bir gündə 5+ sınaqlı 600+ balda bitirmə' },
  'helper': { name:'👥 Köməkçi', desc:'Forum-da 10+ cavab vermə' },
  'speedrun': { name:'⚡ Sürət Ustası', desc:'Sual üçün ortalaması 30 san' },
};

function getUserBadges() {
  const cu = getCurUser();
  if (!cu) return [];
  
  const users = getUsers();
  const user = users[cu.username];
  const hist = user?.history || [];
  
  const badges = [];
  
  // İlk sınaq
  if (hist.length >= 1) badges.push('first_exam');
  
  // 10 sınaq
  if (hist.length >= 10) badges.push('ten_exams');
  
  // 700 bal
  if (hist.some(h => h.bal700 >= 700)) badges.push('hundred_bal');
  
  // Streak hesabla
  const today = new Date().toLocaleDateString('az-AZ');
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toLocaleDateString('az-AZ');
    if (hist.some(h => h.date === dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  if (streak >= 3) badges.push('streak_3');
  if (streak >= 7) badges.push('streak_7');
  
  return [...new Set(badges)];
}

function showBadges() {
  const badges = getUserBadges();
  const modal = el('modal-badges');
  if (!modal) return;
  
  modal.style.display = 'flex';
  const content = el('badges-content');
  if (!content) return;
  
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">';
  
  Object.entries(BADGES).forEach(([key, badge]) => {
    const earned = badges.includes(key);
    html += `
      <div class="badge-card ${earned ? 'earned' : 'locked'}">
        <div class="badge-icon">${earned ? badge.name.split(' ')[0] : '🔒'}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        <div class="badge-status">${earned ? '✓ Əldə edildi' : 'Kilidi açılmadı'}</div>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

function closeBadges() {
  const modal = el('modal-badges');
  if (modal) modal.style.display = 'none';
}

/* ════════════════════════════════════════
   📅 CEDVƏL / TAKVİM (TIMETABLE)
════════════════════════════════════════ */
function showTimetable() {
  const modal = el('modal-timetable');
  if (!modal) return;
  
  modal.style.display = 'flex';
  const content = el('timetable-content');
  if (!content) return;
  
  const cu = getCurUser();
  const users = getUsers();
  const hist = users[cu?.username]?.history || [];
  
  // Son 30 günü göstər
  const cal = document.createElement('div');
  cal.className = 'timetable-calendar';
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','İyun','İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'];
  const dayNames = ['B', 'Bz', 'Ç', 'PA', 'C', 'Ş', 'B'];
  
  let html = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
  html += '<div class="calendar-days">';
  
  dayNames.forEach(d => html += `<div class="calendar-dayname">${d}</div>`);
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let i = 0; i < firstDay; i++) html += '<div class="calendar-empty"></div>';
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toLocaleDateString('az-AZ');
    const examsOnDay = hist.filter(h => h.date === dateStr).length;
    const isToday = dateStr === new Date().toLocaleDateString('az-AZ');
    
    html += `<div class="calendar-day ${isToday ? 'today' : ''} ${examsOnDay > 0 ? 'has-exam' : ''}">
      <div class="cal-date">${day}</div>
      ${examsOnDay > 0 ? `<div class="cal-count">${examsOnDay}</div>` : ''}
    </div>`;
  }
  
  html += '</div>';
  cal.innerHTML = html;
  
  content.innerHTML = `
    ${cal.outerHTML}
    <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--bd)">
      <h3 style="font-size:14px;margin-bottom:1rem;font-weight:600;text-transform:uppercase;color:var(--txt2)">Son Sınaqlar</h3>
      <div id="recent-exams" style="max-height:200px;overflow-y:auto"></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1.5rem">
      <button class="btn" onclick="closeTimetable()">Bağla</button>
    </div>
  `;
  
  // Son sınaqları göstər
  const recentHtml = hist.slice(-10).reverse().map(h => `
    <div style="padding:8px;background:var(--surface);border-radius:8px;font-size:13px;margin-bottom:8px;display:flex;justify-content:space-between">
      <span>${h.date}</span>
      <strong style="color:var(--green)">${h.bal700}/700 (${h.percent}%)</strong>
    </div>
  `).join('');
  
  content.innerHTML += recentHtml;
}

function closeTimetable() {
  const modal = el('modal-timetable');
  if (modal) modal.style.display = 'none';
}

/* ════════════════════════════════════════
   📊 ZƏIF MÖVZULAR ANALIZI
════════════════════════════════════════ */
function showAnalytics() {
  const cu = getCurUser();
  if (!cu) return;
  
  const users = getUsers();
  const hist = users[cu.username]?.history || [];
  
  if (!hist.length) {
    alert('Hələ analiz üçün yetərli sınaq yoxdur.');
    return;
  }
  
  const modal = el('modal-analytics');
  if (!modal) return;
  
  modal.style.display = 'flex';
  const content = el('analytics-content');
  if (!content) return;
  
  // Mövzu statistikasını toplayın
  const topicStats = {};
  hist.forEach(h => {
    if (h.topicBreakdown) {
      Object.entries(h.topicBreakdown).forEach(([topic, stats]) => {
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
        topicStats[topic].correct += stats.correct || 0;
        topicStats[topic].total += stats.total || 0;
      });
    }
  });
  
  // Məbləğ hesabla
  const analytics = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      percent: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      correct: stats.correct,
      total: stats.total,
    }))
    .sort((a, b) => a.percent - b.percent);
  
  let html = `
    <h2 style="margin-bottom:1.5rem;font-size:18px">📊 Performans Analizi</h2>
  `;
  
  // Weak topics (50%-dən aşağı)
  const weakTopics = analytics.filter(a => a.percent < 50);
  if (weakTopics.length > 0) {
    html += `
      <div style="margin-bottom:1.5rem">
        <h3 style="font-weight:600;margin-bottom:0.75rem;color:var(--red)">⚠️ Zəif Mövzular (< 50%)</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
    `;
    weakTopics.forEach(t => {
      html += `
        <div style="padding:12px;background:rgba(239,68,68,0.1);border-radius:8px;border-left:4px solid var(--red)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong>${t.topic}</strong>
            <span style="color:var(--red);font-weight:700">${t.percent}%</span>
          </div>
          <div class="progress-bar" style="width:100%;height:6px;background:var(--surface);border-radius:3px;overflow:hidden">
            <div style="width:${t.percent}%;height:100%;background:var(--red);transition:width 0.3s"></div>
          </div>
          <div style="font-size:12px;color:var(--txt2);margin-top:4px">${t.correct}/${t.total} doğru</div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  
  // Strong topics (80%+)
  const strongTopics = analytics.filter(a => a.percent >= 80);
  if (strongTopics.length > 0) {
    html += `
      <div style="margin-bottom:1.5rem">
        <h3 style="font-weight:600;margin-bottom:0.75rem;color:var(--green)">🌟 Güclü Mövzular (≥ 80%)</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
    `;
    strongTopics.forEach(t => {
      html += `
        <div style="padding:12px;background:rgba(34,197,94,0.1);border-radius:8px;border-left:4px solid var(--green)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong>${t.topic}</strong>
            <span style="color:var(--green);font-weight:700">${t.percent}%</span>
          </div>
          <div class="progress-bar" style="width:100%;height:6px;background:var(--surface);border-radius:3px;overflow:hidden">
            <div style="width:${t.percent}%;height:100%;background:var(--green);transition:width 0.3s"></div>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  
  // Ümumi statistika
  const totalCorrect = analytics.reduce((sum, a) => sum + a.correct, 0);
  const totalAsked = analytics.reduce((sum, a) => sum + a.total, 0);
  const avgPercent = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;
  
  html += `
    <div style="padding:1rem;background:var(--acc-bg);border-radius:8px;margin-top:1.5rem">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;text-align:center">
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--acc)">${avgPercent}%</div>
          <div style="font-size:12px;color:var(--txt2)">Ümumi Ortalama</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--acc)">${totalCorrect}/${totalAsked}</div>
          <div style="font-size:12px;color:var(--txt2)">Doğru/Toplam</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--acc)">${analytics.length}</div>
          <div style="font-size:12px;color:var(--txt2)">Mövzu Sayı</div>
        </div>
      </div>
    </div>
    
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1.5rem">
      <button class="btn" onclick="closeAnalytics()">Bağla</button>
    </div>
  `;
  
  content.innerHTML = html;
}

function closeAnalytics() {
  const modal = el('modal-analytics');
  if (modal) modal.style.display = 'none';
}
