# SinaqAZ — 700 Ballıq AI Sınaq Platforması

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mpinar19/online-s-naq&root=sinaq-platform&env=ANTHROPIC_API_KEY)

## 🚀 Yerli işlətmək

```bash
cd sinaq-platform
npm install
npm run dev
```

**http://localhost:3000**

## ☁️ Vercel-ə deploy

1. [vercel.com](https://vercel.com) → **New Project**
2. GitHub repo: `mpinar19/online-s-naq`
3. **Root Directory**: `sinaq-platform`
4. **Environment Variables**:
   - `ANTHROPIC_API_KEY` = `sk-ant-...` ([console.anthropic.com](https://console.anthropic.com))
5. **Deploy** düyməsinə bas

## 🔑 Demo hesablar

| Rol | İstifadəçi adı | Şifrə |
|-----|----------------|-------|
| Admin | `admin` | `admin123` |
| Müəllim | `teacher` | `teacher123` |

## ✨ Xüsusiyyətlər

- **700 ballıq sınaq sistemi** — 1-11-ci sinif, bütün fənlər
- **PDF-dən sual** — fayl yüklə, AI mövzulara görə suallar yaradır
- **İnternet axtarışı** — Wikipedia + Claude AI
- **Müəllim paneli** — şagird nəticələri, zəif mövzular, PDF sual
- **Admin paneli** — müəllim əlavə et, statistika
- **Liderboard** — ümumi, sinif, həftəlik
- **Nəticə analizi** — səhv sualların tam izahı

## 🛠 Texnologiyalar

Next.js 16 · TypeScript · Tailwind CSS v4 · Zustand · Claude AI
