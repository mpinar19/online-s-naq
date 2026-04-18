# Vercel Deploy — Addım-addım

## 1. Vercel hesabı aç
https://vercel.com → GitHub ilə giriş et

## 2. Yeni proje yarat
- "Add New Project" → "Import Git Repository"
- `mpinar19/online-s-naq` seç → Import

## 3. Konfiqurasiya
```
Framework Preset:  Next.js
Root Directory:    sinaq-platform
Build Command:     npm run build
Output Directory:  .next
Install Command:   npm install
```

## 4. Environment Variables əlavə et
"Environment Variables" bölməsindən:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | sk-ant-... (console.anthropic.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |

## 5. Deploy
"Deploy" düyməsinə bas → 2-3 dəqiqə gözlə

---

## Supabase Database Quraşdırma

### 1. Supabase hesabı aç
https://supabase.com → New Project

### 2. SQL Editor-də bu kodu işlət:
```sql
-- Users cədvəli
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  pass TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- History cədvəli  
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  label TEXT,
  bal700 INTEGER,
  correct INTEGER,
  total INTEGER,
  pct INTEGER,
  date TEXT,
  topic_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_history" ON history FOR ALL USING (true) WITH CHECK (true);
```

### 3. API Keys al
Settings → API → `URL` və `anon public` key-i kopyala

### 4. Vercel-ə əlavə et
Vercel dashboard → Settings → Environment Variables-ə əlavə et
