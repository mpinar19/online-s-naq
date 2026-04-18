/* ══════════════════════════════════════
   app.js
   • Suallar arasında sərbəst hərəkət (irəli/geri)
   • Bütün suallar cavablandıqdan sonra "İmtahanı bitir" görünür
   • Vaxt avtomatik (hər suala 90 san)
   • İmtahan bitdikdən sonra: nəticə + səhvlərin izahı
   • AI PDF generator: fayl yüklə → yeni suallar yarat → sınaq kimi başla
   ══════════════════════════════════════ */

/* ──────────────────────────────────────
   AUTH
────────────────────────────────────── */
const getUsers    = () => JSON.parse(localStorage.getItem('az_users') || '{}');
const saveUsers   = u  => localStorage.setItem('az_users', JSON.stringify(u));
const getCurUser  = () => JSON.parse(sessionStorage.getItem('az_cur') || 'null');
const saveCurUser = u  => { if (u) sessionStorage.setItem('az_cur', JSON.stringify(u)); else sessionStorage.removeItem('az_cur'); };

function switchAuth(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) =>
    t.classList.toggle('active', (i===0&&tab==='login')||(i===1&&tab==='register'))
  );
  el('form-login').style.display    = tab==='login'    ? '' : 'none';
  el('form-register').style.display = tab==='register' ? '' : 'none';
  el('login-error').textContent = '';
  el('reg-error').textContent   = '';
}

function doLogin() {
  const user = el('login-user').value.trim();
  const pass = el('login-pass').value;
  const err  = el('login-error');
  if (!user||!pass) { err.textContent='Bütün xanaları doldurun.'; return; }
  const users = getUsers();
  if (!users[user]||users[user].pass!==pass) { err.textContent='İstifadəçi adı və ya şifrə yanlışdır.'; return; }
  saveCurUser({ username:user, name:users[user].name, grade:users[user].grade, role:users[user].role||'student' });
  enterApp();
}

function doRegister() {
  const name    = el('reg-name').value.trim();
  const role    = 'student';
  const gradeEl = el('reg-grade');
  const grade   = gradeEl ? gradeEl.value : '';
  const user    = el('reg-user').value.trim();
  const pass    = el('reg-pass').value;
  const err     = el('reg-error');
  if (!name || !user || !pass) { err.textContent='Bütün xanaları doldurun.'; return; }
  if (!grade) { err.textContent='Sinif seçin.'; return; }
  if (pass.length < 4) { err.textContent='Şifrə ən az 4 simvol olmalıdır.'; return; }
  const users = getUsers();
  if (users[user]) { err.textContent='Bu istifadəçi adı artıq mövcuddur.'; return; }
  users[user] = { name, grade, role, pass, history:[] };
  saveUsers(users);
  saveCurUser(null);
  el('reg-error').style.color = 'var(--green)';
  el('reg-error').textContent = '✓ Qeydiyyat tamamlandı! İndi daxil olun.';
  setTimeout(() => {
    switchAuth('login');
    el('login-user').value = user;
    el('login-pass').value = '';
    el('login-pass').focus();
  }, 1200);
}

function enterApp() {
  const cu = getCurUser();
  el('hdr-name').textContent   = cu.name;
  el('hdr-grade').textContent  = cu.role === 'teacher' ? 'Müəllim' : cu.grade + '-ci sinif';
  el('hdr-avatar').textContent = cu.name.charAt(0).toUpperCase();
  const tb = el('teacher-btn');
  if (tb) tb.style.display = cu.role === 'teacher' ? '' : 'none';

  // Adaptiv sınaq düyməsini yalnız şagirdə göstər
  const adb = el('adaptive-btn');
  if (adb) adb.style.display = cu.role === 'teacher' ? 'none' : '';

  if (cu.role === 'admin') {
    showScreen('s-admin');
    if (typeof renderAdminTab === 'function') renderAdminTab('overview');
  } else if (cu.role === 'teacher') {
    showScreen('s-teacher');
    if (typeof showTeacherPanel === 'function') showTeacherPanel();
  } else {
    const hb = document.querySelector('.home-body');
    if (hb) hb.style.display = '';
    showScreen('s-home');
    buildGradeGrid();
    setTimeout(() => {
      document.querySelectorAll('.grade-card').forEach(c => {
        if (c.querySelector && c.querySelector('.gnum') &&
            c.querySelector('.gnum').textContent === String(cu.grade)) c.click();
      });
    }, 60);
  }
}

function logout() { saveCurUser(null); const hb = document.querySelector('.home-body'); if(hb) hb.style.display=''; showScreen('s-auth'); const hasUsers = Object.keys(getUsers()).length > 0; switchAuth(hasUsers ? 'login' : 'register'); }

