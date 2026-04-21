'use client';
import { useState, useEffect } from 'react';
import { getCurUser, logout } from '@/lib/auth';
import { useAppStore, useQuizStore } from '@/lib/store';
import { SUBJECTS_BY_GRADE, ALL_GRADES, buildQuestions, EXAM_CONFIG } from '@/lib/qbank';
import { GCOL } from '@/lib/utils';
import { t } from '@/lib/i18n';
import Button from '@/components/ui/Button';
import { Trophy, LogOut, ChevronRight, BookOpen, Zap, BarChart2, Globe, ChevronDown, Layers, Sun, Moon, Package } from 'lucide-react';
import SearchQuestionsModal from '@/components/modals/SearchQuestionsModal';
import LeaderboardModal from '@/components/modals/LeaderboardModal';
import HistoryModal from '@/components/modals/HistoryModal';

type HomeTab = 'quiz' | 'packages' | 'search';

// Sınaq paketləri
const PACKAGES = [
  { id: 'quick10', label: '⚡ Sürətli sınaq', desc: '10 sual · ~15 dəq', count: 10, color: '#06B6D4' },
  { id: 'standard', label: '📋 Standart sınaq', desc: '30 sual · ~45 dəq', count: 30, color: '#6378FF' },
  { id: 'full', label: '🏆 Tam imtahan', desc: 'Bütün suallar · real format', count: 0, color: '#A855F7' },
  { id: 'weak', label: '🎯 Zəif mövzular', desc: 'Tarixçəyə görə fokus', count: 20, color: '#F59E0B' },
];

