'use client';
import { useState, useEffect } from 'react';
import { getCurUser, logout } from '@/lib/auth';
import { useAppStore, useQuizStore } from '@/lib/store';
import { SUBJECTS_BY_GRADE, ALL_GRADES, buildQuestions } from '@/lib/qbank';
import { GCOL } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Trophy, LogOut, ChevronRight, BookOpen, Zap, BarChart2, Globe, Cpu, ChevronDown, Layers } from 'lucide-react';
import SearchQuestionsModal from '@/components/modals/SearchQuestionsModal';
import LeaderboardModal from '@/components/modals/LeaderboardModal';
import HistoryModal from '@/components/modals/HistoryModal';

type HomeTab = 'quiz' | 'search';

const S = {
  card: { background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 18, overflow: 'hidden' as const, position: 'relative' as const, padding: 20 },
  stepBadge: { fontSize: 10, fontWeight: 700, color: '#6378FF', background: 'rgba(99,120,255,0.1)', border: '1px solid rgba(99,120,255,0.2)', padding: '4px 10px', borderRadius: 20, fontFamily: 'monospace', letterSpacing: '0.05em' },
  stepTitle: { fontSize: 14, fontWeight: 700, color: '#E8EEFF', margin: 0 },
  stepHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
};

export default function HomeScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const { grade, examType, subject, topic, setGrade, setExamType, setSubject, setTopic, launchQuiz } = useQuizStore();
  const [user, setUser] = useState<ReturnType<typeof getCurUser>>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [qbank, setQbank] = useState<Record<string, Record<string, Record<string, unknown[]>>>>({});
  const [activeTab, setActiveTab] = useState<HomeTab>('quiz');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const cu = getCurUser();
    setUser(cu);
    // Şagirdin sinifini avtomatik seç
    if (cu && cu.role === 'student' && cu.grade) {
      setGrade(cu.grade);
    }
    const tryLoad = () => {
      const w = window as unknown as { QBANK_BY_GRADE?: Record<string, Record<string, Record<string, unknown[]>>> };
      if (w.QBANK_BY_GRADE) { setQbank(w.QBANK_BY_GRADE); }
      else { setTimeout(tryLoad, 150); }
    };
    if (typeof window !== 'undefined') tryLoad();
  }, []);

  const handleStartQuiz = () => {
    if (!grade || !examType) return;
    const qs = buildQuestions(qbank as Parameters<typeof buildQuestions>[0], grade, examType, subject, topic);
    if (!qs.length) { alert('Sual tapılmadı!'); return; }
    launchQuiz(qs);
    setScreen('quiz');
  };

  const subjects = grade ? SUBJECTS_BY_GRADE[grade] || [] : [];
  const gradeBank = grade ? (qbank[grade] || {}) : {};
  const topics = subject ? Object.keys((gradeBank as Record<string, Record<string, unknown[]>>)[subject] || {}) : [];
  const canStart = grade && examType && (examType === 'all_mixed' || (subject && topic));

  const iconBtn = (onClick: () => void, title: string, children: React.ReactNode, hoverColor = '#6378FF') => (
    <button onClick={onClick} title={title} style={{
      width: 36, height: 36, borderRadius: 10, background: '#141B2D',
      border: '1px solid rgba(99,120,255,0.12)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#7B8DB0', cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = hoverColor; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7B8DB0'; }}>
      {children}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,32,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,120,255,0.35)' }}>
              <Cpu style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#E8EEFF', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace' }}>700 · AI-powered</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {iconBtn(() => setShowLeaderboard(true), 'Liderboard', <Trophy style={{ width: 16, height: 16 }} />, '#F59E0B')}
            {iconBtn(() => setShowHistory(true), 'Nəticələr', <BarChart2 style={{ width: 16, height: 16 }} />)}
            {user && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                  background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 10,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EEFF', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <ChevronDown style={{ width: 12, height: 12, color: '#3D4F70', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 180, background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 50 }} className="animate-fade-in">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace' }}>{user.grade}-ci sinif</div>
                    </div>
                    <button onClick={() => { logout(); setScreen('auth'); }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                      fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      <LogOut style={{ width: 15, height: 15 }} />Çıxış
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }} className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: '#141B2D', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 20, marginBottom: 16 }}>
            <div className="glow-dot" />
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#7B8DB0' }}>AI-powered · 700 bal sistemi</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#E8EEFF', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Sınaqa <span className="gradient-text-animated">hazır</span> ol
          </h1>
          <p style={{ fontSize: 14, color: '#7B8DB0', margin: 0 }}>Sual bankı və ya internet axtarışı ilə sınaq başlat</p>
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: 24 }}>
          <button onClick={() => setActiveTab('quiz')} className={`tab-item${activeTab === 'quiz' ? ' active' : ''}`}>
            <Layers style={{ width: 16, height: 16 }} />Sınaq
          </button>
          <button onClick={() => setActiveTab('search')} className={`tab-item${activeTab === 'search' ? ' active' : ''}`}>
            <Globe style={{ width: 16, height: 16 }} />İnternet axtarışı
          </button>
        </div>

        {/* Step 1 — yalnız admin/teacher üçün sinif seçimi */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in">
            {user && user.role === 'student' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'rgba(99,120,255,0.08)', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 14, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {user.grade}
                </div>
                <span style={{ fontSize: 13, color: '#7B8DB0' }}>
                  <strong style={{ color: '#E8EEFF' }}>{user.grade}-ci sinif</strong> üzrə sınaqlar
                </span>
              </div>
            )}

            {/* Sinif seçimi — yalnız admin/teacher */}
            {user && user.role !== 'student' && (
              <div style={{ ...S.card, marginBottom: 16 }}>
                <div style={S.stepHeader}>
                  <span style={S.stepBadge}>01</span>
                  <h3 style={S.stepTitle}>Sinif seçin</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {ALL_GRADES.map(g => {
                    const col = GCOL[g];
                    const active = grade === g;
                    return (
                      <button key={g} onClick={() => setGrade(g)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '10px 4px', borderRadius: 12, border: active ? '2px solid #6378FF' : '2px solid transparent',
                        background: active ? 'rgba(99,120,255,0.15)' : col.bg + '18', color: col.txt,
                        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                        transform: active ? 'scale(1.05)' : 'none',
                        boxShadow: active ? '0 0 16px rgba(99,120,255,0.2)' : 'none',
                        position: 'relative',
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{g}</span>
                        <span style={{ fontSize: 9, opacity: 0.5, marginTop: 3 }}>sinif</span>
                        {active && <div style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', background: '#6378FF', boxShadow: '0 0 8px rgba(99,120,255,0.8)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {grade && (
              <div style={{ ...S.card, marginBottom: 16 }} className="animate-fade-in">
                <div style={S.stepHeader}>
                  <span style={S.stepBadge}>02</span>
                  <h3 style={S.stepTitle}>Sınaq növü</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { id: 'all_mixed' as const, icon: <BookOpen style={{ width: 20, height: 20 }} />, label: 'Bütün fənlər (qarışıq)', desc: 'Real imtahan kimi', color: '#6378FF' },
                    { id: 'by_subject' as const, icon: <Zap style={{ width: 20, height: 20 }} />, label: 'Fənn üzrə sınaq', desc: 'Seçdiyiniz fəndən', color: '#A855F7' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setExamType(t.id)} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 16,
                      border: examType === t.id ? '2px solid #6378FF' : '2px solid rgba(99,120,255,0.1)',
                      background: examType === t.id ? 'rgba(99,120,255,0.08)' : '#0D1120',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: t.color + '1A', color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {t.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF', marginBottom: 4 }}>{t.label}</div>
                        <div style={{ fontSize: 12, color: '#7B8DB0' }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {grade && examType === 'by_subject' && (
              <div style={{ ...S.card, marginBottom: 16 }} className="animate-fade-in">
                <div style={S.stepHeader}>
                  <span style={S.stepBadge}>03</span>
                  <h3 style={S.stepTitle}>Fənn seçin</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {subjects.map(s => {
                    const sb = (gradeBank as Record<string, Record<string, unknown[]>>)[s.name] || {};
                    const cnt = Object.values(sb).reduce((n, a) => n + a.length, 0);
                    return (
                      <button key={s.name} onClick={() => setSubject(s.name)} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14,
                        border: subject === s.name ? '1px solid #6378FF' : '1px solid rgba(99,120,255,0.1)',
                        background: subject === s.name ? 'rgba(99,120,255,0.08)' : '#0D1120',
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg + '28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {s.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#E8EEFF' }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace', marginTop: 2 }}>{cnt} sual</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {grade && examType === 'by_subject' && subject && (
              <div style={{ ...S.card, marginBottom: 16 }} className="animate-fade-in">
                <div style={{ ...S.stepHeader, marginBottom: 14 }}>
                  <span style={S.stepBadge}>04</span>
                  <h3 style={S.stepTitle}>Mövzu seçin</h3>
                  <span style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', marginLeft: 'auto' }}>{topics.length} mövzu</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['all', ...topics].map(t => (
                    <button key={t} onClick={() => setTopic(t)} className={`chip${topic === t ? ' active' : ''}`}>
                      {t === 'all' ? '📚 Bütün mövzular' : t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start */}
            {canStart && (
              <div className="animate-fade-in" style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 18, padding: 20, position: 'relative', overflow: 'hidden' }}>
                <div className="card-accent-top" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Hazır</div>
                    {examType === 'all_mixed'
                      ? <p style={{ fontSize: 14, color: '#E8EEFF', margin: 0 }}><strong>{grade}-ci sinif</strong> — Bütün fənlər qarışıq</p>
                      : <p style={{ fontSize: 14, color: '#E8EEFF', margin: 0 }}><strong>{subject}</strong>{topic && topic !== 'all' && <span style={{ color: '#7B8DB0' }}> · {topic}</span>}</p>}
                  </div>
                  <Button variant="primary" size="lg" onClick={handleStartQuiz}>
                    Sınaqa başla <ChevronRight style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search tab */}
        {activeTab === 'search' && (
          <div className="animate-fade-in">
            <SearchQuestionsModal inline onClose={() => setActiveTab('quiz')} />
          </div>
        )}
      </div>

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {userMenuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setUserMenuOpen(false)} />}
    </div>
  );
}