/* ──────────────────────────────────────
   TARİXÇƏ
────────────────────────────────────── */
function saveHistory(entry) {
  const cu = getCurUser(); if (!cu) return;
  if (ST && ST.questions && ST.answers) {
    const bd = {};
    ST.questions.forEach((q, i) => {
      const topic   = q._topic   || 'Digər';
      const subject = q._subject || 'Digər';
      if (!bd[topic]) bd[topic] = { correct:0, total:0, subject };
      bd[topic].total++;
      if (ST.answers[i] === q.ans) bd[topic].correct++;
    });
    entry.topicBreakdown = bd;
    if (ST.isAdaptive) { entry.label = '🎯 ' + entry.label; ST.isAdaptive = false; }
  }
  const users = getUsers();
  if (!users[cu.username].history) users[cu.username].history = [];
  users[cu.username].history.unshift(entry);
  if (users[cu.username].history.length > 30) users[cu.username].history.length = 30;
  saveUsers(users);
  // Firebase-ə də sinxronlaşdır
  if (_db) { FBUsers.save(cu.username, users[cu.username]).catch(()=>{}); }
  // Hədəf/streak yenilə
  updateDailyStreak(cu.username);
  checkHomeworkCompletion(cu.username, entry);
}

function showHistory() {
  const cu = getCurUser(); if (!cu) return;
  const hist = getUsers()[cu.username]?.history || [];
  el('history-content').innerHTML = hist.length
    ? hist.map(h => `<div class="hist-item">
        <div class="hist-top"><div class="hist-title">${h.label}</div><div class="hist-score">${h.bal700}/700</div></div>
        <div class="hist-meta">${h.correct}/${h.total} doğru • ${h.pct}% • ${h.date}</div>
      </div>`).join('')
    : '<p style="color:var(--text2);font-size:14px;padding:1rem 0">Hələ sınaq götürməmisiniz.</p>';
  el('modal-history').style.display = 'flex';
}

function closeHistory(e)   { if (e.target.id==='modal-history') closeHistoryModal(); }
function closeHistoryModal(){ el('modal-history').style.display = 'none'; }

/* ──────────────────────────────────────
   GRADE RƏNGLƏR
────────────────────────────────────── */
const GCOL = {
  '1':{bg:'#E8F4FD',txt:'#1565C0'},'2':{bg:'#FFF3E0',txt:'#E65100'},
  '3':{bg:'#F3E5F5',txt:'#6A1B9A'},'4':{bg:'#E8F5E9',txt:'#2E7D32'},
  '5':{bg:'#FBE9E7',txt:'#BF360C'},'6':{bg:'#E0F2F1',txt:'#004D40'},
  '7':{bg:'#FCE4EC',txt:'#880E4F'},'8':{bg:'#F9FBE7',txt:'#558B2F'},
  '9':{bg:'#EDE7F6',txt:'#4527A0'},'10':{bg:'#E3F2FD',txt:'#0D47A1'},
  '11':{bg:'#FFF8E1',txt:'#F57F17'},
};

/* ──────────────────────────────────────
   VƏZİYYƏT
────────────────────────────────────── */
const ST = {
  grade:null, gradeGroup:null,
  examType:null, subject:null, topic:null,
  questions:[], current:0, answers:[],
  timerInterval:null, timerLeft:0,
  examFinished:false,
  genQuestions:[],   // AI tərəfindən yaradılmış suallar
  uploadedText:'',   // PDF-dən çıxarılmış mətn
};

/* ──────────────────────────────────────
   ANA SƏHİFƏ
────────────────────────────────────── */
function buildGradeGrid() {
  // Streak + ödev widgetləri
  const ss = el('streak-section');
  if (ss && typeof renderStreakWidget === 'function') ss.innerHTML = renderStreakWidget();
  const hs = el('homework-section');
  if (hs && typeof renderHomeworkWidget === 'function') hs.innerHTML = renderHomeworkWidget();
  const grid = el('grade-grid');
  grid.innerHTML = '';
  ALL_GRADES.forEach(g => {
    const col = GCOL[g];
    const div = document.createElement('div');
    div.className = 'grade-card';
    div.style.cssText = `background:${col.bg};border-color:${col.bg};color:${col.txt}`;
    div.innerHTML = `<span class="gnum">${g}</span><span class="glabel">sinif</span>`;
    div.onclick = () => selectGrade(g, div);
    grid.appendChild(div);
  });
}

function selectGrade(g, div) {
  ST.grade = g; ST.gradeGroup = parseInt(g) <= 4 ? '1-4' : '5-11';
  ST.examType = null; ST.subject = null; ST.topic = null;
  document.querySelectorAll('.grade-card').forEach(c => {
    c.classList.remove('active');
    c.style.borderColor = GCOL[c.querySelector('.gnum').textContent].bg;
  });
  div.classList.add('active'); div.style.borderColor = GCOL[g].txt;
  buildExamTypes();
  hide('subj-section'); hide('topic-section'); hide('start-wrap');
}

