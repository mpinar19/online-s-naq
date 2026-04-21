'use client';
import { useRouter } from 'next/navigation';
import { Cpu, BookOpen, Globe, FileText, Trophy, Users, ChevronRight, Zap, Shield, BarChart2, Star } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: <BookOpen style={{ width: 24, height: 24 }} />, title: '700 Ballıq Sınaq Sistemi', desc: '1-11-ci sinif üçün bütün fənlər. Real imtahan formatında qarışıq sınaq və ya fənn üzrə sınaq.', color: '#6378FF' },
    { icon: <Globe style={{ width: 24, height: 24 }} />, title: 'İnternet Axtarışı', desc: 'İstənilən mövzunu daxil edin — AI Wikipedia-dan məlumat alıb praktiki suallar yaradır.', color: '#06B6D4' },
    { icon: <FileText style={{ width: 24, height: 24 }} />, title: 'PDF-dən Sual', desc: 'PDF faylı yükləyin — AI oxuyub mövzulara görə qruplaşdırılmış suallar yaradır.', color: '#A855F7' },
    { icon: <BarChart2 style={{ width: 24, height: 24 }} />, title: 'Ətraflı Analiz', desc: 'Hər sınaqdan sonra fənn və mövzu üzrə nəticə, səhv sualların tam izahı.', color: '#10B981' },
    { icon: <Users style={{ width: 24, height: 24 }} />, title: 'Müəllim Paneli', desc: 'Şagird nəticələrini izləyin, zəif mövzuları müəyyən edin, PDF-dən sual hazırlayın.', color: '#F59E0B' },
    { icon: <Trophy style={{ width: 24, height: 24 }} />, title: 'Liderboard', desc: 'Ümumi, sinif üzrə və həftəlik reytinq. Rəqabət motivasiya yaradır.', color: '#EF4444' },
  ];

  const stats = [
    { n: '11', l: 'Sinif' },
    { n: '9+', l: 'Fənn' },
    { n: '700', l: 'Bal sistemi' },
    { n: 'AI', l: 'Powered' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: '#E8EEFF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(99,120,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99,120,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 5% 0%, rgba(99,120,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 95% 100%, rgba(168,85,247,0.06) 0%, transparent 60%)' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,120,255,0.1)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,120,255,0.35)' }}>
              <Cpu style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>SinaqAZ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/')} style={{ padding: '8px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Daxil ol
            </button>
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 12, color: '#7B8DB0', fontFamily: 'monospace' }}>Azərbaycan məktəbliləri üçün AI sınaq platforması</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px' }}>
            Sınaqa{' '}
            <span style={{ background: 'linear-gradient(270deg,#6378FF,#A855F7,#06B6D4,#6378FF)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradientShift 4s ease infinite' }}>
              hazır
            </span>
            {' '}ol
          </h1>

          <p style={{ fontSize: 18, color: '#7B8DB0', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            700 ballıq sistem, AI ilə sual yaratma, PDF analizi və müəllim paneli — hamısı bir yerdə.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 32px rgba(99,120,255,0.35)' }}>
              Pulsuz başla <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: '#141B2D', color: '#E8EEFF', fontSize: 15, fontWeight: 600, border: '1px solid rgba(99,120,255,0.2)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Daha çox öyrən
            </button>
          </div>
        </section>

        {/* Stats */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 20, padding: '32px 24px' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#6378FF,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: '#7B8DB0', marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Niyə SinaqAZ?</h2>
            <p style={{ fontSize: 16, color: '#7B8DB0', margin: 0 }}>Hər şagird üçün fərdi, hər müəllim üçün güclü</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.1)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + '18', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#E8EEFF', margin: '0 0 10px', lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#7B8DB0', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Necə işləyir?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { n: '01', title: 'Qeydiyyatdan keç', desc: 'Adını, sinifini daxil et. 30 saniyə çəkir.', icon: <Users style={{ width: 28, height: 28 }} /> },
              { n: '02', title: 'Sınaq seç', desc: 'Sual bankından, internetdən və ya PDF-dən sınaq başlat.', icon: <Zap style={{ width: 28, height: 28 }} /> },
              { n: '03', title: 'Nəticəni analiz et', desc: 'Səhvlərini gör, izahatları oxu, zəif mövzularını müəyyən et.', icon: <BarChart2 style={{ width: 28, height: 28 }} /> },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,120,255,0.1)', border: '1px solid rgba(99,120,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6378FF', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6378FF', fontFamily: 'monospace', marginBottom: 6 }}>{s.n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#E8EEFF', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#7B8DB0', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px' }}>İstifadəçilər nə deyir?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { name: 'Aynur M.', grade: '11-ci sinif', text: 'PDF-dən sual yaratma funksiyası çox faydalıdır. Dərslik materialından birbaşa sınaq hazırlayıram.', stars: 5 },
              { name: 'Rauf T.', grade: 'Müəllim', text: 'Şagirdlərimin zəif mövzularını müəllim panelindən asanlıqla izləyirəm. Çox rahat interfeys.', stars: 5 },
              { name: 'Leyla H.', grade: '9-cu sinif', text: 'İnternet axtarışı ilə istənilən mövzudan sual yaranır. Hazırlıq üçün ideal vasitədir.', stars: 5 },
            ].map((t, i) => (
              <div key={i} style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.1)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} style={{ width: 14, height: 14, color: '#F59E0B', fill: '#F59E0B' }} />)}
                </div>
                <p style={{ fontSize: 14, color: '#7B8DB0', margin: '0 0 20px', lineHeight: 1.7, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#3D4F70' }}>{t.grade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,120,255,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)' }} />
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>İndi başla — pulsuz</h2>
            <p style={{ fontSize: 16, color: '#7B8DB0', margin: '0 0 32px', lineHeight: 1.7 }}>Qeydiyyat 30 saniyə çəkir. Kredit kartı lazım deyil.</p>
            <button onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 32px rgba(99,120,255,0.4)' }}>
              Pulsuz qeydiyyat <ChevronRight style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(99,120,255,0.1)', padding: '32px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu style={{ width: 14, height: 14, color: '#fff' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>SinaqAZ</span>
            </div>
            <p style={{ fontSize: 12, color: '#3D4F70', margin: 0 }}>© 2025 SinaqAZ · Azərbaycan məktəbliləri üçün</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <button onClick={() => router.push('/')} style={{ fontSize: 13, color: '#7B8DB0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Platforma</button>
              <button onClick={() => router.push('/')} style={{ fontSize: 13, color: '#7B8DB0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Daxil ol</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
