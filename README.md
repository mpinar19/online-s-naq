# Məktəb Sınaği — 700 Ballıq Onlayn İmtahan Sistemi

Tam fəaliyyətli, Azerbaycan dilində cəld istifadə edilə biləcək interaktiv onlayn imtahan platforması. Şagirdlər, müəllimlər və administratorlar üçün çoxsəviyyəli rol sistemli rəqəmsal məktəb sınaq sistemi.

---

## 📋 Sistem Xülasəsi

**Məktəb Sınaği** — 1-11 sinifləri üçün dizayn edilmiş, 25+ fənn olunca çoxsəviyyəli imtahanlar sunan bulud əsaslı sistem.

### Əsas Xüsusiyyətlər:

#### 👤 **Çoxrolu İstifadəçi Sistemi**
- **Şagirdlər**: İmtahanlar keçə, nəticə görə, liderboard-da rəqabət edə
- **Müəllimlər**: Sinif sınaqlı hazırla, nəticə analiz et
- **Administratorlar**: Bütün sistem idarə et, istifadəçiləri idarə et
- Qeydiyyat/Giriş sistemi localStorage/sessionStorage ilə

#### 📝 **İmtahan Modulları**
- **1-ct Suallar**: 1-4 sinifləri (Azərbaycandili, Riyaziyyat, Həyat bilgisi, İngilis dili)
- **2-ci Suallar**: 5-11 sinifləri (8+ fənn: Riyaziyyat, Fizika, Kimya, Biologiya, Tarix, Coğrafiya, Ədəbiyyat, İngilis dili)
- Hərəkət **(Sual arasında sərbəst gediş (irəli/geri)**
- M-ə cavablandırma
- **90 saniyə** hər suala avtomatik vaxt sistemi

#### 🎯 **Adaptiv İmtahan Sistemi**
- Keçmiş ImtahanlarıAnaliz (Tarix/Statistika)
- Zəif mövzuları müəyyən et
- Fərdi məsləhətçi(fərqləndirici) sorular

#### 🏆 **Leaderboard & Turnirləri**
- **Ümumi Rankinq**: Bütün şagirdlərin ən yaxşı balları
- **Sinif Rankinq**: Eyni sinif şagirdləri arasında rəqabət
- **Həftəlik Rankinq**: Axırın 7 günün nəticələri
- Medal sistemi: 🥇🥈🥉

#### 📊 **Nəticə Sistemi**
- **700 Ballıq Sistem**: 0-700 bal
- Düzgün cavabların faizi
- Fərdi suallara izahat
- **PDF Reportu**: jsPDF ilə avtomatik sertifikat yaratma

#### ☁️ **Bulud Həll (Firebase + localStorage)**
- Firebase Realtime Database inteqrasiyası
- Lokal `localStorage` fallback rejimi
- Universal `DB` layeri hər iki mənbəni dəstəkləyir
- Avtomatik sxronizasiya

#### 📤 **AI PDF Generator** (Hazırlıq Aşaması)
- PDF faylını yüklə
- Avtomatik suallar generasiya et
- Sınaq kimi dəstəklə

#### 🌍 **Çox Dillilik**
- Azərbaycanca (əsas)
- Rusça (tamamlanmış)
- İngiliscə (dəstəklənir)
- `data-t` atributları ilə dinamik tərcümə

---

## 🏗️ Layihə Strukturu

```
┌─ app.js              → Auth, giriş/qeydiyyat, rol idarəsi, əsas UX
├─ data.js            → Suallar bankası (1-11 sinif, tüm fənnlər)
├─ features.js        → Leaderboard, Adaptiv sistem, Müəllim paneli
├─ features2.js       → PDF generator, nəticə aşkarlanması
├─ firebase.js        → Firebase/localStorage ünversal məlumatlar bazası
├─ index.html         → HTML şablonu (Auth, İmtahan, Əsas Səhifə, Nəticə)
├─ style.css          → Tam rəngləri, animasiyalar, responsiv dizayn
└─ README.md          → Bu sənəd
```

---

## 🔧 Əsas Modullar Izahı

### **1. app.js — Sistem Hartası**

**Fəaliyyət Alanları:**
- `getUsers()` / `saveUsers()` — İstifadəçi məlumatları (localStorage)
- `getCurUser()` / `saveCurUser()` — Cari sessiyan idarə et
- `switchAuth(tab)` — Giriş ↔ Qeydiyyat arasında keçiş
- `doLogin()` — İstifadəçi adı + şifrə yoxlaması
- `doRegister()` — Yeni istifadəçi yaratma (min 4 simvol şifrə)
- `enterApp()` — Rol əsasında (şagird/müəllim/admin) uyğun ekrana yönləndirmə
- `logout()` — Sessiyanı sonlandır

**İmtahan Engine:**
- Q: Sualları göstər (başqa göstəriş yoxdur, əsas `ST` state-dən işləyir )
- A: 90 saniyə hər suala
- Suallar arasında irəli/geri hərəkət
- Bütün cavablandıqdan sonra "İmtahanı bitir" düyməsi görünür
- Sonra **bal700 + izahatlar** əsas qorumundan

### **2. data.js — Suallar Bankası**

**Struktur:**

```javascript
QBANK_BY_GRADE[grade][subject][topic] = [
  {
    az: { q: "Sual", opts: ["A", "B", "C", "D"], exp: "İzahat" },
    ru: { q: "Вопрос", opts: ["A", "B", "C", "D"], exp: "Объяснение" },
    en: { q: "Question", opts: ["A", "B", "C", "D"], exp: "Explanation" },
    ans: 0,  // Doğru cavab indeksi
    bal: 7   // Bal dəyəri
  },
  ...
]
```

**Suallar Taksonomiyası:**
- **1-3 Siniflər**: 3 fənn
  - Azərbaycanca (20 sual)
  - Riyaziyyat (15 sual)
  - Həyat bilgisi (5 sual)
- **4-ci Sinif**: +İngilis dili (5 sual)
- **5-6 Siniflər**: Tarix, Coğrafiya, Biologiya əlavə
- **7-11 Siniflər**: Fizika, Kimya, Ədəbiyyat əlavə

**Çoxdilinlik:** Az/Ru/En dəstəyi

---

### **3. features.js — Liderboard & Adaptiv**

**Leaderboard Funksiyaları:**
```javascript
renderLeaderboard(tab)  // tab: 'all', 'grade', 'week'
```
- Bütün istifadəçilər arasında ən yaxşı balları göstər
- Eyni sinif şagirdləri filter et
- Son 7 günü analiz et
- Top 20 göstər
- Medal (🥇🥈🥉) + rəqəm rangləri

**Adaptiv Sinaq Sistemi:**
```javascript
showAdaptive()  // zəif mövzuları göstər
```
- Keçmiş sınaqlardakı mövzu *breakdown* analiz et
- Zəif (< 60% doğru) mövzulara fokusla
- Fərdi sınaq önerisi

---

### **4. features2.js — PDF & Nəticə**

**PDF Generator (jsPDF ilə):**
```javascript
downloadResultPDF()
```
- Başlıq + Şagird adı + Tarix
- 📊 Böyük bal göstərişi (0-700)
- 4 statistika kartı: Doğru/Yanlış/Bal/Faiz
- Sual-sual nəticələri cədvəli (✓/✗)
- Səhv cavabların izahatları

---

### **5. firebase.js — Ünversal Məlumatlar Bazası**

**İqtisadi Layə (Hybrid):**

| Əməliyyat | Firebase | localStorage |
|-----------|----------|--------------|
| `DB.get()` | ref(path).get() | JSON.parse() |
| `DB.set()` | ref(path).set() | setItem() |
| `DB.update()` | ref(path).update() | merge + setItem() |
| `DB.push()` | ref(path).push() | key = "loc_" + timestamp |
| `DB.delete()` | ref(path).remove() | removeItem() |
| `DB.onValue()` | ref(path).on() | bir dəfə oxu |

**Quraşdırma:**
```javascript
const FIREBASE_CONFIG = { apiKey, authDomain, databaseURL, ... };
const FB_READY = (FIREBASE_CONFIG.apiKey !== "BURAYA_API_KEY");
async function initFirebase() { /* Firebase SDK yüklə */ }
```

**Fallback Stratejisi:**
- Əgər Firebase konfiqure olunmamışsa → localStorage işlət
- Əgər Firebase uyğun gəlmirsə → lokal rejim fəaliyyət saxla

---

### **6. index.html — Şablonlar**

**Səhifələr:**
1. **s-auth** — Giriş/Qeydiyyat ekranı
   - İstifadəçi adı + Şifrə
   - Rol seçimi (Şagird/Müəllim)
   - Sinif seçimi

2. **s-home** — Əsas Səhifə
   - Sinif ağı (1-11)
   - Fənn kartları (rəngləri ilə)
   - Leaderboard açılan işarəsi
   - Adaptiv imtahan düyməsi (şagirdlər üçün)

3. **s-exam** — İmtahan Ekranı
   - Sual tapançası (Suali №, Mövzu, Saniyə)
   - 4 Cavab Düyməsi (A/B/C/D)
   - İrəli/Geri Naviqasiya
   - "İmtahanı bitir" Düyməsi (Bütün cavablandıqdan sonra)

4. **s-result** — Nəticə Ekranı
   - Böyük Bal (700-dən)
   - Statistika (Doğru/Yanlış/Faiz)
   - PDF Yüklə Düyməsi
   - Ev-ə Qayıt

5. **s-teacher** — Müəllim Paneli
   - Sinif sınaqlı hazırla
   - Nəticə analiz

6. **s-admin** — Admin Paneli
   - Bütün istifadəçilər
   - Sistem ayarları

---

## 🚀 Başlamaq

### **1. Quraşdırma**
```bash
# Layihə Faylları (HTML/CSS/JS)
# Git-dən klonla
git clone <repo-url>
cd online-sinaq

# Brauzerdə aç
# Yalnız index.html-i aç (hər şey client-side)
```

### **2. Firebase Seçimlilikdir (Lokal Rejim Standart)**
1. https://console.firebase.google.com → Yeni Layihə
2. Realtime Database → Test Mode
3. `firebase.js` ← API Açarlarını Yapıştır
4. ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-app.firebaseapp.com",
     databaseURL: "https://your-app.firebaseio.com",
     projectId: "your-app",
     storageBucket: "your-app.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### **3. İlk İstifadəçi**
- Qeydiyyat → İstifadəçi adı + Şifrə (min 4 simvol) + Sinif
- Giriş
- Sinif seçə başla

---

## 🔐 Təhlükəsizlik Qeydləri

⚠️ **Xəbərdarlıq:** Bu sistem tanıtım/tədris üçün nəzərdə tutulmuşdur.
- Şifrələr **localStorage-də açıq** saxlanılır
- **Production-da** Node.js server + bcrypt + JWT istifadə edin
- **HTTPS** məcburidir real məlumatlar üçün

---

## 🎨 Əsas Texnoloji Verilənlər

- **Frontend**: Vanilla JavaScript (kütüphanesiz)
- **Məlumatlar**: localStorage (Default) + Firebase (Seçimli)
- **PDF**: jsPDF (v2.5.1)
- **Stil**: CSS 3 (Flexibility + Animasiyalar)
- **Dil**: Azərbaycanca (Əsas), Rusça, İngiliscə

---

## 📱 Responsive Dizayn

- ✅ Mobil (320px+)
- ✅ Tablet (768px+)
- ✅ Masaüstü (1024px+)
- ✅ 4K Display

---

## 📚 Suallar Məcmuəsi

**Fənnlər Əhatə Sahəsi:**
- Azərbaycanca: Hərflər, Heca, Söz Növləri, Cümlə Növləri
- Riyaziyyat: Rəqəmlər (1-20), Əsas Arifmetika
- Həyat Bilgisi: Mədəniyyət, Təbiat
- Tarix: Azərbaycan Tarixi
- Coğrafiya: Dünya Coğrafiyası
- Fizika: Mexanika, Istilik
- Kimya: Kimya Əsasları
- Biologiya: Canlı Orqanizmlər
- İngilis Dili: Söz Hazinəsi, Qrammatika
- Ədəbiyyat: Ədəbi Əsərlər

---

## 🔄 İş Axını (Tipik Şagird)

```
1. Qeydiyyat/Giriş
   ↓
2. Əsas Səhifə → Sinif Seç
   ↓
3. Fənn Seç → "Sınaq Başla"
   ↓
4. İmtahan Sisteması (Suallar + Cavablar)
   ↓
5. "İmtahanı Bitir" → Sonuç (Bal: 0-700)
   ↓
6. PDF Yüklə + Leaderboard-da Görün
```

---

## 🛠️ Hazırda Geliştirilemeyenler

- [ ] Teachers panel — Sinif Sorularını Oluştur
- [ ] Admin Dashboard — Kütlü Tercümesi
- [ ] AI PDF Generator — Fayldan Sorular Çıkar
- [ ] MultiplePlayers Mode — Sahə Sınavı (Real-time)
- [ ] Analytics — Daha Derinlemesine Rapor

---

## 📝 Lisans

MIT License — Açık Kaynak Eğitimi İçin

---

## 📧 İletişim & Katkı

Hata, öneriler veya katkılar için GitHub Issues/PR gönderin.
Azerbaycanca tercümeleri geliştirmek için işbirliği yapın!

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 2026 Nisan  
**Dil:** Azerbaycanca (Az-AZ)
