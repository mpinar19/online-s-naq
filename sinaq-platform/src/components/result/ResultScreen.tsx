'use client';
import { useEffect, useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { getCurUser, saveHistory } from '@/lib/auth';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  Trophy, RotateCcw, CheckCircle, AlertCircle,
  Search, FileText, Tag, BookOpen, Layers, ChevronDown, ChevronUp
} from 'lucide-react';
import PDFUploadPanel from '@/components/pdf/PDFUploadPanel';
import SearchQuestionsModal from '@/components/modals/SearchQuestionsModal';

const LTR = ['A', 'B', 'C', 'D'];

export default function ResultScreen() {
  const { questions, answers, grade, examType, subject, topic, resetQuiz } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [expandedWrong, setExpandedWrong] = useState<number | null>(null);
  const [historySaved, setHistorySaved] = useState(false);

  const total = questions.length;
  const correct = answers.filter((a, i) => a !== null && a === questions[i].ans).length;
  const maxBal = questions.reduce((acc: number, q) => acc + (q.bal || 10), 0);
  const earned = answers.reduce((acc: number, a, i) => acc + (a !== null && a === questions[i].ans ? (questions[i].bal || 10) : 0), 0);
  const bal700 = maxBal > 0 ? Math.round((earned / maxBal) * 700) : 0;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const medal = pct >= 85 ? '🏆' : pct >= 70 ? '🥇' : pct >= 50 ? '🥈' : '🥉';
  const title = pct >= 85 ? 'Əla nəticə!' : pct >= 70 ? 'Yaxşı cəhd!' : pct >= 50 ? 'Orta səviyyə' : 'Daha çox məşq lazımdır';
  const scoreColor = pct >= 70 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';

  useEffect(() => {
    if (historySaved) return; // Yalnız 1 dəfə yaz
    setHistorySaved(true);
    const cu = getCurUser();
    if (!cu) return;
    const bd: Record<string, { correct: number; total: number; subject: string }> = {};
    questions.forEach((q, i) => {
      const t = q._topic || 'Digər';
      const s = q._subject || 'Digər';
      if (!bd[t]) bd[t] = { correct: 0, total: 0, subject: s };
      bd[t].total++;
      if (answers[i] === q.ans) bd[t].correct++;
    });
    const label = examType === 'all_mixed'
      ? `${grade}-ci sinif — Bütün fənlər`
      : `${subject}${topic && topic !== 'all' ? ' — ' + topic : ''} (${grade}-ci sinif)`;
    saveHistory(cu.username, { label, bal700, correct, total, pct, date: new Date().toLocaleDateString('az-AZ'), topicBreakdown: bd });
  }, []);

  const subjectMap: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q, i) => {
    const s = q._subject || '?';
    if (!subjectMap[s]) subjectMap[s] = { total: 0, correct: 0 };
    subjectMap[s].total++;
    if (answers[i] === q.ans) subjectMap[s].correct++;
  });

  const wrongs = questions.map((q, i) => ({ q, i, userAns: answers[i] })).filter(({ q, i }) => answers[i] !== q.ans);

  const tabs = [
    { label: 'Nəticə', icon: <Trophy className="w-3.5 h-3.5" /> },
    { label: `Səhvlər (${wrongs.length})`, icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { label: 'Bütün suallar', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Yeni sual', icon: <Search className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-[rgba(99,120,255,0.1)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#7B8DB0]">Sınaq nəticəsi</span>
          <Button variant="secondary" size="sm" onClick={() => { resetQuiz(); setScreen('home'); }}>
            <RotateCcw className="w-3.5 h-3.5" />Yeni sınaq
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-5">
        {/* Score card */}
        <div className="section-card p-6 text-center animate-fade-up">
          <div className="card-accent-top" />
          <div className="text-5xl mb-4 animate-float">{medal}</div>
          <div className="text-6xl font-black mb-1" style={{ color: scoreColor }}>{bal700}</div>
          <div className="text-sm text-[#7B8DB0] mb-3 font-mono">/ 700 bal</div>
          <div className="text-xl font-bold text-[#E8EEFF] mb-2">{title}</div>
          <div className="text-sm text-[#7B8DB0]">{correct}/{total} doğru · {pct}% · {earned} xam bal</div>
          <div className="mt-4 h-2 bg-[#0D1120] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { n: correct, l: 'Doğru', c: '#10B981' },
            { n: total - correct, l: 'Yanlış', c: '#EF4444' },
            { n: bal700, l: '/ 700', c: '#6378FF' },
            { n: pct + '%', l: 'Faiz', c: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} className="bg-[#141B2D] border border-[rgba(99,120,255,0.1)] rounded-xl p-3 text-center">
              <div className="text-xl font-black" style={{ color: s.c }}>{s.n}</div>
              <div className="text-[10px] text-[#3D4F70] font-semibold uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)} className={cn('tab-item', activeTab === i && 'active')}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 0: Subject breakdown */}
        {activeTab === 0 && (
          <div className="space-y-3 animate-fade-in">
            {Object.entries(subjectMap).map(([subj, v]) => {
              const p = Math.round((v.correct / v.total) * 100);
              const fc = p >= 80 ? '#10B981' : p >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <div key={subj} className="bg-[#141B2D] border border-[rgba(99,120,255,0.1)] rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#E8EEFF] mb-1 truncate">{subj}</div>
                    <div className="text-xs text-[#7B8DB0]">{v.correct}/{v.total} doğru</div>
                  </div>
                  <div className="w-28 flex-shrink-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: fc }} className="font-bold">{p}%</span>
                    </div>
                    <div className="h-2 bg-[#0D1120] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p}%`, background: fc }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="primary" onClick={() => { resetQuiz(); setScreen('home'); }}>
                <RotateCcw className="w-4 h-4" />Yeni sınaq
              </Button>
            </div>
          </div>
        )}

        {/* Tab 1: Wrong answers with full explanation */}
        {activeTab === 1 && (
          <div className="animate-fade-in space-y-3">
            {wrongs.length === 0 ? (
              <div className="section-card p-10 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <div className="text-lg font-bold text-[#E8EEFF] mb-1">Əla!</div>
                <div className="text-sm text-[#7B8DB0]">Bütün sualları düzgün cavabladınız!</div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 p-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                  <span className="text-sm text-[#EF4444] font-semibold">{wrongs.length} səhv cavab — aşağıda izahat</span>
                </div>
                {wrongs.map(({ q, i, userAns }, wi) => {
                  const isOpen = expandedWrong === wi;
                  return (
                    <div key={i} className="bg-[#141B2D] border border-[rgba(239,68,68,0.2)] rounded-xl overflow-hidden">
                      {/* Header — always visible */}
                      <button
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-[rgba(239,68,68,0.04)] transition-all"
                        onClick={() => setExpandedWrong(isOpen ? null : wi)}>
                        <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-black text-[#EF4444]">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {q._subject && <span className="topic-tag">{q._subject}</span>}
                            {q._topic && <span className="topic-tag">{q._topic}</span>}
                          </div>
                          <p className="text-sm font-semibold text-[#E8EEFF] leading-snug">{q.q}</p>
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {isOpen
                            ? <ChevronUp className="w-4 h-4 text-[#3D4F70]" />
                            : <ChevronDown className="w-4 h-4 text-[#3D4F70]" />}
                        </div>
                      </button>

                      {/* Expanded — answers + explanation */}
                      {isOpen && (
                        <div className="px-4 pb-4 space-y-3 animate-fade-in border-t border-[rgba(239,68,68,0.1)]">
                          {/* All options */}
                          <div className="pt-3 space-y-2">
                            {q.opts.map((opt, j) => {
                              const isCorrect = j === q.ans;
                              const isUser = j === userAns;
                              let cls = 'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all';
                              if (isCorrect) cls += ' bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[#6EE7B7]';
                              else if (isUser && !isCorrect) cls += ' bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#FCA5A5]';
                              else cls += ' bg-[#0D1120] border-[rgba(99,120,255,0.08)] text-[#7B8DB0]';
                              return (
                                <div key={j} className={cls}>
                                  <span className="font-bold font-mono w-5 flex-shrink-0">{LTR[j]})</span>
                                  <span className="flex-1">{opt}</span>
                                  {isCorrect && <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />}
                                  {isUser && !isCorrect && <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Your answer vs correct */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl">
                              <div className="text-[10px] text-[#EF4444] font-bold uppercase tracking-wider mb-1">Sizin cavab</div>
                              <div className="text-xs text-[#FCA5A5] font-semibold">
                                {userAns !== null ? `${LTR[userAns]}) ${q.opts[userAns]}` : '— Cavabsız'}
                              </div>
                            </div>
                            <div className="p-3 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-xl">
                              <div className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider mb-1">Doğru cavab</div>
                              <div className="text-xs text-[#6EE7B7] font-semibold">{LTR[q.ans]}) {q.opts[q.ans]}</div>
                            </div>
                          </div>

                          {/* Explanation */}
                          {q.exp && (
                            <div className="p-3 bg-[rgba(245,158,11,0.07)] border border-[rgba(245,158,11,0.15)] rounded-xl">
                              <div className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-wider mb-1.5">💡 İzahat</div>
                              <p className="text-xs text-[#FCD34D] leading-relaxed">{q.exp}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Tab 2: All questions */}
        {activeTab === 2 && (
          <div className="space-y-3 animate-fade-in">
            {questions.map((q, i) => {
              const ok = answers[i] === q.ans;
              return (
                <div key={i} className={cn(
                  'bg-[#141B2D] border rounded-xl p-4',
                  ok ? 'border-[rgba(16,185,129,0.15)]' : 'border-[rgba(239,68,68,0.15)]'
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                      ok ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]' : 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
                    )}>
                      {ok ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {q._topic && <span className="topic-tag">{q._topic}</span>}
                      </div>
                      <p className="text-sm font-semibold text-[#E8EEFF] mb-2">{i + 1}. {q.q}</p>
                      <div className="text-xs text-[#7B8DB0] space-y-0.5">
                        <div>Sizin: <span className={ok ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                          {answers[i] !== null ? `${LTR[answers[i]!]}) ${q.opts[answers[i]!]}` : 'Cavabsız'}
                        </span></div>
                        {!ok && <div>Doğru: <span className="text-[#10B981]">{LTR[q.ans]}) {q.opts[q.ans]}</span></div>}
                        {q.exp && <div className="text-[#3D4F70] mt-1 leading-relaxed">{q.exp}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: New questions */}
        {activeTab === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowSearch(true)}
                className="flex flex-col items-center gap-3 p-5 bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-2xl hover:border-[rgba(99,120,255,0.35)] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[rgba(99,120,255,0.1)] flex items-center justify-center group-hover:bg-[rgba(99,120,255,0.2)] transition-all">
                  <Search className="w-6 h-6 text-[#6378FF]" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#E8EEFF]">İnternet axtarışı</div>
                  <div className="text-xs text-[#7B8DB0] mt-1">Mövzu üzrə yeni suallar</div>
                </div>
              </button>
              <button onClick={() => setActiveTab(3)}
                className="flex flex-col items-center gap-3 p-5 bg-[#141B2D] border border-[rgba(168,85,247,0.15)] rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[rgba(168,85,247,0.1)] flex items-center justify-center group-hover:bg-[rgba(168,85,247,0.2)] transition-all">
                  <FileText className="w-6 h-6 text-[#A855F7]" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#E8EEFF]">PDF yüklə</div>
                  <div className="text-xs text-[#7B8DB0] mt-1">AI sualları oxuyub yarat</div>
                </div>
              </button>
            </div>
            <PDFUploadPanel />
          </div>
        )}
      </div>

      {showSearch && <SearchQuestionsModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