function buildExamTypes() {
  show('type-section');
  el('type-grid').innerHTML = '';
  [
    { id:'all_mixed',  icon:'📋', label:'Bütün fənlər (qarışıq)', desc:'Real imtahan kimi — hər fəndən uyğun sual sayı' },
    { id:'by_subject', icon:'📖', label:'Fənn üzrə sınaq',        desc:'Seçdiyiniz fəndən 50 sual' },
  ].forEach(t => {
    const div = document.createElement('div');
    div.className = 'type-card';
    div.innerHTML = `<div class="type-icon">${t.icon}</div><div><div class="type-label">${t.label}</div><div class="type-desc">${t.desc}</div></div>`;
    div.onclick = () => selectExamType(t.id, div);
    el('type-grid').appendChild(div);
  });
}

function selectExamType(type, div) {
  ST.examType = type; ST.subject = null; ST.topic = null;
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  div.classList.add('active');
  if (type === 'all_mixed') { hide('subj-section'); hide('topic-section'); showStartCard(); }
  else { buildSubjectGrid(); hide('topic-section'); hide('start-wrap'); }
}

function buildSubjectGrid() {
  show('subj-section');
  el('subject-grid').innerHTML = '';
  const subjects = SUBJECTS_BY_GRADE[ST.grade] || SUBJECTS_BY_GRADE['9'] || [];
  subjects.forEach(s => {
    const gradeBank = getQBankForGrade(ST.grade);
    const cnt = Object.values(gradeBank[s.name] || {}).reduce((n, a) => n + a.length, 0);
    const div = document.createElement('div');
    div.className = 'subj-card';
    div.innerHTML = `<div class="subj-dot" style="background:${s.bg}">${s.icon}</div>
      <div><div class="subj-name">${s.name}</div><div class="subj-cnt">${cnt} sual</div></div>`;
    div.onclick = () => selectSubject(s.name, div);
    el('subject-grid').appendChild(div);
  });
}

function selectSubject(name, div) {
  ST.subject = name; ST.topic = null;
  document.querySelectorAll('.subj-card').forEach(c => c.classList.remove('active'));
  div.classList.add('active');
  buildTopicChips(name); hide('start-wrap');
}

function buildTopicChips(subj) {
  show('topic-section');
  const row = el('topic-chips');
  row.innerHTML = '';
  const ac = mkChip('Bütün mövzular', () => { ST.topic = 'all'; actChip(ac, row); showStartCard(); });
  row.appendChild(ac);
  const gradeBank = getQBankForGrade(ST.grade);
  const subjectTopics = Object.keys(gradeBank[subj] || {});
  subjectTopics.forEach(t => {
    const chip = mkChip(t, () => { ST.topic = t; actChip(chip, row); showStartCard(); });
    row.appendChild(chip);
  });
}

const mkChip  = (txt, fn) => { const d = document.createElement('div'); d.className = 'chip'; d.textContent = txt; d.onclick = fn; return d; };
const actChip = (e, row)  => { row.querySelectorAll('.chip').forEach(c => c.classList.remove('active')); e.classList.add('active'); };

function showStartCard() {
  show('start-wrap');
  const qs = buildQuestions();
  const total = qs.length;
  const mins  = Math.round(total * 90 / 60);
  let lines = [];
  if (ST.examType === 'all_mixed') {
    const cfg = EXAM_CONFIG[ST.grade + '_all'] || [];
    cfg.forEach(c => lines.push(`<strong>${c.subject}:</strong> ${c.count} ${'sual'}`));
    lines.push(`<strong>${'Cəmi'}:</strong> ${total} ${'sual'}`);
  } else {
    lines.push(`<strong>${'Fən'}:</strong> ${ST.subject}`);
    lines.push(`<strong>${'Mövzu'}:</strong> ${(!ST.topic || ST.topic === 'all') ? 'Bütün mövzular' : ST.topic}`);
    lines.push(`<strong>${'sual'}:</strong> ${total}`);
  }
  lines.push(`<strong>${'Vaxt'}:</strong> ${mins} ${'dəqiqə'} (${'hər suala ~90 san'})`); 
  el('start-summary').innerHTML = lines.join('<br>');
}

/* ──────────────────────────────────────
   SUAL QURULUŞU
────────────────────────────────────── */
function buildQuestions() {
  const gradeBank = getQBankForGrade(ST.grade);

  if (ST.examType === 'all_mixed') {
    const cfg = EXAM_CONFIG[ST.grade + '_all'] || [];
    const result = [];
    cfg.forEach(({ subject, count }) => {
      const subjectBank = gradeBank[subject] || {};
      const all = [];
      Object.entries(subjectBank).forEach(([t, qs]) =>
        qs.forEach(q => all.push({ ...getQ(q), _subject: subject, _topic: t }))
      );
      const sh = shuffle([...all]);
      // Yalniz movcud sual sayina qedar got, tekrar etme
      const take = Math.min(count, sh.length);
      for (let i = 0; i < take; i++) result.push({ ...sh[i] });
    });
    return result;
  }

  // Fenn uzre sinaq - YALNIZ secilmis sinif + fenn + movzu sualları, TEKRAR YOX
  const subjectBank = gradeBank[ST.subject] || {};
  const pool = [];

  if (!ST.topic || ST.topic === 'all') {
    Object.entries(subjectBank).forEach(([t, qs]) =>
      qs.forEach(q => pool.push({ ...getQ(q), _subject: ST.subject, _topic: t }))
    );
  } else {
    (subjectBank[ST.topic] || []).forEach(q =>
      pool.push({ ...getQ(q), _subject: ST.subject, _topic: ST.topic })
    );
  }

  if (!pool.length) return [];

  // Karisdir, TEKRAR OLMADAN movcud olan butun sualları qaytar
  return shuffle([...pool]);
}

