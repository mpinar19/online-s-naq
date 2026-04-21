'use client';
import { useRouter } from 'next/navigation';
import { BookOpen, Globe, FileText, Trophy, Users, ChevronRight, Zap, BarChart2, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  // ── Logo SVG ──────────────────────────────────────────────
  const Logo = ({ size = 36 }: { size?: number }) => (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,120,255,0.4)', flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 32 32" fill="none">
        <rect x="4" y="3" width="15" height="21" rx="2" fill="white" opacity="0.95"/>
        <rect x="6.5" y="7.5" width="10" height="2" rx="1" fill="#6378FF"/>
        <rect x="6.5" y="11.5" width="10" height="2" rx="1" fill="#6378FF"/>
        <rect x="6.5" y="15.5" width="6" height="2" rx="1" fill="#6378FF"/>
        <path d="M21 13 L27 7 L29 9 L23 15 L21 16 Z" fill="white" opacity="0.9"/>
        <path d="M21 16 L19 18 L20 16 Z" fill="#F59E0B"/>
      </svg>
    </div>
  );

  const features = [
    { icon: <BookOpen size={22} />, title: '700 Ballıq Sınaq', desc: '1-11-ci sinif, bütün fənlər. Real imtahan formatı.', color: '#6378FF' },
    { icon: <Globe size={22} />, title: 'İnternet Axtarışı', desc: 'Mövzu daxil et — AI Wikipedia-dan suallar yaradır.', color: '#06B6D4' },
    { icon: <FileText size={22} />, title: 'PDF-dən Sual', desc: 'PDF yüklə — AI mövzulara görə suallar hazırlayır.', color: '#A855F7' },
    { icon: <BarChart2 size={22} />, title: 'Ətraflı Analiz', desc: 'Fənn və mövzu üzrə nəticə, səhvlərin izahı.', color: '#10B981' },
    { icon: <Users size={22} />, title: 'Müəllim Paneli', desc: 'Şagird nəticələri, zəif mövzular, PDF sual.', color: '#F59E0B' },
    { icon: <Trophy size={22} />, title: 'Liderboard', desc: 'Ümumi, sinif üzrə, həftəlik reytinq.', color: '#EF4444' },
  ];

  const steps = [
    { n: '01', title: 'Qeydiyyatdan keç', desc: 'Adını, sinifini daxil et. 30 saniyə çəkir.', icon: <Users size={26} /> },
    { n: '02', title: 'Sınaq seç', desc: 'Sual bankı, paket, internet axtarışı və ya PDF.', icon: <Zap size={26} /> },
    { n: '03', title: 'Nəticəni analiz et', desc: 'Səhvlərini gör, izahatları oxu, inkişaf et.', icon: <BarChart2 size={26} /> },
  ];

  const reviews = [
    { name: 'Aynur M.', grade: '11-ci sinif', text: 'PDF-dən sual yaratma funksiyası çox faydalıdır. Dərslik materialından birbaşa sınaq hazırlayıram.', avatar: 'A' },
    { name: 'Rauf T.', grade: 'Müəllim', text: 'Şagirdlərimin zəif mövzularını müəllim panelindən asanlıqla izləyirəm. Çox rahat interfeys.', avatar: 'R' },
    { name: 'Leyla H.', grade: '9-cu sinif', text: 'İnternet axtarışı ilə istənilən mövzudan sual yaranır. Hazırlıq üçün ideal vasitədir.', avatar: 'L' },
  ];

  const stats = [
    { n: '11', l: 'Sinif' },
    { n: '9+', l: 'Fənn' },
    { n: '700', l: 'Bal sistemi' },
    { n: '∞', l: 'Sual' },
  ];

  // ── Shared styles ─────────────────────────────────────────
  const s = {
    bg: '#080B14' as const,
    surface: '#141B2D' as const,
    bg2: '#0D1120' as const,
    bd: 'rgba(99,120,255,0.12)' as const,
    txt: '#E8EEFF' as const,
    txt2: '#7B8DB0' as const,
    txt3: '#3D4F70' as const,
    acc: '#6378FF' as const,
    acc2: '#A855F7' as const,
    acc3: '#06B6D4' as const,
  };

  const btn = (onClick: () => void, label: string, primary = true) => (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '13px 26px', borderRadius: 14,
      background: primary ? 'linear-gradient(135deg,#6378FF,#A855F7)' : s.surface,
      color: primary ? '#fff' : s.txt,
      fontSize: 15, fontWeight: 700, border: primary ? 'none' : `1px solid ${s.bd}`,
      cursor: 'pointer', fontFamily: 'inherit',
      boxShadow: primary ? '0 8px 28px rgba(99,120,255,0.35)' : 'none',
      transition: 'opacity 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: s.bg, color: s.txt, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,120,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99,120,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 5% 0%, rgba(99,120,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 95% 100%, rgba(168,85,247,0.06) 0%, transparent 60%)' }} />
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,11,20,0.88)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${s.bd}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={34} />
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.02em', color: s.txt }}>SinaqAZ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: 14, color: s.txt2, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 12px' }}>
              Xüsusiyyətlər
            </button>
            <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 11, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Daxil ol <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── HERO ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,8vw,96px) 20px 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: s.surface, border: `1px solid rgba(99,120,255,0.2)`, borderRadius: 20, marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 12, color: s.txt2, fontFamily: 'monospace' }}>Azərbaycan məktəbliləri üçün sınaq platforması</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 62px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px', color: s.txt }}>
            Sınaqa{' '}
            <span style={{
              background: 'linear-gradient(270deg,#6378FF,#A855F7,#06B6D4,#6378FF)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 4s ease infinite',
            }}>hazır</span>
            {' '}ol
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: s.txt2, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
            700 ballıq sistem, AI ilə sual yaratma, PDF analizi və müəllim paneli — hamısı bir yerdə.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(99,120,255,0.35)' }}>
              Pulsuz başla <ChevronRight size={18} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: s.surface, color: s.txt, fontSize: 15, fontWeight: 600, border: `1px solid ${s.bd}`, cursor: 'pointer', fontFamily: 'inherit' }}>
              Daha çox öyrən
            </button>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, background: s.surface, border: `1px solid ${s.bd}`, borderRadius: 20, padding: '28px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)' }} />
            {stats.map((st, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, background: 'linear-gradient(135deg,#6378FF,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{st.n}</div>
                <div style={{ fontSize: 13, color: s.txt2, marginTop: 8 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px', color: s.txt }}>Niyə SinaqAZ?</h2>
            <p style={{ fontSize: 16, color: s.txt2, margin: 0 }}>Hər şagird üçün fərdi, hər müəllim üçün güclü</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: s.surface, border: `1px solid ${s.bd}`, borderRadius: 18, padding: 22, position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}70, transparent)` }} />
                <div style={{ width: 46, height: 46, borderRadius: 13, background: f.color + '18', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: s.txt, margin: '0 0 8px', lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: s.txt2, margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px', color: s.txt }}>Necə işləyir?</h2>
            <p style={{ fontSize: 16, color: s.txt2, margin: 0 }}>3 addımda hazırlığa başla</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {steps.map((st, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(99,120,255,0.1)', border: '1px solid rgba(99,120,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.acc, flexShrink: 0 }}>
                  {st.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.acc, fontFamily: 'monospace', marginBottom: 5 }}>{st.n}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: s.txt, margin: '0 0 7px' }}>{st.title}</h3>
                  <p style={{ fontSize: 13, color: s.txt2, margin: 0, lineHeight: 1.6 }}>{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px', color: s.txt }}>İstifadəçilər nə deyir?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: s.surface, border: `1px solid ${s.bd}`, borderRadius: 18, padding: 22 }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(j => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: s.txt2, margin: '0 0 18px', lineHeight: 1.7, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.txt }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: s.txt3 }}>{r.grade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CHECKLIST ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,120,255,0.1), rgba(168,85,247,0.07))', border: `1px solid rgba(99,120,255,0.2)`, borderRadius: 22, padding: 'clamp(28px,5vw,48px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)' }} />
            <div>
              <h2 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 14px', color: s.txt }}>Hər şey bir yerdə</h2>
              <p style={{ fontSize: 14, color: s.txt2, margin: '0 0 24px', lineHeight: 1.7 }}>Sınaq platformasında lazım olan hər şey artıq hazırdır.</p>
              <button onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 13, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 24px rgba(99,120,255,0.35)' }}>
                İndi başla <ChevronRight size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                '700 ballıq sınaq sistemi',
                'Bütün fənlər, 1-11-ci sinif',
                'PDF-dən AI sual yaratma',
                'İnternet axtarışı ilə sual',
                'Müəllim paneli',
                'Pulsuz qeydiyyat',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: s.txt2 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px', textAlign: 'center' }}>
          <div style={{ background: s.surface, border: `1px solid ${s.bd}`, borderRadius: 22, padding: 'clamp(36px,6vw,60px) 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)' }} />
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 32px rgba(99,120,255,0.4)' }}>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="3" width="15" height="21" rx="2" fill="white" opacity="0.95"/>
                <rect x="6.5" y="7.5" width="10" height="2" rx="1" fill="#6378FF"/>
                <rect x="6.5" y="11.5" width="10" height="2" rx="1" fill="#6378FF"/>
                <rect x="6.5" y="15.5" width="6" height="2" rx="1" fill="#6378FF"/>
                <path d="M21 13 L27 7 L29 9 L23 15 L21 16 Z" fill="white" opacity="0.9"/>
                <path d="M21 16 L19 18 L20 16 Z" fill="#F59E0B"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 14px', color: s.txt }}>İndi başla — pulsuz</h2>
            <p style={{ fontSize: 16, color: s.txt2, margin: '0 0 28px', lineHeight: 1.7 }}>Qeydiyyat 30 saniyə çəkir. Kredit kartı lazım deyil.</p>
            <button onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 32px', borderRadius: 15, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 32px rgba(99,120,255,0.4)' }}>
              Pulsuz qeydiyyat <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${s.bd}`, padding: '28px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Logo size={28} />
              <span style={{ fontSize: 14, fontWeight: 700, color: s.txt }}>SinaqAZ</span>
            </div>
            <p style={{ fontSize: 12, color: s.txt3, margin: 0 }}>© 2025 SinaqAZ · Azərbaycan məktəbliləri üçün</p>
            <div style={{ display: 'flex', gap: 18 }}>
              {['Platforma', 'Daxil ol'].map((label, i) => (
                <button key={i} onClick={() => router.push('/')} style={{ fontSize: 13, color: s.txt2, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Gradient animation keyframe */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (max-width: 640px) {
          .landing-checklist { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
