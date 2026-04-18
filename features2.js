/* ══════════════════════════════════════════
   📄 PDF NƏTİCƏ — jsPDF ilə
══════════════════════════════════════════ */
function downloadResultPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const cu  = getCurUser();
    const qs  = ST.questions;
    const ans = ST.answers;
    if (!qs || !qs.length) { alert('Nəticə yoxdur.'); return; }

    const correct = ans.filter((a,i) => a === qs[i].ans).length;
    const pct     = Math.round(correct/qs.length*100);
    const bal700  = Math.round(correct/qs.length*700);
    const now     = new Date().toLocaleDateString('az-AZ');

    // Başlıq fonu
    doc.setFillColor(79, 142, 247);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFillColor(123, 92, 245);
    doc.rect(150, 0, 60, 42, 'F');

    doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold');
    doc.setFontSize(20);
    doc.text('Mekteb Sinagi', 14, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica','normal');
    doc.text('Sinaq Neticesi', 14, 25);
    doc.text(now, 14, 32);

    // Böyük bal
    doc.setFontSize(28);
    doc.setFont('helvetica','bold');
    doc.text(String(bal700), 168, 20, {align:'center'});
    doc.setFontSize(11);
    doc.setFont('helvetica','normal');
    doc.text('/ 700 bal', 168, 28, {align:'center'});
    doc.text(pct + '%', 168, 35, {align:'center'});

    // Şagird məlumatı
    doc.setTextColor(30,34,56);
    doc.setFontSize(13);
    doc.setFont('helvetica','bold');
    doc.text(cu ? cu.name : 'Şagird', 14, 54);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.setTextColor(100,110,140);
    doc.text((cu ? cu.grade + '-ci sinif  •  ' : '') + correct + '/' + qs.length + ' dogru', 14, 61);

    // Xətt
    doc.setDrawColor(220,224,255);
    doc.setLineWidth(0.5);
    doc.line(14, 66, 196, 66);

    // Statistika qutular
    const stats = [
      { label:'Dogru', val: correct, clr:[34,197,94] },
      { label:'Yanlis', val: qs.length-correct, clr:[239,68,68] },
      { label:'Bal', val: bal700, clr:[79,142,247] },
      { label:'Faiz', val: pct+'%', clr:[245,158,11] }
    ];
    stats.forEach((s, i) => {
      const x = 14 + i*46;
      doc.setFillColor(...s.clr);
      doc.roundedRect(x, 70, 42, 18, 3, 3, 'F');
      doc.setTextColor(255,255,255);
      doc.setFont('helvetica','bold');
      doc.setFontSize(14);
      doc.text(String(s.val), x+21, 81, {align:'center'});
      doc.setFontSize(8);
      doc.setFont('helvetica','normal');
      doc.text(s.label, x+21, 86, {align:'center'});
    });

    // Sual nəticələri cədvəli
    let y = 100;
    doc.setTextColor(30,34,56);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.text('Sual Netlicesi', 14, y);
    y += 6;

    const LTR = ['A','B','C','D'];
    qs.forEach((q, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const ok = ans[i] === q.ans;
      const clr = ok ? [34,197,94] : [239,68,68];

      doc.setFillColor(...clr, 30);
      doc.roundedRect(14, y, 182, 14, 2, 2, 'F');

      doc.setFillColor(...clr);
      doc.roundedRect(14, y, 7, 14, 2, 2, 'F');

      doc.setTextColor(255,255,255);
      doc.setFont('helvetica','bold');
      doc.setFontSize(8);
      doc.text(ok ? '✓' : '✗', 17.5, y+9, {align:'center'});

      doc.setTextColor(30,34,56);
      doc.setFont('helvetica','normal');
      doc.setFontSize(8);
      const qtext = String(i+1) + '. ' + (q.q || '').substring(0, 65) + ((q.q||'').length>65?'...':'');
      doc.text(qtext, 24, y+6);

      const yourAns = ans[i]!==null ? LTR[ans[i]]+') '+((q.opts||[])[ans[i]]||'').substring(0,20) : 'Cavabsiz';
      const corrAns = LTR[q.ans]+') '+((q.opts||[])[q.ans]||'').substring(0,20);
      doc.setTextColor(100,110,140);
      doc.setFontSize(7);
      doc.text('Siz: '+yourAns + '   Dogru: '+corrAns, 24, y+11);

      y += 17;
    });

    // Footer
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setDrawColor(220,224,255);
    doc.line(14, y+5, 196, y+5);
    doc.setTextColor(160,170,200);
    doc.setFontSize(8);
    doc.text('Mekteb Sinagi Platformasi  •  ' + now, 105, y+12, {align:'center'});

    doc.save('sinaq_neticesi_' + (cu?.name||'sagird').replace(/ /g,'_') + '_' + now.replace(/\./g,'-') + '.pdf');
  } catch(e) {
    console.error('PDF xətası:', e);
    alert('PDF yaratmaq üçün internet bağlantısı lazımdır (jsPDF kitabxanası).');
  }
}