const shuffle = arr => {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ──────────────────────────────────────
   SINAQ BAŞLANĞICI
────────────────────────────────────── */


function startQuiz() {
  const qs = buildQuestions();
  if (!qs || !qs.length) { alert('Sual tapılmadı!'); return; }
  launchQuiz(qs);
}

function launchQuiz(qs) {
  if (!qs || !qs.length) { alert('Sual tapılmadı!'); return; }
  ST.questions     = qs;
  ST.current       = 0;
  ST.answers       = new Array(qs.length).fill(null);
  ST.examFinished  = false;
  stopTimer();
  showScreen('s-quiz');
  buildNavStrip();
  hide('finish-wrap');
  renderQ();
  startTimer(qs.length * 90);
}

/* ──────────────────────────────────────
   TAYMER
────────────────────────────────────── */
function startTimer(secs) {
  ST.timerLeft = secs;
  const badge = el('timer-badge');
  const disp  = el('timer-display');
  badge.classList.remove('danger');
  fmtTimer(disp, secs);
  ST.timerInterval = setInterval(() => {
    ST.timerLeft--;
    fmtTimer(disp, ST.timerLeft);
    if (ST.timerLeft <= 60) badge.classList.add('danger');
    if (ST.timerLeft <= 0)  { stopTimer(); autoFinish(); }
  }, 1000);
}

function fmtTimer(el, s) {
  el.textContent = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

function stopTimer() {
  if (ST.timerInterval) { clearInterval(ST.timerInterval); ST.timerInterval = null; }
}

function autoFinish() { ST.examFinished = true; processResult(); }

/* ──────────────────────────────────────
   SUAL NAVİQASİYA DÖTLƏRİ
────────────────────────────────────── */
function buildNavStrip() {
  el('q-nav-strip').innerHTML = '';
  ST.questions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'q-dot'; dot.textContent = i + 1;
    // İstənilən vaxta istənilən suala keçmək olar
    dot.onclick = () => { ST.current = i; renderQ(); updNav(); };
    el('q-nav-strip').appendChild(dot);
  });
  updNav();
}

function updNav() {
  document.querySelectorAll('.q-dot').forEach((d, i) => {
    d.className = 'q-dot';
    if (ST.examFinished) {
      d.classList.add(ST.answers[i] === ST.questions[i].ans ? 'correct' : 'wrong');
    } else if (i === ST.current) {
      d.classList.add('current');
    } else if (ST.answers[i] !== null) {
      d.classList.add('answered');
    }
  });
}

/* ──────────────────────────────────────
   SUALIN GÖSTƏRİLMƏSİ
   • Variant seçilib qeyd edilir, AVTOMATIK KEÇID YOX
   • İstifadəçi özü irəli/geri düyməsinə basar
   • Bütün suallar cavablandıqdan sonra "İmtahanı bitir" görünür
────────────────────────────────────── */
function renderQ() {
  const q        = ST.questions[ST.current];
  const total    = ST.questions.length;
  const LTR      = ['A', 'B', 'C', 'D'];
  const finished = ST.examFinished;
  const userAns  = ST.answers[ST.current];
  const isFirst  = ST.current === 0;
  const isLast   = ST.current === total - 1;

  el('quiz-meta').textContent = `${'Sual'} ${ST.current + 1} ${'/'} ${total}`;
  el('q-progress').style.width = ((ST.current + 1) / total * 100) + '%';
  hide('finish-wrap');

  const bal      = q.bal || 10;
  const diffCls  = bal >= 14 ? 'diff-hard' : bal >= 12 ? 'diff-medium' : 'diff-easy';
  const diffLbl  = bal >= 14 ? 'Çətin' : bal >= 12 ? 'Orta' : 'Asan';

  // Variant sıraları
  const optsHTML = q.opts.map((txt, i) => {
    let cls = 'opt';
    if (finished) {
      if (i === q.ans) cls += ' ok';
      else if (i === userAns && i !== q.ans) cls += ' no';
    } else if (userAns === i) {
      cls += ' sel';
    }
    const handler = !finished ? `onclick="selOpt(${i})"` : '';
    const cursor  = finished ? 'style="cursor:default"' : '';
    return `<div class="${cls}" ${handler} ${cursor}>
      <div class="opt-ltr">${LTR[i]}</div>
      <div class="opt-txt">${txt}</div>
    </div>`;
  }).join('');

  // İzahat — yalnız imtahan bitdikdən sonra
  let fbHTML = '';
  if (finished) {
    const ok = userAns === q.ans;
    fbHTML = `<div class="feedback ${ok ? 'fb-ok' : 'fb-no'}">${ok ? '✓ ' + 'Doğru' + '! ' : '✗ ' + 'Yanlış' + '. '}${q.exp}</div>`;
  }

  el('q-area').innerHTML = `
    <div class="q-card">
      <div class="q-meta-row">
        <span class="q-pill subj">${q._subject || ''}</span>
        <span class="q-pill ${diffCls}">${diffLbl}</span>
        <span class="q-pill bal">${bal} ${'bal'}</span>
        <span class="q-num">${ST.current + 1}/${total}</span>
      </div>
      <div class="q-text">${q.q}</div>
      <div class="opts">${optsHTML}</div>
      ${fbHTML}
    </div>
    <div class="nav-row">
      <button class="btn" onclick="prevQ()" ${isFirst ? 'disabled' : ''}>${'← Əvvəlki'}</button>
      <div style="font-size:13px;color:var(--text3);font-weight:600">
        ${ST.answers.filter(a => a !== null).length}/${total} ${'cavablandı'}
      </div>
      <button class="btn btn-primary" onclick="nextQ()" ${isLast ? 'disabled' : ''}>${'Növbəti →'}</button>
    </div>`;

  updNav();
  checkShowFinish();
}

