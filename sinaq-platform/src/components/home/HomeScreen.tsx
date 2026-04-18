'use client';
import { useState, useEffect } from 'react';
import { getCurUser, logout } from '@/lib/auth';
import { useAppStore, useQuizStore } from '@/lib/store';
import { SUBJECTS_BY_GRADE, ALL_GRADES, buildQuestions } from '@/lib/qbank';
import { GCOL, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  Trophy, LogOut, ChevronRight, BookOpen,
  Zap, BarChart2, Globe, Cpu, ChevronDown, Layers
} from 'lucide-react';
import SearchQuestionsModal from '@/components/modals/SearchQuestionsModal';
import LeaderboardModal from '@/components/modals/LeaderboardModal';
import HistoryModal from '@/components/modals/HistoryModal';

type HomeTab = 'quiz' | 'search';

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
    setUser(getCurUser());
    const tryLoad = () => {
      const w = window as unknown as { QBANK_BY_GRADE?: Record<string, Record<string, Record<string, unknown[]>>> };
      if (w.QBANK_BY_GRADE) { setQbank(w.QBANK_BY_GRADE); }
      else { setTimeout(tryLoad, 150); }
    };
    if (typeof window !== 'undefined') tryLoad();
  }, []);

  const handleLogout = () => { logout(); setScreen('auth'); };

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[rgba(99,120,255,0.1)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center shadow-[0_0_20px_rgba(99,120,255,0.35)]">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-[#E8EEFF] leading-tight">SinaqAZ</div>
              <div className="text-[10px] text-[#3D4F70] font-mono">700 · AI-powered</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowLeaderboard(true)}
              className="w-9 h-9 rounded-xl bg-[#141B2D] border border-[rgba(99,120,255,0.12)] flex items-center justify-center text-[#7B8DB0] hover:text-[#F59E0B] transition-all"
              title="Liderboard">
              <Trophy className="w-4 h-4" />
            </button>
            <button onClick={() => setShowHistory(true)}
              className="w-9 h-9 rounded-xl bg-[#141B2D] border border-[rgba(99,120,255,0.12)] flex items-center justify-center text-[#7B8DB0] hover:text-[#6378FF] transition-all"
              title="Nəticələr">
              <BarChart2 className="w-4 h-4" />
            </button>

            {user && (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#141B2D] border border-[rgba(99,120,255,0.12)] rounded-xl hover:border-[rgba(99,120,255,0.3)] transition-all">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-[10px] font-black text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#E8EEFF] hidden sm:block max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className={cn('w-3 h-3 text-[#3D4F70] transition-transform', userMenuOpen && 'rotate-180')} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-[rgba(99,120,255,0.1)]">
                      <div className="text-sm font-bold text-[#E8EEFF]">{user.name}</div>
                      <div className="text-xs text-[#3D4F70] font-mono">{user.grade}-ci sinif</div>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                      <LogOut className="w-4 h-4" />Çıxış
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
        {/* Hero */}
        <div className="mb-6 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-full mb-4">
            <div className="glow-dot" />
            <span className="text-xs font-mono text-[#7B8DB0]">AI-powered · 700 bal sistemi</span>
          </div>
          <h1 className="text-3xl font-black text-[#E8EEFF] tracking-tight mb-2">
            Sınaqa <span className="gradient-text-animated">hazır</span> ol
          </h1>
          <p className="text-sm text-[#7B8DB0]">Sual bankı və ya internet axtarışı ilə sınaq başlat</p>
        </div>

        {/* Tabs */}
        <div className="tab-bar mb-6 animate-fade-up">
          <button onClick={() => setActiveTab('quiz')} className={cn('tab-item', activeTab === 'quiz' && 'active')}>
            <Layers className="w-4 h-4" />Sınaq
          </button>
          <button onClick={() => setActiveTab('search')} className={cn('tab-item', activeTab === 'search' && 'active')}>
            <Globe className="w-4 h-4" />İnternet axtarışı
          </button>
        </div>

        {/* Quiz tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-5 animate-fade-in">
            {/* Step 1: Grade */}
            <div className="section-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-[#6378FF] bg-[rgba(99,120,255,0.1)] border border-[rgba(99,120,255,0.2)] px-2.5 py-1 rounded-full font-mono">01</span>
                <h3 className="text-sm font-bold text-[#E8EEFF]">Sinif seçin</h3>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                {ALL_GRADES.map((g) => {
                  const col = GCOL[g];
                  const isActive = grade === g;
                  return (
                    <button key={g} onClick={() => setGrade(g)}
                      className={cn(
                        'relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-150',
                        isActive
                          ? 'border-[#6378FF] bg-[rgba(99,120,255,0.15)] scale-105 shadow-[0_0_16px_rgba(99,120,255,0.2)]'
                          : 'border-transparent hover:border-[rgba(99,120,255,0.3)] hover:-translate-y-1'
                      )}
                      style={{ background: isActive ? undefined : col.bg + '18', color: col.txt }}>
                      <span className="text-lg font-black leading-none">{g}</span>
                      <span className="text-[9px] font-semibold opacity-50 mt-0.5">sinif</span>
                      {isActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6378FF] rounded-full shadow-[0_0_8px_rgba(99,120,255,0.8)]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Exam type */}
            {grade && (
              <div className="section-card p-5 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-[#6378FF] bg-[rgba(99,120,255,0.1)] border border-[rgba(99,120,255,0.2)] px-2.5 py-1 rounded-full font-mono">02</span>
                  <h3 className="text-sm font-bold text-[#E8EEFF]">Sınaq növü</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'all_mixed' as const, icon: <BookOpen className="w-5 h-5" />, label: 'Bütün fənlər (qarışıq)', desc: 'Real imtahan kimi — hər fəndən uyğun sual sayı', color: '#6378FF' },
                    { id: 'by_subject' as const, icon: <Zap className="w-5 h-5" />, label: 'Fənn üzrə sınaq', desc: 'Seçdiyiniz fəndən bütün suallar', color: '#A855F7' },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setExamType(t.id)}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150',
                        examType === t.id
                          ? 'border-[#6378FF] bg-[rgba(99,120,255,0.08)]'
                          : 'border-[rgba(99,120,255,0.1)] bg-[#0D1120] hover:border-[rgba(99,120,255,0.3)] hover:-translate-y-0.5'
                      )}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: t.color + '1A', color: t.color }}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#E8EEFF] mb-1">{t.label}</div>
                        <div className="text-xs text-[#7B8DB0]">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Subject */}
            {grade && examType === 'by_subject' && (
              <div className="section-card p-5 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-[#6378FF] bg-[rgba(99,120,255,0.1)] border border-[rgba(99,120,255,0.2)] px-2.5 py-1 rounded-full font-mono">03</span>
                  <h3 className="text-sm font-bold text-[#E8EEFF]">Fənn seçin</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {subjects.map((s) => {
                    const subjectBank = (gradeBank as Record<string, Record<string, unknown[]>>)[s.name] || {};
                    const cnt = Object.values(subjectBank).reduce((n, a) => n + a.length, 0);
                    const topicCount = Object.keys(subjectBank).length;
                    return (
                      <button key={s.name} onClick={() => setSubject(s.name)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                          subject === s.name
                            ? 'border-[#6378FF] bg-[rgba(99,120,255,0.08)]'
                            : 'border-[rgba(99,120,255,0.1)] bg-[#0D1120] hover:border-[rgba(99,120,255,0.25)] hover:-translate-y-0.5'
                        )}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: s.bg + '28' }}>
                          {s.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#E8EEFF]">{s.name}</div>
                          <div className="text-[10px] text-[#3D4F70] font-mono">{cnt} sual · {topicCount} mövzu</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Topic */}
            {grade && examType === 'by_subject' && subject && (
              <div className="section-card p-5 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-[#6378FF] bg-[rgba(99,120,255,0.1)] border border-[rgba(99,120,255,0.2)] px-2.5 py-1 rounded-full font-mono">04</span>
                  <h3 className="text-sm font-bold text-[#E8EEFF]">Mövzu seçin</h3>
                  <span className="text-xs text-[#3D4F70] font-mono ml-auto">{topics.length} mövzu</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['all', ...topics].map((t) => (
                    <button key={t} onClick={() => setTopic(t)} className={cn('chip', topic === t && 'active')}>
                      {t === 'all' ? '📚 Bütün mövzular' : t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start */}
            {canStart && (
              <div className="animate-fade-up">
                <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06B6D4] via-[#6378FF] to-[#A855F7]" />
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="text-[10px] text-[#3D4F70] font-mono uppercase tracking-wider">Hazır</div>
                      {examType === 'all_mixed'
                        ? <p className="text-sm text-[#E8EEFF]"><span className="font-bold">{grade}-ci sinif</span> — Bütün fənlər qarışıq</p>
                        : <p className="text-sm text-[#E8EEFF]"><span className="font-bold">{subject}</span>{topic && topic !== 'all' && <span className="text-[#7B8DB0]"> · {topic}</span>}</p>}
                    </div>
                    <Button variant="primary" size="lg" onClick={handleStartQuiz} className="flex-shrink-0">
                      Sınaqa başla<ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
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
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </div>
  );
}
