'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { fmtTimer } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock, Flag, Cpu } from 'lucide-react';

const LTR = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const { questions, current, answers, timerLeft, examFinished, setAnswer, setCurrent, setTimerLeft, finishExam } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showExit, setShowExit] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  useEffect(() => {
    if (examFinished) return;
    timerRef.current = setInterval(() => {
      setTimerLeft(Math.max(0, timerLeft - 1));
      if (timerLeft <= 1) { clearInterval(timerRef.current!); finishExam(); setScreen('result'); }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerLeft, examFinished]);

  if (!questions.length) { setScreen('home'); return null; }

  const q = questions[current];
  const total = questions.length;
  const answered = answers.filter(a => a !== null).length;
  const userAns = answers[current];
  const bal = q.bal || 10;
  const diffLabel = bal >= 14 ? 'Çətin' : bal >= 12 ? 'Orta' : 'Asan';
  const diffColor = bal >= 14 ? '#EF4444' : bal >= 12 ? '#F59E0B' : '#10B981';
  const timerDanger = timerLeft <= 60;
  const progress = ((current + 1) / total) * 100;

  const doFinish = () => { if (timerRef.current) clearInterval(timerRef.current); finishExam(); setScreen('result'); };

  const modal = (title: string, body: React.ReactNode, onConfirm: () => void, confirmLabel: string, danger = false) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, padding: 24, maxWidth: 360, width: '100%' }} className="animate-fade-up">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#E8EEFF', margin: '0 0 10px' }}>{title}</h3>
        <div style={{ fontSize: 13, color: '#7B8DB0', marginBottom: 20, lineHeight: 1.6 }}>{body}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => { setShowExit(false); setShowFinish(false); }}>Geri qayıt</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,32,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setShowExit(true)} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
              <X style={{ width: 15, height: 15 }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu style={{ width: 13, height: 13, color: '#3D4F70' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#7B8DB0', fontFamily: 'monospace' }}>{current + 1} / {total}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 12, border: `1px solid ${timerDanger ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`, background: timerDanger ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.08)', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: timerDanger ? '#EF4444' : '#F59E0B' }} className={timerDanger ? 'timer-danger' : ''}>
              <Clock style={{ width: 14, height: 14 }} />{fmtTimer(timerLeft)}
            </div>
            <button onClick={() => setShowFinish(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#6378FF,#A855F7)', color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Flag style={{ width: 13, height: 13 }} />Bitir
            </button>
          </div>
        </div>
        {/* Progress */}
        <div style={{ height: 3, background: 'rgba(99,120,255,0.08)' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Nav dots */}
      <div style={{ background: 'rgba(8,11,20,0.9)', borderBottom: '1px solid rgba(99,120,255,0.07)', padding: '10px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {questions.map((_, i) => {
            let bg = '#111827', border = 'rgba(99,120,255,0.15)', color = '#3D4F70';
            if (examFinished) {
              if (answers[i] === questions[i].ans) { bg = 'rgba(16,185,129,0.15)'; border = 'rgba(16,185,129,0.4)'; color = '#10B981'; }
              else { bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.4)'; color = '#EF4444'; }
            } else if (i === current) { bg = '#6378FF'; border = '#6378FF'; color = '#fff'; }
            else if (answers[i] !== null) { bg = 'rgba(99,120,255,0.1)'; border = 'rgba(99,120,255,0.4)'; color = '#6378FF'; }
            return (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${border}`, background: bg, fontSize: 10, fontWeight: 700, color, cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, maxWidth: 760, margin: '0 auto', width: '100%', padding: '24px 16px' }}>
        <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 20, padding: 24, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#06B6D4,#6378FF,#A855F7)' }} />

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {q._subject && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,120,255,0.1)', border: '1px solid rgba(99,120,255,0.2)', color: '#6378FF' }}>{q._subject}</span>}
            {q._topic && <span className="topic-tag">{q._topic}</span>}
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: diffColor + '18', border: `1px solid ${diffColor}30`, color: diffColor }}>{diffLabel}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#1A2235', border: '1px solid rgba(99,120,255,0.1)', color: '#7B8DB0', fontFamily: 'monospace' }}>{bal} bal</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', alignSelf: 'center' }}>{answered}/{total} cavablandı</span>
          </div>

          {/* Question text */}
          <p style={{ fontSize: 15, fontWeight: 600, color: '#E8EEFF', lineHeight: 1.6, marginBottom: 20 }}>{q.q}</p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.opts.map((opt, i) => {
              let bg = '#0D1120', border = 'rgba(99,120,255,0.1)', color = '#E8EEFF', ltrBg = '#141B2D', ltrColor = '#3D4F70', ltrBorder = 'rgba(99,120,255,0.12)';
              if (examFinished) {
                if (i === q.ans) { bg = 'rgba(16,185,129,0.07)'; border = 'rgba(16,185,129,0.4)'; ltrBg = '#10B981'; ltrColor = '#fff'; ltrBorder = '#10B981'; }
                else if (i === userAns) { bg = 'rgba(239,68,68,0.07)'; border = 'rgba(239,68,68,0.4)'; ltrBg = '#EF4444'; ltrColor = '#fff'; ltrBorder = '#EF4444'; color = '#FCA5A5'; }
                else { color = '#3D4F70'; }
              } else if (userAns === i) {
                bg = 'rgba(99,120,255,0.07)'; border = 'rgba(99,120,255,0.5)'; ltrBg = '#6378FF'; ltrColor = '#fff'; ltrBorder = '#6378FF';
              }
              return (
                <button key={i} onClick={() => !examFinished && setAnswer(current, i)} disabled={examFinished}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, cursor: examFinished ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.12s', width: '100%' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: ltrBg, border: `1px solid ${ltrBorder}`, color: ltrColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: 'monospace' }}>{LTR[i]}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color, flex: 1, lineHeight: 1.5 }}>{opt}</span>
                  {examFinished && i === q.ans && <CheckCircle style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {examFinished && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 14, background: userAns === q.ans ? 'rgba(16,185,129,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${userAns === q.ans ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }} className="animate-fade-in">
              <span style={{ fontSize: 13, fontWeight: 700, color: userAns === q.ans ? '#10B981' : '#F59E0B' }}>{userAns === q.ans ? '✓ Doğru! ' : '✗ Yanlış. '}</span>
              <span style={{ fontSize: 13, color: userAns === q.ans ? '#6EE7B7' : '#FCD34D', lineHeight: 1.6 }}>{q.exp}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Button variant="secondary" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            <ChevronLeft style={{ width: 16, height: 16 }} />Əvvəlki
          </Button>
          {answered === total && !examFinished && (
            <Button variant="primary" onClick={doFinish}>
              <CheckCircle style={{ width: 16, height: 16 }} />İmtahanı bitir
            </Button>
          )}
          <Button variant="secondary" onClick={() => setCurrent(Math.min(total - 1, current + 1))} disabled={current === total - 1}>
            Növbəti<ChevronRight style={{ width: 16, height: 16 }} />
          </Button>
        </div>
      </div>

      {showExit && modal('Sınaği dayandır?', 'İrəliləyişiniz silinəcək.', () => { if (timerRef.current) clearInterval(timerRef.current); setScreen('home'); }, 'Bəli, çıx', true)}
      {showFinish && modal('İmtahanı bitirmək istəyirsiniz?',
        <>{answered}/{total} sual cavablandı.{answered < total && <span style={{ color: '#F59E0B' }}> {total - answered} sual hələ cavabsız.</span>}</>,
        doFinish, 'İmtahanı bitir')}
    </div>
  );
}