// Variant seç — cavabı qeyd et, heç yana getmə
function selOpt(i) {
  if (ST.examFinished) return;
  ST.answers[ST.current] = i;
  updNav();
  renderQ();  // rəngi yenilə, eyni sualda qal
}

function prevQ() { if (ST.current > 0)                        { ST.current--; renderQ(); } }
function nextQ() { if (ST.current < ST.questions.length - 1)  { ST.current++; renderQ(); } }

// Bütün suallar cavablandıqda "İmtahanı bitir" blokunu göstər
function checkShowFinish() {
  if (ST.examFinished) return;
  const answered  = ST.answers.filter(a => a !== null).length;
  const total     = ST.questions.length;
  const unanswered= total - answered;
  if (answered === total) {
    el('finish-sub').innerHTML = `${'Bütün sualları cavabladınız!'} ${'Yeni sınaq'}ə hazırsınız.`;
    show('finish-wrap');
  } else if (unanswered <= 5 && unanswered > 0) {
    // Son 5 sual qaldıqda xatırladıcı göstər
    el('finish-sub').innerHTML = `<span style="color:var(--amber)">${unanswered} ${'sual hələ cavabsız.'}</span>`;
    show('finish-wrap');
  }
}

function finishExam() {
  stopTimer();
  ST.examFinished = true;
  processResult();
}


/* İstənilən vaxt imtahanı bitirmək */
function confirmFinishNow() {
  const total    = ST.questions.length;
  const answered = ST.answers.filter(a => a !== null).length;
  const left     = total - answered;
  const desc = left > 0
    ? `${answered}/${total} ${'sual'} ${'cavablandı'}. <span style="color:var(--amber)">${left} ${'sual hələ cavabsız.'}</span>`
    : `${total}/${total} ${'sual'} ${'cavablandı'}.`;
  document.getElementById('finish-now-desc').innerHTML = desc;
  document.getElementById('modal-finish-now').style.display = 'flex';
}

function closeFinishNowModal() {
  document.getElementById('modal-finish-now').style.display = 'none';
}

function doFinishNow() {
  closeFinishNowModal();
  stopTimer();
  ST.examFinished = true;
  processResult();
}

function confirmExit()   { el('modal-exit').style.display = 'flex'; }
function closeExitModal(){ el('modal-exit').style.display = 'none'; }
function forceExit()     { stopTimer(); closeExitModal(); goHome(); }

/* ──────────────────────────────────────
   NƏTİCƏ
────────────────────────────────────── */
function processResult() {
  const qs     = ST.questions;
  const total  = qs.length;
  const correct= ST.answers.filter((a, i) => a === qs[i].ans).length;
  const maxBal = qs.reduce((s, q) => s + (q.bal || 10), 0);
  const earned = ST.answers.reduce((s, a, i) => s + (a === qs[i].ans ? (qs[i].bal||10) : 0), 0);
  const bal700 = Math.round((earned / maxBal) * 700);
  const pct    = Math.round(correct / total * 100);

  el('medal-icon').textContent = pct>=85?'🏆':pct>=70?'🥇':pct>=50?'🥈':'🥉';
  el('big-score').textContent  = bal700;
  el('res-title').textContent  = pct>=85?'Əla nəticə!':pct>=70?'Yaxşı cəhd!':pct>=50?'Orta səviyyə':'Daha çox məşq lazımdır';
  el('res-sub').textContent    = `${correct}/${total} • ${pct}% • ${earned} ${'xam bal'}`;

  el('stat-cards').innerHTML = `
    <div class="stat-card"><span class="stat-n" style="color:#16A34A">${correct}</span><span class="stat-l">${'Doğru'}</span></div>
    <div class="stat-card"><span class="stat-n" style="color:#DC2626">${total-correct}</span><span class="stat-l">${'Yanlış'}</span></div>
    <div class="stat-card"><span class="stat-n" style="color:#2D6BE4">${bal700}</span><span class="stat-l">/ 700 ${'bal'}</span></div>
    <div class="stat-card"><span class="stat-n" style="color:#B45309">${pct}%</span><span class="stat-l">${'Faiz'}</span></div>`;

  buildSubjBreakdown(qs);
  buildWrongReview(qs);
  buildFullReview(qs);

  const label = ST.examType === 'all_mixed'
    ? `${ST.grade}${'-ci sinif'} — ${'Bütün fənlər (qarışıq)'}`
    : `${ST.subject}${ST.topic && ST.topic !== 'all' ? ' — ' + ST.topic : ''} (${ST.grade}${'-ci sinif'})`;
  saveHistory({ label, bal700, correct, total, pct, date: new Date().toLocaleDateString('az-AZ') });

  showScreen('s-result');
  switchResTab(0);
  resetGenerator(); // generatoru sıfırla
}

