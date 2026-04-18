# Məktəb Sınaği - Backend API

Express.js-də yazılmış backend API sistemi. Exams, questions, və student results-u idarə etmək üçün istifadə olunur.

## Setup Instructions

### 1. Supabase Layihəsini Yaradın
1. [supabase.com](https://supabase.com) saytına daxil olun
2. Yeni layihə yaradın
3. API URL və ANON_KEY-i kopyalayın

### 2. Verilənlər Bazası Cədvəllərini Yaradın

Supabase SQL editor-da aşağıdakı sorğuları çalıştırın:

```sql
-- Exams Table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  grade VARCHAR(2),
  subject TEXT NOT NULL,
  deadline DATE,
  difficulty VARCHAR(10),
  question_count INTEGER DEFAULT 10,
  teacher_id TEXT,
  created_at TIMESTAMP DEFAULT now(),
  active BOOLEAN DEFAULT true
);

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer INTEGER,
  explanation TEXT,
  topic TEXT,
  difficulty VARCHAR(10),
  points INTEGER DEFAULT 10
);

-- Results Table
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  score INTEGER,
  max_score INTEGER,
  percentage INTEGER,
  answers JSONB,
  completed_at TIMESTAMP DEFAULT now()
);
```

### 3. Environment Dəyişənlərini Tənzimləyin

1. `.env.example` faylını `.env` olaraq yenidən adlandırın
2. Supabase credentials-ələrini daxil edin:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
NODE_ENV=development
```

### 4. Asılılıqları Quraşdırın

```bash
npm install
```

### 5. Serveri Başladın

**İnkişaf modu:**
```bash
npm run dev
```

**Produksiya modu:**
```bash
npm start
```

Server `http://localhost:3000` adresində işləyəcəkdir.

## API Endpoints

### Exams

**Yeni imtahan yaradın**
```
POST /api/exams
{
  "title": "Biologiya Sınaği",
  "grade": "10",
  "subject": "Biologiya",
  "deadline": "2024-02-20",
  "question_count": 20,
  "difficulty": "orta",
  "teacher_id": "teacher123"
}
```

**Müəllimlə exams əldə edin**
```
GET /api/teacher/:teacher_id/exams
```

**Spesifik examı əldə edin**
```
GET /api/exams/:id
```

**Examı silin**
```
DELETE /api/exams/:id
```

### Questions

**Sualları əlavə edin**
```
POST /api/questions
{
  "exam_id": "uuid",
  "questions": [
    {
      "question_text": "Yazarın adı nədir?",
      "options": ["Adı1", "Adı2", "Adı3"],
      "correct_answer": 0,
      "topic": "Ədəbiyyat",
      "difficulty": "asan",
      "points": 10
    }
  ]
}
```

**Sualları əldə edin**
```
GET /api/exams/:exam_id/questions
```

### Results

**Nəticə qeyd edin**
```
POST /api/results
{
  "user_id": "student123",
  "exam_id": "uuid",
  "score": 85,
  "max_score": 100,
  "percentage": 85,
  "answers": [0, 1, 2, 1]
}
```

**İstifadəçi nəticələrini əldə edin**
```
GET /api/user/:user_id/results
```

## Health Check

```
GET /api/health
```

Cavab: `{ "status": "ok" }`

## Deployment

### Heroku-ya yerləşdirin

1. Heroku hesabı yaradın
2. Heroku CLI quraşdırın
3. Əmrləri çalıştırın:

```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
git push heroku main
```

### Railway-ə yerləşdirin

1. [railway.app](https://railway.app) saytına daxil olun
2. Yeni layihə yaradın
3. GitHub repository-ni bağlayın
4. Environment dəyişənlərini tənzimləyin
5. Deploy edin

## Frontend İntegrasiyası

[Frontend `supabase.js` faylı](../supabase.js) artıq backend ilə inteqrasiya etmişdir.

Supabase URL və KEY-i frontend-də tənzimləyin:

```javascript
// supabase.js faylında (24-25 xətt)
const SUPABASE_URL = 'your_supabase_url';
const SUPABASE_KEY = 'your_supabase_anon_key';
```

## İşçi Sınaqları

```bash
# Health check
curl http://localhost:3000/api/health

# Yeni exam yaradın
curl -X POST http://localhost:3000/api/exams \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","grade":"10","subject":"Fizika","teacher_id":"t1"}'
```

## Problemin Həlli

**"Connection refused" xətası:**
- Supabase URL düzgün olduğunu yoxladın
- .env faylında SUPABASE_URL-i yoxladın

**"Invalid API key" xətası:**
- Supabase ANON_KEY-i yoxladın
- Layihədə RLS (Row Level Security) fəaliyyətini yoxladın

**CORS xətası:**
- Backend CORS tənzimləmə faylında var (server.js xətt 8-12)
- Frontend URL-i CORS allowed list-ə əlavə edin
