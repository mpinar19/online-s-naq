/* ══════════════════════════════════════════
   features.js — Liderboard, Adaptiv, Müəllim
══════════════════════════════════════════ */

/* ── Müəllim qeydiyyatında sinif sahəsini gizlə ── */
function toggleGradeField() {
  const role = el('reg-role') ? el('reg-role').value : 'student';
  const gf   = el('grade-field');
  if (gf) gf.style.display = role === 'teacher' ? 'none' : '';
}

/* ══════════════════════════════════════════
   🏆 LİDERBOARD
══════════════════════════════════════════ */
function showLeaderboard() {
  el('modal-leaderboard').style.display = 'flex';
  renderLeaderboard('all');
}

function switchLbTab(tab) {
  document.querySelectorAll('.lb-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab)
  );
  renderLeaderboard(tab);
}

function renderLeaderboard(tab) {
  const cu     = getCurUser();
  const users  = getUsers();
  const now    = Date.now();
  const weekMs = 7 * 24 * 3600 * 1000;

  const entries = Object.entries(users)
    .filter(([, u]) => u.role !== 'teacher' && u.history && u.history.length)
    .map(([uname, u]) => {
      let hist = [...u.history];
      if (tab === 'grade' && cu) hist = hist.filter(() => u.grade === cu.grade);
      if (tab === 'week') {
        hist = hist.filter(h => {
          try {
            const p = h.date.split('.');
            return (now - new Date(+p[2], +p[1]-1, +p[0]).getTime()) < weekMs;
          } catch(e) { return false; }
        });
      }
      if (!hist.length) return null;
      const best = Math.max(...hist.map(h => h.bal700 || 0));
      return { uname, name: u.name, grade: u.grade, best, count: hist.length };
    })
    .filter(Boolean)
    .sort((a, b) => b.best - a.best)
    .slice(0, 20);

  const box = el('leaderboard-content');
  if (!entries.length) {
    box.innerHTML = '<p style="color:var(--txt2);font-size:14px;padding:1.5rem 0;text-align:center">Hələ nəticə yoxdur.</p>';
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  box.innerHTML = entries.map((e, i) => {
    const isMe = cu && e.uname === cu.username;
    return `<div class="lb-row${isMe ? ' lb-me' : ''}">
      <div class="lb-rank">${medals[i] || (i+1)}</div>
      <div class="lb-avatar">${e.name.charAt(0).toUpperCase()}</div>
      <div class="lb-info">
        <div class="lb-name">${e.name}${isMe ? ' <span class="lb-you">(siz)</span>' : ''}</div>
        <div class="lb-meta">${e.grade}-ci sinif · ${e.count} sınaq</div>
      </div>
      <div class="lb-score">
        <div class="lb-best">${e.best}</div>
        <div class="lb-label">ən yaxşı bal</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════
   🎯 ADAPTİV SINAQ
══════════════════════════════════════════ */
function showAdaptive() {
  const cu = getCurUser(); if (!cu) return;
  el('modal-adaptive').style.display = 'flex';

  const hist = getUsers()[cu.username]?.history || [];
  if (!hist.length) {
    el('adaptive-analysis').innerHTML =
      '<p style="text-align:center;color:var(--txt2);font-size:14px;padding:1.5rem 0">Əvvəlcə ən azı 1 sınaq keçirin ki, sistem analiz edə bilsin.</p>';
    return;
  }

  const ts = {};
  hist.forEach(h => {
    if (!h.topicBreakdown) return;
    Object.entries(h.topicBreakdown).forEach(([topic, s]) => {
      if (!ts[topic]) ts[topic] = { correct:0, total:0 };
      ts[topic].correct += s.correct;
      ts[topic].total   += s.total;
    });
  });

  const weak = Object.entries(ts)
    .filter(([, s]) => s.total >= 2)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct/s.total*100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  if (!weak.length) {
    el('adaptive-analysis').innerHTML =
      '<p style="text-align:center;color:var(--txt2);font-size:14px;padding:1.5rem 0">Daha çox sınaq keçirin ki, sistem analiz edə bilsin.</p>';
    return;
  }

  el('adaptive-analysis').innerHTML =
    '<div style="font-size:12px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.75rem">Zəif mövzular</div>' +
    weak.map(w => {
      const clr = w.pct < 40 ? 'var(--red)' : w.pct < 70 ? 'var(--amber)' : 'var(--green)';
      return `<div class="adaptive-row">
        <div class="adaptive-topic">${w.topic}</div>
        <div class="adaptive-bar-wrap"><div class="adaptive-bar" style="width:${w.pct}%;background:${clr}"></div></div>
        <div class="adaptive-pct" style="color:${clr}">${w.pct}%</div>
      </div>`;
    }).join('') +
    '<p style="font-size:12px;color:var(--txt3);margin-top:1rem;line-height:1.5">Sistem bu mövzulardan fokuslu sınaq hazırlayacaq.</p>';
}

function startAdaptiveQuiz() {
  const cu = getCurUser(); if (!cu) return;
  el('modal-adaptive').style.display = 'none';

  const hist      = getUsers()[cu.username]?.history || [];
  const gradeBank = getQBankForGrade(cu.grade);
  const ts = {};

  hist.forEach(h => {
    if (!h.topicBreakdown) return;
    Object.entries(h.topicBreakdown).forEach(([topic, s]) => {
      if (!ts[topic]) ts[topic] = { correct:0, total:0, subject: s.subject };
      ts[topic].correct += s.correct;
      ts[topic].total   += s.total;
    });
  });

  const weak = Object.entries(ts)
    .filter(([, s]) => s.total >= 1)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct/s.total*100), subject: s.subject }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);

  let pool = [];
  if (weak.length) {
    weak.forEach(w => {
      const subj = gradeBank[w.subject] || {};
      const qs   = (subj[w.topic] || []).map(q => ({ ...getQ(q), _subject: w.subject, _topic: w.topic }));
      const take = w.pct < 40 ? 10 : w.pct < 70 ? 6 : 3;
      pool.push(...shuffle([...qs]).slice(0, take));
    });
  }

  if (!pool.length) {
    Object.entries(gradeBank).forEach(([subj, topics]) =>
      Object.entries(topics).forEach(([t, qs]) =>
        qs.forEach(q => pool.push({ ...getQ(q), _subject: subj, _topic: t }))
      )
    );
    pool = shuffle(pool).slice(0, 30);
  }

  ST.isAdaptive = true;
  launchQuiz(shuffle(pool));
}

/* ══════════════════════════════════════════
   👨‍🏫 MÜƏLLİM PANELİ
   Şagirdin adı, hansı sınağı yazdığı, səviyyəsi
══════════════════════════════════════════ */
function showTeacherPanel() {
  const cu = getCurUser();
  if (!cu || cu.role !== 'teacher') return;
  el('modal-teacher').style.display = 'flex';
  renderTeacherStudents();
}

function renderTeacherStudents() {
  const users    = getUsers();
  const students = Object.entries(users).filter(([, u]) => u.role !== 'teacher');
  const box      = el('teacher-content');

  if (!students.length) {
    box.innerHTML = '<p style="color:var(--txt2);font-size:14px;padding:1.5rem 0;text-align:center">Hələ şagird qeydiyyatdan keçməyib.</p>';
    return;
  }

  box.innerHTML = students.map(([, u]) => {
    const hist = u.history || [];
    const best = hist.length ? Math.max(...hist.map(h => h.bal700 || 0)) : null;
    const avg  = hist.length ? Math.round(hist.reduce((s,h) => s+(h.pct||0), 0) / hist.length) : null;

    // Səviyyə
    let level = '—', levelClr = 'var(--txt3)';
    if (avg !== null) {
      if (avg >= 85)      { level = '⭐ Əla';    levelClr = 'var(--green)'; }
      else if (avg >= 70) { level = '👍 Yaxşı';  levelClr = 'var(--acc)'; }
      else if (avg >= 50) { level = '📌 Orta';   levelClr = 'var(--amber)'; }
      else                { level = '⚠️ Zəif';   levelClr = 'var(--red)'; }
    }

    // Son 3 sınaq
    const lastExams = hist.slice(0, 3).map(h =>
      `<div class="ts-exam-row">
        <span class="ts-exam-label">${h.label}</span>
        <span class="ts-exam-score" style="color:${(h.pct||0)>=70?'var(--green)':(h.pct||0)>=50?'var(--amber)':'var(--red)'}">${h.bal700}/700</span>
        <span class="ts-exam-date">${h.date}</span>
      </div>`
    ).join('');

    return `<div class="ts-card">
      <div class="ts-card-head">
        <div class="ts-avatar">${u.name.charAt(0).toUpperCase()}</div>
        <div class="ts-info">
          <div class="ts-name">${u.name}</div>
          <div class="ts-meta">${u.grade}-ci sinif · ${hist.length} sınaq</div>
        </div>
        <div class="ts-right">
          <div class="ts-level" style="color:${levelClr}">${level}</div>
          <div class="ts-best">${best !== null ? best+' bal' : '—'}</div>
        </div>
      </div>
      ${lastExams ? `<div class="ts-exams">${lastExams}</div>` : ''}
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════
   MÜƏLLİM EKRANI — tam ayrıca ekran
══════════════════════════════════════════ */
function showTeacherPanel() {
  const cu = getCurUser();
  if (!cu || cu.role !== 'teacher') return;

  // Header avatarı
  const av = el('t-hdr-avatar');
  const nm = el('t-hdr-name');
  if (av) av.textContent = cu.name.charAt(0).toUpperCase();
  if (nm) nm.textContent = cu.name;

  renderTeacherStats();
  renderTeacherStudentList('');
  renderWeakTopics();
  if (el('t-exams-list')) renderExams(el('t-exams-list'));
  if (el('t-homework-list')) renderHomeworkResults(el('t-homework-list'));
}

function renderTeacherStats() {
  const users    = getUsers();
  const students = Object.entries(users).filter(([, u]) => u.role !== 'teacher');
  const allHist  = students.flatMap(([, u]) => u.history || []);

  const totalStudents = students.length;
  const totalExams    = allHist.length;
  const avgBal        = totalExams ? Math.round(allHist.reduce((s,h)=>s+(h.bal700||0),0)/totalExams) : 0;
  const avgPct        = totalExams ? Math.round(allHist.reduce((s,h)=>s+(h.pct||0),0)/totalExams) : 0;

  const box = el('t-stat-cards');
  if (!box) return;
  box.innerHTML = `
    <div class="stat-card"><span class="stat-n" style="color:var(--acc)">${totalStudents}</span><span class="stat-l">Şagird</span></div>
    <div class="stat-card"><span class="stat-n" style="color:var(--green)">${totalExams}</span><span class="stat-l">Cəmi sınaq</span></div>
    <div class="stat-card"><span class="stat-n" style="color:var(--amber)">${avgBal}</span><span class="stat-l">Orta bal</span></div>
    <div class="stat-card"><span class="stat-n" style="color:var(--acc2)">${avgPct}%</span><span class="stat-l">Orta faiz</span></div>`;
}

let _allStudents = [];

function renderTeacherStudentList(filter) {
  const users    = getUsers();
  _allStudents   = Object.entries(users).filter(([, u]) => u.role !== 'teacher');
  const box      = el('t-student-list');
  if (!box) return;

  const filtered = filter
    ? _allStudents.filter(([, u]) => u.name.toLowerCase().includes(filter.toLowerCase()) || u.grade.toString().includes(filter))
    : _allStudents;

  if (!filtered.length) {
    box.innerHTML = '<p style="color:var(--txt2);font-size:14px;padding:1.5rem 0;text-align:center">Şagird tapılmadı.</p>';
    return;
  }

  // Sinif üzrə qruplaşdır
  const byGrade = {};
  filtered.forEach(([uname, u]) => {
    const g = u.grade || '?';
    if (!byGrade[g]) byGrade[g] = [];
    byGrade[g].push([uname, u]);
  });

  box.innerHTML = Object.entries(byGrade)
    .sort((a,b) => +a[0]-+b[0])
    .map(([grade, list]) => `
      <div class="t-grade-group">
        <div class="t-grade-label">${grade}-ci sinif — ${list.length} şagird</div>
        ${list.map(([, u]) => {
          const hist = u.history || [];
          const best = hist.length ? Math.max(...hist.map(h=>h.bal700||0)) : null;
          const avg  = hist.length ? Math.round(hist.reduce((s,h)=>s+(h.pct||0),0)/hist.length) : null;
          let level='—', lclr='var(--txt3)';
          if (avg!==null) {
            if (avg>=85)      { level='⭐ Əla';   lclr='var(--green)'; }
            else if (avg>=70) { level='👍 Yaxşı'; lclr='var(--acc)'; }
            else if (avg>=50) { level='📌 Orta';  lclr='var(--amber)'; }
            else              { level='⚠️ Zəif';  lclr='var(--red)'; }
          }
          const lastExams = hist.slice(0,3).map(h=>`
            <div class="ts-exam-row">
              <span class="ts-exam-label">${h.label}</span>
              <span class="ts-exam-score" style="color:${(h.pct||0)>=70?'var(--green)':(h.pct||0)>=50?'var(--amber)':'var(--red)'}">${h.bal700}/700</span>
              <span class="ts-exam-pct">${h.pct}%</span>
              <span class="ts-exam-date">${h.date}</span>
            </div>`).join('');
          return `<div class="ts-card">
            <div class="ts-card-head">
              <div class="ts-avatar">${u.name.charAt(0).toUpperCase()}</div>
              <div class="ts-info">
                <div class="ts-name">${u.name}</div>
                <div class="ts-meta">${hist.length} sınaq · Ən yaxşı: ${best!==null?best+' bal':'—'}</div>
              </div>
              <div class="ts-right">
                <div class="ts-level" style="color:${lclr};font-size:14px;font-weight:700">${level}</div>
              </div>
            </div>
            ${lastExams ? `<div class="ts-exams">${lastExams}</div>` : '<div style="font-size:12px;color:var(--txt3);padding:4px 0">Hələ sınaq yoxdur</div>'}
          </div>`;
        }).join('')}
      </div>`).join('');
}

function filterStudents(val) {
  renderTeacherStudentList(val);
}

function renderWeakTopics() {
  const users    = getUsers();
  const students = Object.entries(users).filter(([, u]) => u.role !== 'teacher');
  const tmap     = {};

  students.forEach(([, u]) => {
    (u.history || []).forEach(h => {
      if (!h.topicBreakdown) return;
      Object.entries(h.topicBreakdown).forEach(([topic, s]) => {
        if (!tmap[topic]) tmap[topic] = { correct:0, total:0 };
        tmap[topic].correct += s.correct;
        tmap[topic].total   += s.total;
      });
    });
  });

  const ranked = Object.entries(tmap)
    .filter(([, s]) => s.total >= 2)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct/s.total*100), total: s.total }))
    .sort((a,b) => a.pct - b.pct)
    .slice(0, 10);

  const box = el('t-weak-topics');
  if (!box) return;

  if (!ranked.length) {
    box.innerHTML = '<p style="color:var(--txt2);font-size:14px;padding:1rem 0">Hələ kifayət qədər məlumat yoxdur.</p>';
    return;
  }

  box.innerHTML = ranked.map(r => {
    const clr = r.pct<40?'var(--red)':r.pct<70?'var(--amber)':'var(--green)';
    const ico = r.pct<40?'⚠️':r.pct<70?'📌':'✅';
    return `<div class="bkdn-row">
      <div class="bkdn-icon">${ico}</div>
      <div class="bkdn-info">
        <div class="bkdn-name">${r.topic}</div>
        <div class="bkdn-score-text">${r.total} sual cavablandı</div>
      </div>
      <div class="bkdn-bar-wrap">
        <div class="bkdn-bar-bg"><div class="bkdn-bar-fill" style="width:${r.pct}%;background:${clr}"></div></div>
        <div class="bkdn-pct" style="color:${clr}">${r.pct}%</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════
   🔐 ADMİN PANELİ
══════════════════════════════════════════ */
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab)
  );
  renderAdminTab(tab);
}

function renderAdminTab(tab) {
  const box = el('admin-content');
  if (!box) return;
  if (tab === 'overview')  renderAdminOverview(box);
  else if (tab === 'teachers') renderAdminTeachers(box);
  else if (tab === 'students') renderAdminStudents(box);
  else if (tab === 'weak')     renderAdminWeak(box);
  else if (tab === 'homework')  renderHomeworkResults(box);
}

/* ── İcmal ── */
function renderAdminOverview(box) {
  const users    = getUsers();
  const teachers = Object.entries(users).filter(([u,d]) => d.role==='teacher');
  const students = Object.entries(users).filter(([u,d]) => d.role!=='teacher' && d.role!=='admin');
  const allHist  = students.flatMap(([,u]) => u.history||[]);
  const avgBal   = allHist.length ? Math.round(allHist.reduce((s,h)=>s+(h.bal700||0),0)/allHist.length) : 0;
  const avgPct   = allHist.length ? Math.round(allHist.reduce((s,h)=>s+(h.pct||0),0)/allHist.length) : 0;

  // Son 5 sınaq
  const recentExams = students
    .flatMap(([,u]) => (u.history||[]).map(h=>({...h, sname: u.name, sgrade: u.grade})))
    .sort((a,b) => b.date?.localeCompare(a.date||'') || 0)
    .slice(0, 5);

  box.innerHTML = `
    <div class="section">
      <div class="section-head"><span class="snm">📊</span><h2>Ümumi İcmal</h2></div>
      <div class="stat-cards">
        <div class="stat-card"><span class="stat-n" style="color:var(--acc)">${teachers.length}</span><span class="stat-l">Müəllim</span></div>
        <div class="stat-card"><span class="stat-n" style="color:var(--green)">${students.length}</span><span class="stat-l">Şagird</span></div>
        <div class="stat-card"><span class="stat-n" style="color:var(--amber)">${allHist.length}</span><span class="stat-l">Cəmi sınaq</span></div>
        <div class="stat-card"><span class="stat-n" style="color:var(--acc2)">${avgBal}</span><span class="stat-l">Orta bal</span></div>
        <div class="stat-card"><span class="stat-n" style="color:var(--az2)">${avgPct}%</span><span class="stat-l">Orta faiz</span></div>
      </div>
    </div>
    <div class="section">
      <div class="section-head"><span class="snm">🕐</span><h2>Son Sınaqlar</h2></div>
      ${recentExams.length ? recentExams.map(h=>`
        <div class="bkdn-row">
          <div class="bkdn-icon">📝</div>
          <div class="bkdn-info">
            <div class="bkdn-name">${h.sname} <span style="color:var(--txt3);font-size:12px">(${h.sgrade}-ci sinif)</span></div>
            <div class="bkdn-score-text">${h.label} · ${h.date}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:16px;font-weight:800;color:${(h.pct||0)>=70?'var(--green)':(h.pct||0)>=50?'var(--amber)':'var(--red)'}">${h.bal700}/700</div>
            <div style="font-size:11px;color:var(--txt3)">${h.pct}%</div>
          </div>
        </div>`).join('')
      : '<p style="color:var(--txt2);font-size:14px;padding:1rem 0">Hələ sınaq yoxdur.</p>'}
    </div>`;
}

/* ── Müəllimlər ── */
function renderAdminTeachers(box) {
  const users    = getUsers();
  const teachers = Object.entries(users).filter(([,u]) => u.role==='teacher');

  box.innerHTML = `
    <div class="section">
      <div class="section-head"><span class="snm">👨‍🏫</span><h2>Müəllimlər</h2>
        <button class="btn-start small" onclick="showAddTeacher()" style="margin-left:auto">+ Müəllim əlavə et</button>
      </div>
      <div id="admin-teacher-list">
        ${teachers.length ? teachers.map(([uname,u])=>`
          <div class="ts-card">
            <div class="ts-card-head">
              <div class="ts-avatar" style="background:linear-gradient(135deg,var(--az1),var(--acc2))">${u.name.charAt(0).toUpperCase()}</div>
              <div class="ts-info">
                <div class="ts-name">${u.name}</div>
                <div class="ts-meta">İstifadəçi adı: <strong>${uname}</strong></div>
              </div>
              <button class="btn btn-danger" onclick="deleteUser('${uname}')" style="font-size:12px;padding:6px 12px">Sil</button>
            </div>
          </div>`).join('')
        : '<p style="color:var(--txt2);font-size:14px;padding:1rem 0">Hələ müəllim yoxdur.</p>'}
      </div>
    </div>

    <!-- Müəllim əlavə et forması -->
    <div id="add-teacher-form" class="admin-form-card" style="display:none">
      <div class="section-head"><span class="snm">➕</span><h2>Yeni Müəllim</h2></div>
      <div class="field-group"><label>Ad Soyad</label><input type="text" id="t-name" placeholder="Müəllimin adı"></div>
      <div class="field-group"><label>İstifadəçi adı</label><input type="text" id="t-user" placeholder="login üçün istifadəçi adı"></div>
      <div class="field-group"><label>Şifrə</label><input type="password" id="t-pass" placeholder="Şifrə (min. 4 simvol)"></div>
      <div class="auth-error" id="t-err"></div>
      <div style="display:flex;gap:10px">
        <button class="btn-start small" onclick="addTeacher()">Yadda saxla</button>
        <button class="btn" onclick="hideAddTeacher()">Ləğv et</button>
      </div>
    </div>`;
}

function showAddTeacher() {
  el('add-teacher-form').style.display = '';
  el('t-name').focus();
}
function hideAddTeacher() {
  el('add-teacher-form').style.display = 'none';
  el('t-err').textContent = '';
}

function addTeacher() {
  const name = el('t-name').value.trim();
  const user = el('t-user').value.trim();
  const pass = el('t-pass').value;
  const err  = el('t-err');
  if (!name||!user||!pass) { err.textContent='Bütün xanaları doldurun.'; return; }
  if (pass.length<4)       { err.textContent='Şifrə ən az 4 simvol olmalıdır.'; return; }
  const users = getUsers();
  if (users[user])         { err.textContent='Bu istifadəçi adı artıq mövcuddur.'; return; }
  users[user] = { name, grade:'Müəllim', role:'teacher', pass, history:[] };
  saveUsers(users);
  el('t-name').value = el('t-user').value = el('t-pass').value = '';
  err.style.color = 'var(--green)';
  err.textContent = '✓ Müəllim əlavə edildi!';
  setTimeout(() => { renderAdminTeachers(el('admin-content')); }, 900);
}

function deleteUser(uname) {
  if (!confirm(`"${uname}" istifadəçisini silmək istəyirsiniz?`)) return;
  const users = getUsers();
  delete users[uname];
  saveUsers(users);
  renderAdminTab(document.querySelector('.admin-tab.active')?.dataset.tab || 'teachers');
}

/* ── Şagirdlər ── */
function renderAdminStudents(box) {
  const users    = getUsers();
  const students = Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');

  // Sinif üzrə qruplaşdır
  const byGrade = {};
  students.forEach(([uname,u]) => {
    const g = u.grade||'?';
    if (!byGrade[g]) byGrade[g] = [];
    byGrade[g].push([uname,u]);
  });

  box.innerHTML = `
    <div class="section">
      <div class="section-head"><span class="snm">🎓</span><h2>Şagirdlər (${students.length})</h2>
        <div class="t-search-wrap"><input type="text" class="t-search" placeholder="Şagird axtar..." oninput="adminFilterStudents(this.value)"></div>
      </div>
      <div id="admin-student-list">
        ${renderAdminStudentList(students)}
      </div>
    </div>`;
}

function renderAdminStudentList(students) {
  if (!students.length) return '<p style="color:var(--txt2);font-size:14px;padding:1rem 0;text-align:center">Şagird tapılmadı.</p>';
  const byGrade = {};
  students.forEach(([uname,u]) => {
    const g = u.grade||'?';
    if (!byGrade[g]) byGrade[g] = [];
    byGrade[g].push([uname,u]);
  });
  return Object.entries(byGrade).sort((a,b)=>+a[0]-+b[0]).map(([grade,list])=>`
    <div class="t-grade-group">
      <div class="t-grade-label">${grade}-ci sinif — ${list.length} şagird</div>
      ${list.map(([uname,u])=>{
        const hist = u.history||[];
        const best = hist.length ? Math.max(...hist.map(h=>h.bal700||0)) : null;
        const avg  = hist.length ? Math.round(hist.reduce((s,h)=>s+(h.pct||0),0)/hist.length) : null;
        let level='—', lclr='var(--txt3)';
        if(avg!==null){
          if(avg>=85){level='⭐ Əla';lclr='var(--green)';}
          else if(avg>=70){level='👍 Yaxşı';lclr='var(--acc)';}
          else if(avg>=50){level='📌 Orta';lclr='var(--amber)';}
          else{level='⚠️ Zəif';lclr='var(--red)';}
        }
        const lastExams = hist.slice(0,3).map(h=>`
          <div class="ts-exam-row">
            <span class="ts-exam-label">${h.label}</span>
            <span class="ts-exam-score" style="color:${(h.pct||0)>=70?'var(--green)':(h.pct||0)>=50?'var(--amber)':'var(--red)'}">${h.bal700}/700</span>
            <span class="ts-exam-pct">${h.pct}%</span>
            <span class="ts-exam-date">${h.date}</span>
          </div>`).join('');
        return `<div class="ts-card">
          <div class="ts-card-head">
            <div class="ts-avatar">${u.name.charAt(0).toUpperCase()}</div>
            <div class="ts-info">
              <div class="ts-name">${u.name}</div>
              <div class="ts-meta">${hist.length} sınaq · Ən yaxşı: ${best!==null?best+' bal':'—'}</div>
            </div>
            <div class="ts-right">
              <div style="color:${lclr};font-size:13px;font-weight:700;margin-bottom:4px">${level}</div>
              <button class="btn" onclick="deleteUser('${uname}')" style="font-size:11px;padding:4px 10px;color:var(--red);border-color:rgba(239,68,68,.3)">Sil</button>
            </div>
          </div>
          ${lastExams?`<div class="ts-exams">${lastExams}</div>`:'<div style="font-size:12px;color:var(--txt3);padding:4px 0">Hələ sınaq yoxdur</div>'}
        </div>`;
      }).join('')}
    </div>`).join('');
}

function adminFilterStudents(val) {
  const users = getUsers();
  let students = Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');
  if (val) students = students.filter(([,u]) => u.name.toLowerCase().includes(val.toLowerCase()) || String(u.grade).includes(val));
  const box = el('admin-student-list');
  if (box) box.innerHTML = renderAdminStudentList(students);
}

/* ── Analiz (zəif mövzular) ── */
function renderAdminWeak(box) {
  const users    = getUsers();
  const students = Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');
  const tmap = {};
  students.forEach(([,u]) => {
    (u.history||[]).forEach(h => {
      if (!h.topicBreakdown) return;
      Object.entries(h.topicBreakdown).forEach(([topic,s]) => {
        if (!tmap[topic]) tmap[topic] = {correct:0,total:0};
        tmap[topic].correct += s.correct;
        tmap[topic].total   += s.total;
      });
    });
  });

  const ranked = Object.entries(tmap)
    .filter(([,s]) => s.total>=3)
    .map(([topic,s]) => ({topic, pct:Math.round(s.correct/s.total*100), total:s.total}))
    .sort((a,b)=>a.pct-b.pct);

  box.innerHTML = `
    <div class="section">
      <div class="section-head"><span class="snm">⚠️</span><h2>Mövzu Analizi</h2></div>
      ${ranked.length ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1.5rem">
          <div class="stat-card">
            <span class="stat-n" style="color:var(--red)">${ranked.filter(r=>r.pct<40).length}</span>
            <span class="stat-l">Kritik mövzu (40%-dən az)</span>
          </div>
          <div class="stat-card">
            <span class="stat-n" style="color:var(--amber)">${ranked.filter(r=>r.pct>=40&&r.pct<70).length}</span>
            <span class="stat-l">Orta mövzu (40-70%)</span>
          </div>
        </div>
        ${ranked.map(r=>{
          const clr=r.pct<40?'var(--red)':r.pct<70?'var(--amber)':'var(--green)';
          const ico=r.pct<40?'🔴':r.pct<70?'🟡':'🟢';
          return `<div class="bkdn-row">
            <div class="bkdn-icon">${ico}</div>
            <div class="bkdn-info">
              <div class="bkdn-name">${r.topic}</div>
              <div class="bkdn-score-text">${r.total} sual · ${r.correct} doğru</div>
            </div>
            <div class="bkdn-bar-wrap">
              <div class="bkdn-bar-bg"><div class="bkdn-bar-fill" style="width:${r.pct}%;background:${clr}"></div></div>
              <div class="bkdn-pct" style="color:${clr}">${r.pct}%</div>
            </div>
          </div>`;
        }).join('')}`
      : '<p style="color:var(--txt2);font-size:14px;padding:1rem 0">Hələ kifayət qədər məlumat yoxdur.</p>'}
    </div>`;
}