/* ═════════════════════════════════════════════════════
   backend/server.js — Express.js Backend
   
   QURAŞDIRMA:
   npm install express cors dotenv supabase
   npm start
═════════════════════════════════════════════════════ */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Supabase İnitialize
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ────────────────────────────────────────
// 📚 SINALLAR (EXAMS)
// ────────────────────────────────────────

// Sınaq Yaratma
app.post('/api/exams', async (req, res) => {
  try {
    const { title, grade, subject, deadline, difficulty, question_count, teacher_id } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({ error: 'Requried fields: title, subject, deadline' });
    }

    const { data, error } = await supabase
      .from('exams')
      .insert([{
        title,
        grade,
        subject,
        deadline,
        difficulty: difficulty || 'orta',
        question_count: question_count || 10,
        teacher_id,
        created_at: new Date().toISOString(),
        active: true
      }])
      .select();

    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Sınaqlı Sil
app.delete('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Suallərı sil
    await supabase
      .from('questions')
      .delete()
      .eq('exam_id', id);

    // Sınaqlı sil
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Sınaq silindi' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Sınaqlı Gət
app.get('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Müəllimin Sınaqlərini Gət
app.get('/api/teacher/:teacher_id/exams', async (req, res) => {
  try {
    const { teacher_id } = req.params;

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('teacher_id', teacher_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────
// ❓ SUALLAR (QUESTIONS)
// ────────────────────────────────────────

// Suallər Əlavə Et
app.post('/api/questions', async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array required' });
    }

    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Sınaqda Suallərı Gət
app.get('/api/exams/:exam_id/questions', async (req, res) => {
  try {
    const { exam_id } = req.params;

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', exam_id)
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────
// 📊 NƏTICƏLƏR (RESULTS)
// ────────────────────────────────────────

// Nəticə Saxla
app.post('/api/results', async (req, res) => {
  try {
    const { user_id, exam_id, score, max_score, percentage, answers } = req.body;

    const { data, error } = await supabase
      .from('results')
      .insert([{
        user_id,
        exam_id,
        score,
        max_score,
        percentage,
        answers: JSON.stringify(answers),
        completed_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Şagirdın Nəticələrini Gət
app.get('/api/user/:user_id/results', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', user_id)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────
// 🏥 HEALTH CHECK
// ────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend ✓' });
});

// ────────────────────────────────────────
// Server Başlat
// ────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  🚀 Backend Server Çalışıyor
  📍 http://localhost:${PORT}
  🔗 Supabase: ${process.env.SUPABASE_URL ? '✓ Bağlı' : '⚠️ Konfiqure Yoxdur'}
  `);
});