export default function HomeScreen() {
  const { setScreen, lang, theme, toggleTheme } = useAppStore();
  const { grade, examType, subject, topic, setGrade, setExamType, setSubject, setTopic, launchQuiz } = useQuizStore();
  const [user, setUser] = useState<ReturnType<typeof getCurUser>>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [qbank, setQbank] = useState<Record<string, Record<string, Record<string, unknown[]>>>>({});
  const [activeTab, setActiveTab] = useState<HomeTab>('quiz');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selPackage, setSelPackage] = useState<string | null>(null);

  const T = (k: Parameters<typeof t>[1]) => t(lang, k);
  const isDark = theme === 'dark';

  useEffect(() => {
    const cu = getCurUser();
    setUser(cu);
    if (cu?.role === 'student' && cu.grade) setGrade(cu.grade);
    const tryLoad = () => {
      const w = window as unknown as { QBANK_BY_GRADE?: Record<string, Record<string, Record<string, unknown[]>>> };
      if (w.QBANK_BY_GRADE) setQbank(w.QBANK_BY_GRADE);
      else setTimeout(tryLoad, 150);
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

  const handlePackageStart = (pkg: typeof PACKAGES[0]) => {
    if (!grade) { alert('Əvvəlcə sinif seçin'); return; }
    const gradeBank = qbank[grade] || {};
    let pool: Parameters<typeof launchQuiz>[0] = [];

    if (pkg.id === 'full') {
      // Tam imtahan — EXAM_CONFIG-dan
      const cfg = EXAM_CONFIG[grade + '_all'] || [];
      cfg.forEach(({ subject: subj, count }) => {
        const sb = (gradeBank as Record<string, Record<string, unknown[]>>)[subj] || {};
        const all: Parameters<typeof launchQuiz>[0] = [];
        Object.entries(sb).forEach(([tp, qs]) =>
          (qs as { az?: { q: string; opts: string[]; exp: string }; ans: number; bal?: number }[]).forEach(q => {
            const src = q.az || q;
            all.push({ q: (src as { q: string }).q, opts: (src as { opts: string[] }).opts, ans: q.ans, exp: (src as { exp: string }).exp || '', bal: q.bal || 10, _subject: subj, _topic: tp });
          })
        );
        const sh = [...all].sort(() => Math.random() - 0.5);
        pool.push(...sh.slice(0, count));
      });
    } else {
      // Digər paketlər — bütün fənlərdən random
      Object.entries(gradeBank).forEach(([subj, topics]) => {
        Object.entries(topics as Record<string, unknown[]>).forEach(([tp, qs]) => {
          (qs as { az?: { q: string; opts: string[]; exp: string }; ans: number; bal?: number }[]).forEach(q => {
            const src = q.az || q;
            pool.push({ q: (src as { q: string }).q, opts: (src as { opts: string[] }).opts, ans: q.ans, exp: (src as { exp: string }).exp || '', bal: q.bal || 10, _subject: subj, _topic: tp });
          });
        });
      });
      pool = [...pool].sort(() => Math.random() - 0.5);
      if (pkg.count > 0) pool = pool.slice(0, pkg.count);
    }

    if (!pool.length) { alert('Sual tapılmadı!'); return; }
    launchQuiz(pool);
    setScreen('quiz');
  };

  const subjects = grade ? SUBJECTS_BY_GRADE[grade] || [] : [];
  const gradeBank = grade ? (qbank[grade] || {}) : {};
  const topics = subject ? Object.keys((gradeBank as Record<string, Record<string, unknown[]>>)[subject] || {}) : [];
  const canStart = grade && examType && (examType === 'all_mixed' || (subject && topic));

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', position: 'relative', padding: 20 };
  const stepBadge: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--acc)', background: 'var(--acc-bg)', border: '1px solid rgba(99,120,255,0.2)', padding: '4px 10px', borderRadius: 20, fontFamily: 'monospace' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px var(--acc-glow)' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <rect x="5" y="4" width="14" height="20" rx="2" fill="white" opacity="0.95"/>
                <rect x="7" y="8" width="10" height="2" rx="1" fill="#6378FF"/>
                <rect x="7" y="12" width="10" height="2" rx="1" fill="#6378FF"/>
                <rect x="7" y="16" width="6" height="2" rx="1" fill="#6378FF"/>
                <path d="M21 14 L27 8 L29 10 L23 16 L21 17 Z" fill="white" opacity="0.9"/>
                <path d="M21 17 L19 19 L20 17 Z" fill="#F59E0B"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--txt)', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace' }}>700 bal sistemi</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
              {isDark ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
            </button>

            {/* Leaderboard */}
            <button onClick={() => setShowLeaderboard(true)} title={T('leaderboard')} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
              <Trophy style={{ width: 15, height: 15 }} />
            </button>

            {/* History */}
            <button onClick={() => setShowHistory(true)} title={T('results')} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
              <BarChart2 style={{ width: 15, height: 15 }} />
            </button>

            {/* User menu */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <ChevronDown style={{ width: 11, height: 11, color: 'var(--txt3)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 170, background: 'var(--surface)', border: '1px solid var(--bd2)', borderRadius: 14, boxShadow: '0 16px 48px var(--shadow)', overflow: 'hidden', zIndex: 50 }} className="animate-fade-in">
                    <div style={{ padding: '11px 14px', borderBottom: '1px solid var(--bd)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>{user.grade}-ci sinif</div>
                    </div>
                    <button onClick={() => { logout(); setScreen('auth'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', fontSize: 13, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <LogOut style={{ width: 14, height: 14 }} />{T('logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 24 }} className="animate-fade-up">
          <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Sınaqa <span className="gradient-text-animated">hazır</span> ol
          </h1>
          <p style={{ fontSize: 14, color: 'var(--txt2)', margin: 0 }}>Sual bankı, sınaq paketləri və internet axtarışı</p>
        </div>

        {/* Sinif badge — şagird üçün */}
        {user?.role === 'student' && grade && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--acc-bg)', border: '1px solid var(--bd2)', borderRadius: 14, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{grade}</div>
            <span style={{ fontSize: 13, color: 'var(--txt2)' }}><strong style={{ color: 'var(--txt)' }}>{grade}-ci sinif</strong> üzrə sınaqlar</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: 20 }}>
          <button onClick={() => setActiveTab('quiz')} className={`tab-item${activeTab === 'quiz' ? ' active' : ''}`}>
            <Layers style={{ width: 15, height: 15 }} />{T('selectGradeStep')}
          </button>
          <button onClick={() => setActiveTab('packages')} className={`tab-item${activeTab === 'packages' ? ' active' : ''}`}>
            <Package style={{ width: 15, height: 15 }} />{T('packages')}
          </button>
          <button onClick={() => setActiveTab('search')} className={`tab-item${activeTab === 'search' ? ' active' : ''}`}>
            <Globe style={{ width: 15, height: 15 }} />{T('internetSearch')}
          </button>
        </div>

        {/* ── QUIZ TAB ── */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Sinif seçimi — yalnız admin/teacher */}
            {user?.role !== 'student' && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={stepBadge}>01</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', margin: 0 }}>{T('selectGradeStep')}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
                  {ALL_GRADES.map(g => {
                    const col = GCOL[g];
                    const active = grade === g;
                    return (
                      <button key={g} onClick={() => setGrade(g)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '9px 4px', borderRadius: 11,
                        border: active ? '2px solid var(--acc)' : '2px solid transparent',
                        background: active ? 'var(--acc-bg)' : col.bg + '18', color: col.txt,
                        cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
                        transform: active ? 'scale(1.05)' : 'none',
                      }}>
                        <span style={{ fontSize: 17, fontWeight: 900, lineHeight: 1 }}>{g}</span>
                        <span style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>sinif</span>
                        {active && <div style={{ position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: '50%', background: 'var(--acc)', boxShadow: '0 0 8px var(--acc-glow)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sınaq növü */}
            {grade && (
              <div style={card} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={stepBadge}>{user?.role !== 'student' ? '02' : '01'}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', margin: 0 }}>{T('selectType')}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'all_mixed' as const, icon: <BookOpen style={{ width: 19, height: 19 }} />, label: T('allSubjects'), desc: 'Real imtahan formatı', color: 'var(--acc)' },
                    { id: 'by_subject' as const, icon: <Zap style={{ width: 19, height: 19 }} />, label: T('bySubject'), desc: 'Seçdiyiniz fəndən', color: 'var(--acc2)' },
                  ].map(tp => (
                    <button key={tp.id} onClick={() => setExamType(tp.id)} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14,
                      border: examType === tp.id ? '2px solid var(--acc)' : '2px solid var(--bd)',
                      background: examType === tp.id ? 'var(--acc-bg)' : 'var(--bg2)',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: tp.color + '1A', color: tp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{tp.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 3 }}>{tp.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--txt2)' }}>{tp.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fənn */}
            {grade && examType === 'by_subject' && (
              <div style={card} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={stepBadge}>{user?.role !== 'student' ? '03' : '02'}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', margin: 0 }}>{T('selectSubject')}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {subjects.map(s => {
                    const sb = (gradeBank as Record<string, Record<string, unknown[]>>)[s.name] || {};
                    const cnt = Object.values(sb).reduce((n, a) => n + a.length, 0);
                    return (
                      <button key={s.name} onClick={() => setSubject(s.name)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: 11, borderRadius: 12,
                        border: subject === s.name ? '1px solid var(--acc)' : '1px solid var(--bd)',
                        background: subject === s.name ? 'var(--acc-bg)' : 'var(--bg2)',
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg + '28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{s.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)' }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>{cnt} sual</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mövzu */}
            {grade && examType === 'by_subject' && subject && (
              <div style={card} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={stepBadge}>{user?.role !== 'student' ? '04' : '03'}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', margin: 0 }}>{T('selectTopic')}</h3>
                  <span style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace', marginLeft: 'auto' }}>{topics.length} mövzu</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['all', ...topics].map(tp => (
                    <button key={tp} onClick={() => setTopic(tp)} className={`chip${topic === tp ? ' active' : ''}`}>
                      {tp === 'all' ? '📚 ' + T('allTopics') : tp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start */}
            {canStart && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--bd2)', borderRadius: 18, padding: 18, position: 'relative', overflow: 'hidden' }} className="animate-fade-in">
                <div className="card-accent-top" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Hazır</div>
                    {examType === 'all_mixed'
                      ? <p style={{ fontSize: 14, color: 'var(--txt)', margin: 0 }}><strong>{grade}-ci sinif</strong> — Bütün fənlər</p>
                      : <p style={{ fontSize: 14, color: 'var(--txt)', margin: 0 }}><strong>{subject}</strong>{topic && topic !== 'all' && <span style={{ color: 'var(--txt2)' }}> · {topic}</span>}</p>}
                  </div>
                  <Button variant="primary" size="lg" onClick={handleStartQuiz}>
                    {T('startQuiz')} <ChevronRight style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PACKAGES TAB ── */}
        {activeTab === 'packages' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!grade && user?.role !== 'student' && (
              <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, fontSize: 13, color: 'var(--amber)' }}>
                ⚠️ Əvvəlcə "Sınaq" tabından sinif seçin
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {PACKAGES.map(pkg => (
                <button key={pkg.id} onClick={() => { setSelPackage(pkg.id); handlePackageStart(pkg); }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 18, borderRadius: 16, border: `2px solid ${selPackage === pkg.id ? pkg.color : 'var(--bd)'}`, background: selPackage === pkg.id ? pkg.color + '10' : 'var(--surface)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 22 }}>{pkg.label.split(' ')[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>{pkg.label.slice(3)}</div>
                    <div style={{ fontSize: 12, color: 'var(--txt2)' }}>{pkg.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: pkg.color }}>
                    Başla <ChevronRight style={{ width: 14, height: 14 }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SEARCH TAB ── */}
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
