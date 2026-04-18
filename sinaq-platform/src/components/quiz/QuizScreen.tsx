'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { fmtTimer, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock, Flag } from 'lucide-react';

const LTR = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const {
    questions, current, answers, timerLeft, examFinished,
    setAnswer, setCurrent, setTimerLeft, finishExam,
  } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    if (examFinished) return;
    timerRef.current = setInterval(() => {
      setTimerLeft(Math.max(0, timerLeft - 1));
      if (timerLeft <= 1) {
        clearInterval(timerRef.current!);
        finishExam();
        setScreen('result');
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerLeft, examFinished]);

  if (!questions.length) {
    setScreen('home');
    return null;
  }

  const q = questions[current];
  const total = questions.length;
  const answered = answers.filter((a) => a !== null).length;
  const userAns = answers[current];
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const bal = q.bal || 10;
  const diffCls = bal >= 14 ? 'text-[#EF4444] bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]'
    : bal >= 12 ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)]'
    : 'text-[#10B981] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]';
  const diffLbl = bal >= 14 ? 'Çətin' : bal >= 12 ? 'Orta' : 'Asan';
  const timerDanger = timerLeft <= 60;
  const progress = ((current + 1) / total) * 100;

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    finishExam();
    setScreen('result');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 glass border-b border-[rgba(99,120,255,0.12)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#7B8DB0] font-mono">
              {current + 1} / {total}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold',
              timerDanger
                ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444] timer-danger'
                : 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-[#F59E0B]'
            )}>
              <Clock className="w-3.5 h-3.5" />
              {fmtTimer(timerLeft)}
            </div>

            {/* Finish button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFinishModal(true)}
              className="hidden sm:flex"
            >
              <Flag className="w-3.5 h-3.5" />
              Bitir
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar rounded-none">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Nav dots */}
      <div className="bg-[rgba(8,11,20,0.8)] border-b border-[rgba(99,120,255,0.08)] px-4 py-2">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'q-dot',
                examFinished
                  ? answers[i] === questions[i].ans ? 'correct' : 'wrong'
                  : i === current ? 'current'
                  : answers[i] !== null ? 'answered' : ''
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-2xl p-6 mb-4 relative overflow-hidden animate-fade-up">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06B6D4] via-[#6378FF] to-[#A855F7]" />

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            {q._subject && (
              <span className="stat-badge bg-[rgba(99,120,255,0.1)] border border-[rgba(99,120,255,0.2)] text-[#6378FF]">
                {q._subject}
              </span>
            )}
            {q._topic && (
              <span className="stat-badge bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] text-[#06B6D4]">
                {q._topic}
              </span>
            )}
            <span className={cn('stat-badge border', diffCls)}>{diffLbl}</span>
            <span className="stat-badge bg-[#1A2235] border border-[rgba(99,120,255,0.12)] text-[#7B8DB0] font-mono">
              {bal} bal
            </span>
            <span className="ml-auto text-xs text-[#3D4F70] font-mono self-center">
              {answered}/{total} cavablandı
            </span>
          </div>

          {/* Question text */}
          <p className="text-base font-semibold text-[#E8EEFF] leading-relaxed mb-5">{q.q}</p>

          {/* Options */}
          <div className="space-y-2.5">
            {q.opts.map((opt, i) => {
              let cls = 'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 text-left w-full';
              let ltrCls = 'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 border transition-all';

              if (examFinished) {
                if (i === q.ans) {
                  cls += ' border-[rgba(16,185,129,0.5)] bg-[rgba(16,185,129,0.08)]';
                  ltrCls += ' bg-[#10B981] text-white border-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                } else if (i === userAns && i !== q.ans) {
                  cls += ' border-[rgba(239,68,68,0.5)] bg-[rgba(239,68,68,0.08)]';
                  ltrCls += ' bg-[#EF4444] text-white border-[#EF4444]';
                } else {
                  cls += ' border-[rgba(99,120,255,0.08)] bg-[#0D1120] opacity-50';
                  ltrCls += ' bg-[#141B2D] text-[#3D4F70] border-[rgba(99,120,255,0.12)]';
                }
              } else if (userAns === i) {
                cls += ' border-[rgba(99,120,255,0.5)] bg-[rgba(99,120,255,0.08)]';
                ltrCls += ' bg-[#6378FF] text-white border-[#6378FF] shadow-[0_0_10px_rgba(99,120,255,0.3)]';
              } else {
                cls += ' border-[rgba(99,120,255,0.12)] bg-[#0D1120] hover:border-[rgba(99,120,255,0.35)] hover:bg-[rgba(99,120,255,0.05)] hover:translate-x-1';
                ltrCls += ' bg-[#141B2D] text-[#3D4F70] border-[rgba(99,120,255,0.15)]';
              }

              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => !examFinished && setAnswer(current, i)}
                  disabled={examFinished}
                >
                  <div className={ltrCls}>{LTR[i]}</div>
                  <span className="text-sm font-medium text-[#E8EEFF]">{opt}</span>
                  {examFinished && i === q.ans && (
                    <CheckCircle className="w-4 h-4 text-[#10B981] ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation (after finish) */}
          {examFinished && (
            <div className={cn(
              'mt-4 p-4 rounded-xl border text-sm font-medium leading-relaxed animate-fade-in',
              userAns === q.ans
                ? 'bg-[rgba(16,185,129,0.08)] border-[rgba(16,185,129,0.2)] text-[#6EE7B7]'
                : 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.2)] text-[#FCD34D]'
            )}>
              <span className="font-bold">{userAns === q.ans ? '✓ Doğru! ' : '✗ Yanlış. '}</span>
              {q.exp}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={isFirst}
          >
            <ChevronLeft className="w-4 h-4" />
            Əvvəlki
          </Button>

          {answered === total && !examFinished && (
            <Button variant="primary" onClick={handleFinish}>
              <CheckCircle className="w-4 h-4" />
              İmtahanı bitir
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setCurrent(Math.min(total - 1, current + 1))}
            disabled={isLast}
          >
            Növbəti
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl p-6 max-w-sm w-full animate-fade-up">
            <h3 className="text-lg font-bold text-[#E8EEFF] mb-2">Sınaği dayandır?</h3>
            <p className="text-sm text-[#7B8DB0] mb-5">İrəliləyişiniz silinəcək.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowExitModal(false)}>Geri qayıt</Button>
              <Button variant="danger" onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setScreen('home'); }}>
                Bəli, çıx
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl p-6 max-w-sm w-full animate-fade-up">
            <h3 className="text-lg font-bold text-[#E8EEFF] mb-2">İmtahanı bitirmək istəyirsiniz?</h3>
            <p className="text-sm text-[#7B8DB0] mb-5">
              {answered}/{total} sual cavablandı.
              {answered < total && <span className="text-[#F59E0B]"> {total - answered} sual hələ cavabsız.</span>}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowFinishModal(false)}>Geri qayıt</Button>
              <Button variant="primary" onClick={handleFinish}>İmtahanı bitir</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