/* ══════════════════════════════════════════
   🎯 GÜNLÜk STREAK + HƏFTƏLİK HƏDƏF
══════════════════════════════════════════ */
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d-jan1)/86400000 + jan1.getDay()+1)/7);
  return `${d.getFullYear()}-W${week}`;
}

function updateDailyStreak(username) {
  const users = getUsers();
  const u = users[username]; if (!u) return;
  if (!u.streak) u.streak = { count:0, lastDay:'', weekExams:0, weekKey:'', totalDays:0 };

  const today   = getTodayKey();
  const weekKey = getWeekKey();
  const s       = u.streak;

  // Həftəlik sınaq sayacı
  if (s.weekKey !== weekKey) { s.weekExams = 0; s.weekKey = weekKey; }
  s.weekExams++;

  // Günlük streak
  if (s.lastDay === today) {
    // Bu gün artıq sınaq yazılıb — streak artmır, amma weekExams artdı
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth()+1}-${yesterday.getDate()}`;
    if (s.lastDay === yKey) {
      s.count++;          // Ardıcıl gün
    } else if (s.lastDay !== today) {
      s.count = 1;        // Fasilə — sıfırla
    }
    s.lastDay = today;
    s.totalDays = (s.totalDays||0) + 1;
  }

  users[username].streak = s;
  saveUsers(users);
  if (_db) FBUsers.save(username, users[username]).catch(()=>{});
  showStreakBadge(s);
}

function showStreakBadge(s) {
  if (!s || s.count < 2) return;
  const badge = document.createElement('div');
  badge.className = 'streak-toast';
  badge.innerHTML = `🔥 ${s.count} gün ardıcıl! <span style="font-weight:700">${s.count >= 7 ? '⭐ Həftəlik!' : ''}</span>`;
  document.body.appendChild(badge);
  setTimeout(() => badge.style.opacity = '1', 50);
  setTimeout(() => { badge.style.opacity = '0'; setTimeout(()=>badge.remove(), 500); }, 3000);
}

function renderStreakWidget() {
  const cu = getCurUser(); if (!cu) return '';
  const users = getUsers();
  const s = users[cu.username]?.streak || { count:0, weekExams:0 };

  const weekGoal    = users[cu.username]?.weekGoal || 5;
  const weekPct     = Math.min(100, Math.round((s.weekExams||0)/weekGoal*100));
  const daysToGoal  = Math.max(0, weekGoal - (s.weekExams||0));

  return `<div class="streak-widget">
    <div class="streak-row">
      <div class="streak-item">
        <div class="streak-icon">🔥</div>
        <div class="streak-num">${s.count||0}</div>
        <div class="streak-label">Günlük streak</div>
      </div>
      <div class="streak-item">
        <div class="streak-icon">📅</div>
        <div class="streak-num">${s.weekExams||0}/${weekGoal}</div>
        <div class="streak-label">Bu həftə</div>
      </div>
      <div class="streak-item">
        <div class="streak-icon">📊</div>
        <div class="streak-num">${s.totalDays||0}</div>
        <div class="streak-label">Cəmi gün</div>
      </div>
    </div>
    <div class="streak-progress-wrap">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--txt3);margin-bottom:5px">
        <span>Həftəlik hədəf: ${weekGoal} sınaq</span>
        <span>${daysToGoal > 0 ? daysToGoal + ' qalır' : '✅ Hədəfə çatdı!'}</span>
      </div>
      <div class="streak-bar-bg">
        <div class="streak-bar-fill" style="width:${weekPct}%;background:${weekPct>=100?'var(--green)':'linear-gradient(90deg,var(--acc),var(--acc2))'}"></div>
      </div>
    </div>
    <div style="margin-top:.75rem;display:flex;align-items:center;gap:8px">
      <span style="font-size:12px;color:var(--txt3)">Hədəfi dəyiş:</span>
      ${[3,5,7,10].map(n=>`<button class="param-chip ${weekGoal===n?'active':''}" onclick="setWeekGoal(${n})">${n}</button>`).join('')}
    </div>
  </div>`;
}

function setWeekGoal(n) {
  const cu = getCurUser(); if (!cu) return;
  const users = getUsers();
  users[cu.username].weekGoal = n;
  saveUsers(users);
  if (_db) FBUsers.save(cu.username, users[cu.username]).catch(()=>{});
  // Streak widget-i yenilə
  const sw = document.getElementById('streak-section');
  if (sw) sw.innerHTML = renderStreakWidget();
}

/* ══════════════════════════════════════════
   � SINIF — FƏN XRİTƏSİ
══════════════════════════════════════════ */
const GRADE_SUBJECTS = {
  '1': ['Azərbaycan dili', 'Riyaziyyat', 'Təbiət Tarixi'],
  '2': ['Azərbaycan dili', 'Riyaziyyat', 'Təbiət Tarixi'],
  '3': ['Azərbaycan dili', 'Riyaziyyat', 'Təbiət Tarixi', 'Coğrafiya'],
  '4': ['Azərbaycan dili', 'Riyaziyyat', 'Tarix', 'Coğrafiya'],
  '5': ['Azərbaycan dili', 'Riyaziyyat', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '6': ['Azərbaycan dili', 'Riyaziyyat', 'Fizika', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '7': ['Azərbaycan dili', 'Cəbr', 'Həndəsə', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '8': ['Azərbaycan dili', 'Cəbr', 'Həndəsə', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '9': ['Azərbaycan dili', 'Cəbr', 'Həndəsə', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '10': ['Azərbaycan dili', 'Cəbr', 'Həndəsə', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili'],
  '11': ['Azərbaycan dili', 'Cəbr', 'Həndəsə', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'İngilis dili']
};

function getSubjectsForGrade(grade) {
  return GRADE_SUBJECTS[grade] || [];
}

/* ══════════════════════════════════════════
   📋 SINAQ VER SİSTEMİ (Supabase ilə)
══════════════════════════════════════════ */

/* Müəllim — sınaq yarat (Supabase-ə) */
function showCreateExam() {
  const modal = el('modal-sinaq');
  if (!modal) return;
  
  const users    = getUsers();
  const students = Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');
  const grades   = [...new Set(students.map(([,u])=>u.grade))].filter(Boolean).sort((a,b)=>+a-+b);

  const content = el('sinaq-form-content');
  if (!content) return;

  content.innerHTML = `
    <div class="field-group">
      <label>Sınaq Adı</label>
      <input type="text" id="exam-title" placeholder="məs: 5-ci sinif Riyaziyyat Sınaği">
    </div>
    <div class="field-group">
      <label>Hədəf Sinif</label>
      <select id="exam-grade" onchange="updateExamSubjects()">
        <option value="">Sinif seçin...</option>
        ${grades.map(g=>`<option value="${g}">${g}-ci sinif</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label>Fənn</label>
      <select id="exam-subject">
        <option value="">Əvvəlcə sinif seçin...</option>
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="field-group">
        <label>Suallarin Sayı</label>
        <input type="number" id="exam-question-count" placeholder="10" value="10" min="1" max="100">
      </div>
      <div class="field-group">
        <label>Çətinlik Səviyyəsi</label>
        <select id="exam-difficulty">
          <option value="asan">Asan</option>
          <option value="orta" selected>Orta</option>
          <option value="çətin">Çətin</option>
        </select>
      </div>
    </div>
    <div class="field-group">
      <label>Son Tarix</label>
      <input type="date" id="exam-deadline" min="${new Date().toISOString().split('T')[0]}">
    </div>
    <div class="field-group">
      <label>Qeydlər (istəyə bağlı)</label>
      <textarea id="exam-note" placeholder="Əlavə məlumat..." style="width:100%;padding:8px;border:1px solid var(--bd);border-radius:8px;background:var(--surface);color:var(--txt);font-family:inherit;min-height:80px"></textarea>
    </div>
    
    <div class="field-group">
      <label>Sualları Qeyd edin (JSON formatı)</label>
      <textarea id="exam-questions" placeholder='[{"q":"Sual?","opts":["A","B","C","D"],"ans":0,"topic":"Mövzu"}]' style="width:100%;padding:8px;border:1px solid var(--bd);border-radius:8px;background:var(--surface);color:var(--txt);font-family:monospace;min-height:120px"></textarea>
    </div>
    <div class="auth-error" id="exam-err"></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1rem">
      <button class="btn" onclick="closeCreateExam()">Ləğv et</button>
      <button class="btn-start small" onclick="createExam()">Sınaq Yaradın</button>
    </div>
  `;
  
  modal.style.display = 'flex';
}

function updateExamSubjects() {
  const grade = el('exam-grade').value;
  const subjects = getSubjectsForGrade(grade);
  const select = el('exam-subject');
  select.innerHTML = `<option value="">Fənn seçin...</option>${subjects.map(s=>`<option>${s}</option>`).join('')}`;
}

function closeCreateExam() {
  const modal = el('modal-sinaq');
  if (modal) modal.style.display = 'none';
}

async function createExam() {
  const title    = el('exam-title')?.value.trim();
  const grade    = el('exam-grade')?.value;
  const subject  = el('exam-subject')?.value;
  const qCount   = el('exam-question-count')?.value || 10;
  const difficulty = el('exam-difficulty')?.value || 'orta';
  const deadline = el('exam-deadline')?.value;
  const note     = el('exam-note')?.value.trim();
  const qText    = el('exam-questions')?.value.trim();
  const err      = el('exam-err');
  const cu       = getCurUser();

  if (!title || !grade || !subject || !deadline) { 
    err.textContent = 'Başlıq, sinif, fənn və son tarix mütləqdir.'; 
    return; 
  }

  let questions = [];
  try {
    if (qText) {
      questions = JSON.parse(qText);
      if (!Array.isArray(questions)) throw new Error('Suallar massiv olmalıdır');
    }
  } catch(e) {
    err.textContent = 'Sual formatı səhvdir: ' + e.message;
    return;
  }

  const exam = { 
    title, grade, subject, qCount, difficulty, deadline, note,
    teacherName: cu.name, 
    teacherId: cu.username,
    questions: questions,
    createdAt: Date.now(), 
    active: true 
  };

  // localStorage-a yaz
  const exams = JSON.parse(localStorage.getItem('az_exams')||'{}');
  const examId = 'exam_' + Date.now();
  exams[examId] = exam;
  localStorage.setItem('az_exams', JSON.stringify(exams));

  // Supabase-ə yaz
  if (window.supabase && window.supabase.createExam) {
    try {
      const result = await window.supabase.createExam({
        ...exam,
        id: examId
      });
      console.log('✓ Supabase-ə əlavə edildi:', result);
    } catch(e) { 
      console.log('ℹ️ Supabase xətası (lokal rejim istifadə olunur):', e.message); 
    }
  }

  err.style.color = 'var(--green)';
  err.textContent = '✓ Sınaq uğurla yaradıldı!';
  setTimeout(() => {
    closeCreateExam();
    renderExams(document.getElementById('t-exams-list'));
  }, 1000);
}

function renderExams(box) {
  if (!box) return;
  
  const exams = JSON.parse(localStorage.getItem('az_exams')||'{}');
  const users = getUsers();
  const examList = Object.entries(exams).sort((a,b) => b[1].createdAt - a[1].createdAt);

  if (!examList.length) {
    box.innerHTML = `<p style="color:var(--txt2);font-size:14px;padding:1.5rem 0;text-align:center">Hələ sınaq verilməyib.</p>`;
    return;
  }

  box.innerHTML = examList.map(([examId, exam]) => {
    const today = new Date().toISOString().split('T')[0];
    const overdue = exam.deadline < today;
    
    return `<div class="hw-card">
      <div class="hw-card-head">
        <div>
          <div class="hw-card-title">📋 ${exam.title}</div>
          <div class="hw-card-meta">${exam.subject} · ${exam.grade}-ci sinif · Suallarin sayı: ${exam.questions?.length || 0}</div>
          <div class="hw-card-meta" style="font-size:12px;color:var(--txt3)">Çətinlik: ${exam.difficulty} | Son tarix: ${exam.deadline}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button class="btn" onclick="previewExamQuestions('${examId}')" style="font-size:11px;padding:5px 10px">Suallar</button>
          <button class="btn" onclick="deleteExamOverride('${examId}')" style="font-size:11px;padding:5px 10px;color:var(--red);border-color:rgba(239,68,68,.3)">Sil</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function previewExamQuestions(examId) {
  const exams = JSON.parse(localStorage.getItem('az_exams')||'{}');
  const exam = exams[examId];
  const qs = exam?.questions || [];
  
  const html = `
    <div style="padding:1rem;background:var(--surface);border:1px solid var(--bd);border-radius:var(--r);margin-top:0.5rem">
      <div style="margin-bottom:1rem;font-weight:600;color:var(--acc)">${exam?.title}</div>
      ${qs.length === 0 ? '<p style="color:var(--txt3)">Suallar yoxdur.</p>' : qs.map((q, i) => `
        <div style="margin-bottom:1rem;padding:0.75rem;background:var(--bg3);border-left:3px solid var(--acc);border-radius:4px">
          <div style="font-weight:600;margin-bottom:0.5rem">${i+1}. ${q.q || q.question_text}</div>
          ${q.opts || q.options ? `<div style="margin-bottom:0.5rem;font-size:13px">
            ${(q.opts || q.options).map((opt, j) => `<div style="color:${j === q.ans || j === q.correct_answer ? 'var(--green)' : 'var(--txt3)'}">
              ${j === q.ans || j === q.correct_answer ? '✓' : '○'} ${opt}
            </div>`).join('')}
          </div>` : ''}
          ${q.topic ? `<div style="font-size:12px;color:var(--txt3)">📌 Mövzu: ${q.topic}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
  
  alert('Suallar:\n\n' + qs.map((q, i) => `${i+1}. ${q.q || q.question_text}`).join('\n'));
}

async function deleteExamOverride(examId) {
  if (!confirm('Bu sınaqlı silməkdə əminsiniz?')) return;
  
  const exams = JSON.parse(localStorage.getItem('az_exams')||'{}');
  delete exams[examId];
  localStorage.setItem('az_exams', JSON.stringify(exams));
  
  // Supabase-dən sil
  if (window.supabase && window.supabase.deleteExam) {
    try {
      await window.supabase.deleteExam(examId);
    } catch(e) { console.log('Supabase silmə xətası:', e); }
  }
  
  showToast('✓ Sınaq uğurla silindi', 'green');
  renderExams(document.getElementById('t-exams-list'));
}

/* ══════════════════════════════════════════
   �📚 ÖDEV SİSTEMİ
══════════════════════════════════════════ */

/* Müəllim — ödev yarat */
function showCreateHomework() {
  const modal = el('modal-homework');
  if (!modal) return;
  
  const users    = getUsers();
  const students = Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');
  const grades   = [...new Set(students.map(([,u])=>u.grade))].filter(Boolean).sort((a,b)=>+a-+b);

  const content = el('homework-form-content');
  if (!content) return;

  content.innerHTML = `
    <div class="field-group">
      <label>Ödev Başlığı</label>
      <input type="text" id="hw-title" placeholder="məs: 5-ci sinif Riyaziyyat Ödəvi">
    </div>
    <div class="field-group">
      <label>Hədəf Sinif</label>
      <select id="hw-grade" onchange="updateHomeworkSubjects()">
        <option value="">Sinif seçin...</option>
        ${grades.map(g=>`<option value="${g}">${g}-ci sinif</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label>Fənn</label>
      <select id="hw-subject">
        <option value="">Əvvəlcə sinif seçin...</option>
      </select>
    </div>
    <div class="field-group">
      <label>Söhbət / Tapşırıq</label>
      <textarea id="hw-task" placeholder="Şagirdlərin etməli olduqları tapşırığı qeyd edin..." style="width:100%;padding:8px;border:1px solid var(--bd);border-radius:8px;background:var(--surface);color:var(--txt);font-family:inherit;min-height:100px"></textarea>
    </div>
    <div class="field-group">
      <label>Son Tarix</label>
      <input type="date" id="hw-deadline" min="${new Date().toISOString().split('T')[0]}">
    </div>
    <div class="auth-error" id="hw-err"></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1rem">
      <button class="btn" onclick="closeCreateHomework()">Ləğv et</button>
      <button class="btn-start small" onclick="createHomework()">Ödev Ver</button>
    </div>
  `;
  
  modal.style.display = 'flex';
}

function updateHomeworkSubjects() {
  const grade = el('hw-grade').value;
  const subjects = getSubjectsForGrade(grade);
  const select = el('hw-subject');
  select.innerHTML = `<option value="">Fənn seçin...</option>${subjects.map(s=>`<option>${s}</option>`).join('')}`;
}

function closeCreateHomework() {
  const modal = el('modal-homework');
  if (modal) modal.style.display = 'none';
}

async function createHomework() {
  const title    = el('hw-title')?.value.trim();
  const grade    = el('hw-grade')?.value;
  const deadline = el('hw-deadline')?.value;
  const subject  = el('hw-subject')?.value;
  const task     = el('hw-task')?.value.trim();
  const err      = el('hw-err');
  const cu       = getCurUser();

  if (!title || !deadline || !subject || !task) { 
    err.textContent = 'Başlıq, fənn, tapşırıq və son tarix mütləqdir.'; 
    return; 
  }

  const hw = { 
    title, grade, deadline, subject, task,
    teacherName: cu.name, 
    teacherId: cu.username,
    createdAt: Date.now(), 
    active: true,
    type: 'homework'
  };

  // localStorage-a yaz
  const hws = JSON.parse(localStorage.getItem('az_homework')||'{}');
  const hwId = 'hw_' + Date.now();
  hws[hwId] = hw;
  localStorage.setItem('az_homework', JSON.stringify(hws));

  err.style.color = 'var(--green)';
  err.textContent = '✓ Ödev uğurla verildi!';
  setTimeout(() => {
    closeCreateHomework();
    renderHomeworkResults(document.getElementById('t-homework-list'));
  }, 1000);
}

/* Şagird — ödevlərini gör */
function getHomeworks() {
  return JSON.parse(localStorage.getItem('az_homework')||'{}');
}

function getMyHomeworks() {
  const cu  = getCurUser(); if (!cu) return [];
  const hws = getHomeworks();
  return Object.entries(hws)
    .filter(([,hw]) => hw.active && (hw.grade === 'all' || hw.grade === cu.grade))
    .map(([id,hw]) => ({id, ...hw}))
    .sort((a,b) => a.deadline.localeCompare(b.deadline));
}

function getHomeworkResults(hwId) {
  const res = JSON.parse(localStorage.getItem('az_hw_results')||'{}');
  return res[hwId] || {};
}

function checkHomeworkCompletion(username, examEntry) {
  const cu = getCurUser(); if (!cu) return;
  const hws = getMyHomeworks();
  const today = new Date().toISOString().split('T')[0];

  hws.forEach(hw => {
    if (hw.deadline < today) return;
    if (hw.subject && examEntry.label && !examEntry.label.includes(hw.subject)) return;

    // Bu sınaq ödev üçün sayılır
    const res = JSON.parse(localStorage.getItem('az_hw_results')||'{}');
    if (!res[hw.id]) res[hw.id] = {};
    if (!res[hw.id][username]) {
      res[hw.id][username] = { bal700: examEntry.bal700, pct: examEntry.pct, date: examEntry.date };
      localStorage.setItem('az_hw_results', JSON.stringify(res));

      // Bildiriş
      showToast('📚 "' + hw.title + '" ödevi tamamlandı!', 'green');
    }
  });
}

function renderHomeworkWidget() {
  const hws = getMyHomeworks();
  if (!hws.length) return '';
  const today = new Date().toISOString().split('T')[0];

  return `<div class="hw-widget">
    <div class="hw-widget-title">📚 Ödevlər</div>
    ${hws.slice(0,5).map(hw => {
      const res     = getHomeworkResults(hw.id);
      const cu      = getCurUser();
      const done    = cu && res[cu.username];
      const overdue = hw.deadline < today;
      const daysLeft = Math.ceil((new Date(hw.deadline) - new Date()) / 86400000);

      return `<div class="hw-item${done ? ' hw-done' : overdue ? ' hw-overdue' : ''}">
        <div class="hw-item-icon">${done ? '✅' : overdue ? '❌' : '📝'}</div>
        <div class="hw-item-info">
          <div class="hw-item-title">${hw.title}</div>
          <div class="hw-item-meta">${hw.subject} · ${overdue ? 'Müddəti bitib' : daysLeft===0 ? 'Bu gün!' : daysLeft+' gün qalır'}</div>
        </div>
        ${done ? `<div class="hw-item-score">${res[cu.username].bal700}/700</div>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

/* Müəllim — ödev nəticələrini gör */
function renderHomeworkResults(box) {
  const hws = getHomeworks();
  const users = getUsers();
  const hwList = Object.entries(hws).sort((a,b) => b[1].createdAt - a[1].createdAt);

  if (!hwList.length) {
    box.innerHTML = `<p style="color:var(--txt2);font-size:14px;padding:1.5rem 0;text-align:center">Hələ ödev verilməyib.</p>`;
    return;
  }

  box.innerHTML = hwList.map(([hwId, hw]) => {
    const today    = new Date().toISOString().split('T')[0];
    const overdue  = hw.deadline < today;
    const daysLeft = Math.ceil((new Date(hw.deadline) - new Date()) / 86400000);

    // Target students for this homework
    const students = hw.grade ? 
      Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin' && u.grade===hw.grade) 
      : Object.entries(users).filter(([,u]) => u.role!=='teacher' && u.role!=='admin');

    return `<div class="hw-card">
      <div class="hw-card-head">
        <div>
          <div class="hw-card-title">📚 ${hw.title}</div>
          <div class="hw-card-meta">${hw.subject} · ${hw.grade?hw.grade+'-ci sinif':'Bütün siniflər'}</div>
          <div class="hw-card-meta" style="font-size:12px;color:var(--txt3)">Son tarix: ${hw.deadline} (${overdue ? '❌ MÜDDƏTİ BİTİB' : daysLeft===0 ? 'Bu gün!' : daysLeft + ' gün qalır'})</div>
          <div style="padding:0.75rem 0;color:var(--txt2);font-size:13px;line-height:1.5">${hw.task || 'Tapşırıq açıklaması yoxdur'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          <button class="btn" onclick="deleteHomework('${hwId}')" style="font-size:11px;padding:5px 10px;color:var(--red);border-color:rgba(239,68,68,.3)">Sil</button>
        </div>
      </div>
      ${students.length > 0 ? `<div class="hw-results-list">
        <div style="font-size:12px;color:var(--txt3);margin-bottom:0.5rem">Hedef Şagirdlər: ${students.length}</div>
        ${students.slice(0, 5).map(([uname, u]) => {
          return `<div class="hw-result-row">
            <span class="hw-result-name">${u.name}</span>
            <span style="font-size:12px;color:var(--txt3)">📋 Atanmış</span>
          </div>`;
        }).join('')}
        ${students.length > 5 ? `<div style="font-size:11px;color:var(--txt3);padding:8px 0">... və daha ${students.length - 5} şagird</div>` : ''}
      </div>` : ''}
    </div>`;
  }).join('');
}

async function deleteHomework(hwId) {
  if (!confirm('Bu ödəvi silmək istəyirsiniz?')) return;
  const hws = JSON.parse(localStorage.getItem('az_homework')||'{}');
  delete hws[hwId];
  localStorage.setItem('az_homework', JSON.stringify(hws));
  
  showToast('✓ Ödev uğurla silindi', 'green');
  renderHomeworkResults(document.getElementById('t-homework-list'));
}

/* ── Ümumi toast bildiriş ── */
function showToast(msg, type='blue') {
  const colors = { green:'var(--green)', blue:'var(--acc)', red:'var(--red)', amber:'var(--amber)' };
  const t = document.createElement('div');
  t.className = 'streak-toast';
  t.style.borderColor = colors[type]||colors.blue;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.style.opacity = '1', 50);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 3500);
}