function buildSubjBreakdown(qs) {
  const map = {};
  qs.forEach((q, i) => {
    const s = q._subject || '?';
    if (!map[s]) map[s] = { total:0, correct:0 };
    map[s].total++;
    if (ST.answers[i] === q.ans) map[s].correct++;
  });
  const sInfo = {};
  (SUBJECTS_BY_GRADE[ST.grade] || []).forEach(s => sInfo[s.name] = s);
  el('subj-breakdown').innerHTML = Object.entries(map).map(([s, v]) => {
    const p  = Math.round(v.correct / v.total * 100);
    const fc = p>=80?'#16A34A':p>=60?'#D97706':'#DC2626';
    const si = sInfo[s] || {};
    return `<div class="bkdn-row">
      <div class="bkdn-icon" style="background:${si.bg||'#F0F0F0'}">${si.icon||'📚'}</div>
      <div class="bkdn-info"><div class="bkdn-name">${s}</div><div class="bkdn-score-text">${v.correct}/${v.total} doğru</div></div>
      <div class="bkdn-bar-wrap"><div class="bkdn-bar-bg"><div class="bkdn-bar-fill" style="width:${p}%;background:${fc}"></div></div><div class="bkdn-pct">${p}%</div></div>
    </div>`;
  }).join('');
}

function buildWrongReview(qs) {
  const wrongs = [];
  qs.forEach((q, i) => { if (ST.answers[i] !== q.ans) wrongs.push({ q, i, userAns:ST.answers[i] }); });
  el('wrong-count-label').textContent = wrongs.length === 0
    ? '🎉 ' + 'Bütün sualları düzgün cavabladınız!'
    : `${wrongs.length} ${'səhv cavab — aşağıda izahat'}`;
  if (!wrongs.length) { el('wrong-review').innerHTML = '<div style="text-align:center;padding:3rem;font-size:48px">🎉</div>'; return; }
  const LTR = ['A','B','C','D'];
  el('wrong-review').innerHTML = wrongs.map(({ q, i, userAns }, wi) => {
    const yt = userAns !== null ? `${LTR[userAns]}) ${q.opts[userAns]}` : 'Cavabsız';
    return `<div class="wrong-item">
      <div class="wrong-item-num">Sual ${i+1} &nbsp;|&nbsp; Səhv #${wi+1} &nbsp;|&nbsp; ${q._subject}</div>
      <div class="wrong-q">${q.q}</div>
      <div class="answer-compare">
        <div class="ans-box ans-yours"><div class="ans-box-label">${'Sizin cavab'}</div>${yt}</div>
        <div class="ans-box ans-correct"><div class="ans-box-label">${'Doğru cavab'}</div>${LTR[q.ans]}) ${q.opts[q.ans]}</div>
      </div>
      <div class="explanation-box">${q.exp}</div>
    </div>`;
  }).join('');
}

