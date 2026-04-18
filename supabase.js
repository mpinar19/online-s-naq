/* ═════════════════════════════════════════════════════
   supabase.js — Supabase Backend Entegrasyonu
   
   QURAŞDIRMA:
   1. https://supabase.com — yeni layihə yarat
   2. SQL Editor → run() aşağıdakı kodları
   3. API Key-i supabase.js-ə yapıştır
═════════════════════════════════════════════════════ */

// Supabase konfigürasyonu
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';

// Supabase'i əgər mövcud deyilsə dummy object-dən istifadə et
window.supabase = {
  isReady: false,
  
  async init() {
    if (SUPABASE_URL.includes('YOUR_PROJECT')) {
      console.log('ℹ️ Supabase konfiqure edilməyib — lokal rejim');
      return false;
    }
    try {
      // Supabase JS SDK yüklə
      if (!window.supabaseClient) {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabase.isReady = true;
        console.log('✓ Supabase bağlandı');
      }
      return true;
    } catch(e) {
      console.warn('⚠️ Supabase SDK yüklənə bilmədi:', e.message);
      return false;
    }
  },

  // ── Sınaq Əlavə Et
  async createExam(examData) {
    if (!window.supabaseClient) {
      console.log('Supabase mövcud deyil — localStorage istifadə olunur');
      return { id: 'local_' + Date.now(), ...examData };
    }

    try {
      const { data, error } = await window.supabaseClient
        .from('exams')
        .insert([{
          title: examData.title,
          grade: examData.grade,
          subject: examData.subject,
          deadline: examData.deadline,
          difficulty: examData.difficulty || 'orta',
          question_count: examData.question_count || 10,
          teacher_id: examData.teacherId,
          created_at: new Date().toISOString(),
          active: true
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch(e) {
      console.error('Sınaq yaratmada xəta:', e);
      throw e;
    }
  },

  // ── Suallər Əlavə Et
  async addQuestions(examId, questions) {
    if (!window.supabaseClient) {
      console.log('Supabase mövcud deyil — localStorage istifadə olunur');
      return questions.map((q, i) => ({ id: i, ...q }));
    }

    try {
      const questionsData = questions.map(q => ({
        exam_id: examId,
        question_text: q.q,
        options: JSON.stringify(q.opts),
        correct_answer: q.ans,
        explanation: q.exp,
        topic: q.topic,
        difficulty: q.difficulty || 'orta',
        points: q.bal || 10
      }));

      const { data, error } = await window.supabaseClient
        .from('questions')
        .insert(questionsData)
        .select();

      if (error) throw error;
      return data;
    } catch(e) {
      console.error('Suallər əlavə etdə xəta:', e);
      throw e;
    }
  },

  // ── Sınaqlı Sil
  async deleteExam(examId) {
    if (!window.supabaseClient) return;

    try {
      // Suallərı sil
      await window.supabaseClient
        .from('questions')
        .delete()
        .eq('exam_id', examId);

      // Sınaqlı sil
      const { error } = await window.supabaseClient
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;
    } catch(e) {
      console.error('Sınaq silinmə xətası:', e);
    }
  },

  // ── Sınaqlı Gət
  async getExam(examId) {
    if (!window.supabaseClient) return null;

    try {
      const { data, error } = await window.supabaseClient
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (error) throw error;
      return data;
    } catch(e) {
      console.error('Sınaq alınmada xəta:', e);
      return null;
    }
  },

  // ── Müəllimin Sınaqlərini Gət
  async getTeacherExams(teacherId) {
    if (!window.supabaseClient) return [];

    try {
      const { data, error } = await window.supabaseClient
        .from('exams')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch(e) {
      console.error('Müəllim sınaqlərini almada xəta:', e);
      return [];
    }
  },

  // ── Sınaqda Suallərı Gət
  async getExamQuestions(examId) {
    if (!window.supabaseClient) return [];

    try {
      const { data, error } = await window.supabaseClient
        .from('questions')
        .select('*')
        .eq('exam_id', examId)
        .order('id', { ascending: true });

      if (error) throw error;
      
      // Format-u önceki sisteme uyarla
      return (data || []).map(q => ({
        q: q.question_text,
        opts: JSON.parse(q.options || '[]'),
        ans: q.correct_answer,
        exp: q.explanation,
        bal: q.points,
        topic: q.topic
      }));
    } catch(e) {
      console.error('Suallər alınmada xəta:', e);
      return [];
    }
  },

  // ── Nəticə Saxla
  async saveResult(result) {
    if (!window.supabaseClient) return;

    try {
      const { error } = await window.supabaseClient
        .from('results')
        .insert([{
          user_id: result.userId,
          exam_id: result.examId,
          score: result.score,
          max_score: result.maxScore,
          percentage: result.percentage,
          answers: JSON.stringify(result.answers),
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch(e) {
      console.error('Nəticə saxlanmada xəta:', e);
    }
  }
};

// App başı Supabase-i başlat
async function initSupabase() {
  await window.supabase.init();
}