function buildFullReview(qs) {
  const LTR = ['A','B','C','D'];
  el('q-review').innerHTML = qs.map((q, i) => {
    const ok  = ST.answers[i] === q.ans;
    const ans = ST.answers[i] !== null ? `${LTR[ST.answers[i]]}) ${q.opts[ST.answers[i]]}` : 'Cavabsız';
    return `<div class="rev-item">
      <span class="rev-badge ${ok?'ok':'no'}">${ok?'✓ '+'Doğru':'✗ '+'Yanlış'}</span>
      <div class="rev-q">${i+1}. ${q.q}</div>
      <div class="rev-yours">${'Sizin cavab'}: <strong>${ans}</strong></div>
      ${!ok ? `<div class="rev-correct">${'Doğru cavab'}: <strong>${LTR[q.ans]}) ${q.opts[q.ans]}</strong></div>` : ''}
      <div class="rev-exp">${q.exp}</div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   AI SUAL GENERATORU
   PDF/TXT yüklə → mətn çıxar → Claude API ilə yeni suallar yarat
   ══════════════════════════════════════ */

// Fayl yükləndi
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) { alert('Fayl 5MB-dan böyükdür. Daha kiçik fayl seçin.'); return; }

  el('file-info').style.display = 'block';
  el('file-info').textContent   = `📄 ${file.name} (${(file.size/1024).toFixed(1)} KB) — oxunur...`;

  const reader = new FileReader();
  reader.onload = async (e) => {
    let text = '';
    if (file.name.endsWith('.pdf')) {
      // PDF-i base64 kimi göndər, Claude API oxuyacaq
      ST.uploadedText = e.target.result; // base64
      ST.uploadedFileName = file.name;
      ST.uploadedIsBase64 = true;
    } else {
      // TXT, HTML, vs — birbaşa mətn
      text = e.target.result;
      ST.uploadedText     = text.slice(0, 15000); // ilk 15k simvol
      ST.uploadedFileName = file.name;
      ST.uploadedIsBase64 = false;
    }
    el('file-info').textContent = `✓ ${file.name} — hazır`;
    el('file-info').style.background  = 'var(--green-bg)';
    el('file-info').style.borderColor = 'var(--green)';
    el('file-info').style.color       = 'var(--green-dk)';
    show('gen-step-2');
  };

  if (file.name.endsWith('.pdf')) {
    reader.readAsDataURL(file); // base64 PDF
  } else {
    reader.readAsText(file, 'UTF-8');
  }
}

// Parametr seçimi
function selectParam(chip, groupId) {
  el(groupId).querySelectorAll('.param-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

function getParam(groupId) {
  const active = el(groupId).querySelector('.param-chip.active');
  return active ? active.dataset.val : null;
}

// Sualları yarat — Claude API
async function generateQuestions() {
  if (!ST.uploadedText) { alert('Əvvəlcə fayl yükləyin.'); return; }

  const count = getParam('count-chips') || '10';
  const diff  = getParam('diff-chips')  || 'qarışıq';
  const lang  = getParam('lang-chips')  || 'Azərbaycan dilində';

  show('gen-step-3');
  hide('gen-step-2');
  hide('gen-step-4');

  const loadingTexts = [
    'Mətn analiz edilir...',
    'Mövzular müəyyənləşdirilir...',
    'Suallar yaradılır...',
    'Cavablar formalaşdırılır...',
    'Yekun yoxlama aparılır...'
  ];
  let li = 0;
  const ltInterval = setInterval(() => {
    if (el('gen-loading-text')) el('gen-loading-text').textContent = loadingTexts[li++ % loadingTexts.length];
  }, 2000);

  try {
    let messages;

    if (ST.uploadedIsBase64) {
      // PDF olarsa — document kimi göndər
      const base64Data = ST.uploadedText.split(',')[1]; // data:application/pdf;base64,XXX → XXX
      messages = [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64Data }
          },
          {
            type: 'text',
            text: buildPrompt(count, diff, lang)
          }
        ]
      }];
    } else {
      messages = [{
        role: 'user',
        content: `Aşağıdakı mətnə əsasən ${buildPrompt(count, diff, lang)}\n\nMƏTN:\n${ST.uploadedText}`
      }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages
      })
    });

    if (!response.ok) throw new Error(`API xətası: ${response.status}`);

    const data = await response.json();
    const rawText = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    clearInterval(ltInterval);
    parseAndShowGenQuestions(rawText, count);
  } catch (err) {
    clearInterval(ltInterval);
    console.error(err);
    hide('gen-step-3');
    show('gen-step-2');
    alert(`Xəta baş verdi: ${err.message}\n\nZəhmət olmasa yenidən cəhd edin.`);
  }
}

function buildPrompt(count, diff, lang) {
  return `Bu mətndən ilhamlanaraq ${count} ədəd çoxseçimli test sualı yarat.

Tələblər:
- Hər sual yuxarıdakı mətndəki mövzularla əlaqəli TAMAMILƏ YENİ sual olsun
- 4 variant (A, B, C, D)
- Çətinlik: ${diff}
- Dil: ${lang}
- Hər suala qısa izahat əlavə et

Cavabı YALNIZ aşağıdakı JSON formatında ver, başqa heç nə yazma:
[
  {
    "q": "Sualın mətni",
    "opts": ["A variantı", "B variantı", "C variantı", "D variantı"],
    "ans": 0,
    "exp": "İzahat mətni"
  }
]

"ans" — doğru cavabın indeksi (0-3).`;
}

function parseAndShowGenQuestions(rawText, expectedCount) {
  hide('gen-step-3');
  let questions = [];
  try {
    // JSON blokunu tap
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSON tapılmadı');
    questions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(questions) || !questions.length) throw new Error('Boş massiv');
    // Hər sualı yoxla
    questions = questions.filter(q =>
      q.q && Array.isArray(q.opts) && q.opts.length === 4 &&
      typeof q.ans === 'number' && q.ans >= 0 && q.ans <= 3
    ).map(q => ({
      ...q,
      _subject: ST.uploadedFileName || 'PDF sualı',
      _topic:   'AI yaratdı',
      bal:      10
    }));
    if (!questions.length) throw new Error('Keçərli sual tapılmadı');
  } catch (e) {
    show('gen-step-2');
    alert(`Suallar parse edilə bilmədi: ${e.message}\nYenidən cəhd edin.`);
    return;
  }

  ST.genQuestions = questions;
  const LTR = ['A','B','C','D'];

  el('gen-result-count').textContent = `${questions.length} yeni sual yaradıldı`;
  el('gen-questions-list').innerHTML = questions.map((q, i) => `
    <div class="gen-q-item">
      <div class="gen-q-num">Sual ${i+1} &nbsp;•&nbsp; ${q._subject}</div>
      <div class="gen-q-text">${q.q}</div>
      <div class="gen-opts">
        ${q.opts.map((o, oi) => `
          <div class="gen-opt ${oi===q.ans?'correct':''}">
            <div class="gen-opt-ltr">${LTR[oi]}</div>
            ${o}
          </div>`).join('')}
      </div>
      <div class="gen-exp">${q.exp || ''}</div>
    </div>`).join('');

  show('gen-step-4');
}

// Yaradılmış suallarla sınaq başlat
function startGenQuiz() {
  if (!ST.genQuestions || !ST.genQuestions.length) { alert('Sual yoxdur!'); return; }
  launchQuiz([...ST.genQuestions]);
}

// Generatoru sıfırla
function resetGenerator() {
  ST.genQuestions     = [];
  ST.uploadedText     = '';
  ST.uploadedFileName = '';
  ST.uploadedIsBase64 = false;
  if (el('pdf-file-input'))    el('pdf-file-input').value  = '';
  if (el('file-info'))         { hide('file-info'); el('file-info').textContent = ''; }
  if (el('gen-step-2'))        hide('gen-step-2');
  if (el('gen-step-3'))        hide('gen-step-3');
  if (el('gen-step-4'))        hide('gen-step-4');
  if (el('upload-zone'))       el('upload-zone').style.borderColor = '';
}

/* ──────────────────────────────────────
   TAB / EKRAN / KÖMƏKÇILƏR
────────────────────────────────────── */
function switchResTab(n) {
  document.querySelectorAll('.res-tab').forEach((t, i) => t.classList.toggle('active', i===n));
  [0,1,2,3].forEach(i => {
    const e = document.getElementById(`rtab-${i}`);
    if (e) e.classList.toggle('hidden', i!==n);
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() { stopTimer(); showScreen('s-home'); }

const el   = id => document.getElementById(id);
const show = id => { const e = el(id); if (e) e.style.display = ''; };
const hide = id => { const e = el(id); if (e) e.style.display = 'none'; };

/* ──────────────────────────────────────
   BAŞLANĞIC
────────────────────────────────────── */

/* ── TEMA ── */
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('az_theme', isLight ? 'light' : 'dark');
  const btn = el('theme-btn');
  if (btn) btn.textContent = isLight ? '☀️' : '🌙';
}

function applyTheme() {
  if (localStorage.getItem('az_theme') === 'light') {
    document.documentElement.classList.add('light');
  }
}


/* ══════════════════════════════════════════
   ADMİN — sabit hesab (admin / admin123)
══════════════════════════════════════════ */
async function initAdmin() {
  await initFirebase();
  // localStorage-dan Firebase-ə köç (əgər Firebase varsa)
  if (_db) {
    await migrateLocalToFirebase();
  }
  const users = getUsers();
  if (!users['admin']) {
    users['admin'] = { name:'Administrator', grade:'admin', role:'admin', pass:'admin123', history:[] };
    saveUsers(users);
    if (_db) await FBUsers.save('admin', users['admin']);
  }
}

async function migrateLocalToFirebase() {
  try {
    const fbUsers = await FBUsers.getAll();
    const localUsers = JSON.parse(localStorage.getItem('az_users') || '{}');
    // Firebase boşdursa və local varsa → Firebase-ə köç
    if (Object.keys(fbUsers).length === 0 && Object.keys(localUsers).length > 0) {
      await FBUsers.saveAll(localUsers);
      console.log('LocalStorage → Firebase köçürüldü');
    } else if (Object.keys(fbUsers).length > 0) {
      // Firebase dolubsa → local-a da yaz (oflayn dəstək)
      localStorage.setItem('az_users', JSON.stringify(fbUsers));
    }
  } catch(e) { console.warn('Migrate error:', e); }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initAdmin();
  applyTheme();
  const btn = el('theme-btn');
  if (btn) btn.textContent = document.documentElement.classList.contains('light') ? '☀️' : '🌙';
  const cu = getCurUser();
  if (cu) {
    enterApp();
  } else {
    showScreen('s-auth');
    const hasUsers = Object.keys(getUsers()).length > 0;
    switchAuth(hasUsers ? 'login' : 'register');
  }
});