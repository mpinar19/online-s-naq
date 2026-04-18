'use client';
import { useState, useRef } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { GeneratedQuestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Upload, FileText, Loader2, RefreshCw, BookOpen, Tag, Trash2, CheckCircle, Layers } from 'lucide-react';

const LTR = ['A', 'B', 'C', 'D'];

interface Props {
  teacherMode?: boolean; // müəllim rejimində sualları silmək mümkün
}

interface TopicGroup {
  name: string;
  questions: (GeneratedQuestion & { _idx: number })[];
}

export default function PDFUploadPanel({ teacherMode = false }: Props) {
  const { setUploadedText, setGenQuestions, genQuestions, launchQuiz } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState('');
  const [count, setCount] = useState('10');
  const [difficulty, setDifficulty] = useState('qarışıq');
  const [lang, setLang] = useState('Azərbaycan dilində');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [deletedIdxs, setDeletedIdxs] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadedRef = useRef<{ text: string; isBase64: boolean }>({ text: '', isBase64: false });

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError('Fayl 10MB-dan böyükdür.'); return; }
    setFileName(file.name); setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        uploadedRef.current = { text: result, isBase64: true };
        setUploadedText(result, file.name, true);
      } else {
        const text = result.slice(0, 15000);
        uploadedRef.current = { text, isBase64: false };
        setUploadedText(text, file.name, false);
      }
      setStep(2);
    };
    if (file.name.toLowerCase().endsWith('.pdf')) reader.readAsDataURL(file);
    else reader.readAsText(file, 'UTF-8');
  };

  const handleGenerate = async () => {
    if (!uploadedRef.current.text) { setError('Fayl yüklənməyib'); return; }
    setLoading(true); setStep(3); setError(''); setDeletedIdxs(new Set());
    const texts = ['Mətn analiz edilir...', 'Mövzular müəyyənləşdirilir...', 'Suallar yaradılır...', 'Cavablar formalaşdırılır...', 'Yekun yoxlama...'];
    let li = 0;
    const interval = setInterval(() => setLoadingText(texts[li++ % texts.length]), 2000);
    try {
      const res = await fetch('/api/generate-from-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: uploadedRef.current.text, isBase64: uploadedRef.current.isBase64, fileName, count: parseInt(count), difficulty, lang }),
      });
      clearInterval(interval);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setGenQuestions(data.questions || []);
      setTopics(data.topics || []);
      setStep(4);
    } catch (e) {
      clearInterval(interval);
      setError('Xəta: ' + (e instanceof Error ? e.message : 'bilinməyən'));
      setStep(2);
    } finally { setLoading(false); }
  };

  const reset = () => {
    setStep(1); setFileName(''); setGenQuestions([]); setTopics([]);
    setSelectedTopic('all'); setError(''); setDeletedIdxs(new Set());
    uploadedRef.current = { text: '', isBase64: false };
  };

  const deleteQuestion = (idx: number) => {
    setDeletedIdxs(prev => new Set([...prev, idx]));
  };

  const deleteAllInTopic = (topicName: string) => {
    const toDelete = genQuestions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => (q.topic || 'Ümumi') === topicName)
      .map(({ i }) => i);
    setDeletedIdxs(prev => new Set([...prev, ...toDelete]));
  };

  const visibleQuestions = genQuestions
    .map((q, i) => ({ ...q, _idx: i }))
    .filter(q => !deletedIdxs.has(q._idx));

  const topicGroups: TopicGroup[] = (() => {
    const filtered = selectedTopic === 'all' ? visibleQuestions : visibleQuestions.filter(q => (q.topic || 'Ümumi') === selectedTopic);
    const map: Record<string, (GeneratedQuestion & { _idx: number })[]> = {};
    filtered.forEach(q => {
      const t = q.topic || 'Ümumi';
      if (!map[t]) map[t] = [];
      map[t].push(q);
    });
    return Object.entries(map).map(([name, questions]) => ({ name, questions }));
  })();

  const handleStartQuiz = (qs?: (GeneratedQuestion & { _idx: number })[]) => {
    const source = qs || visibleQuestions;
    launchQuiz(source.map(q => ({ q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, bal: 10, _subject: 'PDF — ' + fileName, _topic: q.topic || 'Ümumi' })));
    setScreen('quiz');
  };

  const card: React.CSSProperties = { background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 18, overflow: 'hidden', position: 'relative' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ ...card, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText style={{ width: 20, height: 20, color: '#A855F7' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>PDF-dən sual yarat</div>
            <div style={{ fontSize: 12, color: '#7B8DB0', marginTop: 2 }}>PDF faylı yüklə — AI mövzulara görə suallar yaradacaq</div>
          </div>
          {step > 1 && (
            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7B8DB0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <RefreshCw style={{ width: 14, height: 14 }} />Sıfırla
            </button>
          )}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          {[{ n: 1, l: 'Fayl' }, { n: 2, l: 'Parametr' }, { n: 3, l: 'Yüklənir' }, { n: 4, l: 'Nəticə' }].map((s, i, arr) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, border: '1px solid',
                  background: step > s.n ? '#10B981' : step === s.n ? 'rgba(99,120,255,0.15)' : '#0D1120',
                  borderColor: step > s.n ? '#10B981' : step === s.n ? '#6378FF' : 'rgba(99,120,255,0.15)',
                  color: step > s.n ? '#fff' : step === s.n ? '#6378FF' : '#3D4F70',
                }}>
                  {step > s.n ? <CheckCircle style={{ width: 14, height: 14 }} /> : s.n}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: step >= s.n ? '#7B8DB0' : '#3D4F70', display: 'none' }} className="sm:inline">{s.l}</span>
              </div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: step > s.n ? '#10B981' : 'rgba(99,120,255,0.1)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div style={card} className="animate-fade-in">
          <div style={{ padding: 20 }}>
            <div
              style={{ border: `2px dashed ${dragOver ? 'rgba(99,120,255,0.5)' : 'rgba(99,120,255,0.2)'}`, borderRadius: 16, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(99,120,255,0.04)' : 'transparent', transition: 'all 0.2s' }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Upload style={{ width: 28, height: 28, color: '#A855F7' }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF', margin: '0 0 6px' }}>PDF faylı seçin və ya buraya sürükləyin</p>
              <p style={{ fontSize: 12, color: '#7B8DB0', margin: 0 }}>PDF, TXT · Maks. 10MB</p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            {error && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 12 }}>{error}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Params */}
      {step === 2 && (
        <div style={{ ...card, padding: 20 }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, marginBottom: 20 }}>
            <CheckCircle style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6EE7B7' }}>{fileName} — hazır</span>
          </div>

          {[
            { label: 'Sual sayı', items: ['5','10','20','30','50'], val: count, set: setCount },
            { label: 'Çətinlik', items: ['qarışıq','asan','orta','çətin'], val: difficulty, set: setDifficulty },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{row.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {row.items.map(item => (
                  <button key={item} onClick={() => row.set(item)} className={`chip${row.val === item ? ' active' : ''}`}>{item}</button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Dil</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[{ val: 'Azərbaycan dilində', l: '🇦🇿 Azərbaycan' }, { val: 'rus dilində', l: '🇷🇺 Rus' }, { val: 'ingilis dilində', l: '🇬🇧 İngilis' }].map(l => (
                <button key={l.val} onClick={() => setLang(l.val)} className={`chip${lang === l.val ? ' active' : ''}`}>{l.l}</button>
              ))}
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>}
          <Button variant="primary" onClick={handleGenerate} className="w-full">
            <BookOpen style={{ width: 16, height: 16 }} />Suallar yarat
          </Button>
        </div>
      )}

      {/* Step 3: Loading */}
      {step === 3 && (
        <div style={{ ...card, padding: 40, textAlign: 'center' }} className="animate-fade-in">
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(99,120,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative' }}>
            <Loader2 style={{ width: 32, height: 32, color: '#6378FF' }} className="animate-spin" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#E8EEFF', margin: '0 0 8px' }}>{loadingText || 'Suallar yaradılır...'}</p>
          <p style={{ fontSize: 12, color: '#7B8DB0', margin: 0 }}>AI PDF-i oxuyur, bir az gözləyin</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6378FF', opacity: 0.6, animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />)}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Summary */}
          <div style={{ ...card, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle style={{ width: 20, height: 20, color: '#10B981' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{visibleQuestions.length} sual</div>
                  <div style={{ fontSize: 11, color: '#7B8DB0', fontFamily: 'monospace', marginTop: 2 }}>{topics.length} mövzu · {fileName}</div>
                </div>
              </div>
              <Button variant="primary" onClick={() => handleStartQuiz()}>
                <Play style={{ width: 16, height: 16 }} />Bütün suallarla başla
              </Button>
            </div>
          </div>

          {/* Topic filter */}
          {topics.length > 1 && (
            <div style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Mövzuya görə filtr</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button onClick={() => setSelectedTopic('all')} className={`chip${selectedTopic === 'all' ? ' active' : ''}`}>
                  <Layers style={{ width: 12, height: 12 }} />Bütün ({visibleQuestions.length})
                </button>
                {topics.map(t => {
                  const cnt = visibleQuestions.filter(q => (q.topic || 'Ümumi') === t).length;
                  if (cnt === 0) return null;
                  return (
                    <button key={t} onClick={() => setSelectedTopic(t)} className={`chip${selectedTopic === t ? ' active' : ''}`}>
                      <Tag style={{ width: 12, height: 12 }} />{t} ({cnt})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Questions by topic */}
          {topicGroups.map(group => (
            <div key={group.name} style={{ ...card }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(99,120,255,0.05)', borderBottom: '1px solid rgba(99,120,255,0.1)', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag style={{ width: 14, height: 14, color: '#06B6D4' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{group.name}</span>
                  <span style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace' }}>{group.questions.length} sual</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => handleStartQuiz(group.questions)}>
                    <Play style={{ width: 12, height: 12 }} />Bu mövzudan başla
                  </Button>
                  {teacherMode && (
                    <Button variant="danger" size="sm" onClick={() => deleteAllInTopic(group.name)}>
                      <Trash2 style={{ width: 12, height: 12 }} />Mövzunu sil
                    </Button>
                  )}
                </div>
              </div>

              <div style={{ borderTop: 'none' }}>
                {group.questions.map((q, i) => (
                  <div key={q._idx} style={{ padding: '16px 20px', borderBottom: i < group.questions.length - 1 ? '1px solid rgba(99,120,255,0.06)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#3D4F70', flexShrink: 0, marginTop: 2, background: '#0D1120', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(99,120,255,0.1)' }}>{i + 1}</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.q}</p>
                      {teacherMode && (
                        <button onClick={() => deleteQuestion(q._idx)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#EF4444', flexShrink: 0 }}>
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {q.opts.map((opt, j) => (
                        <div key={j} style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, fontSize: 12,
                          background: j === q.ans ? 'rgba(16,185,129,0.1)' : '#0D1120',
                          border: j === q.ans ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,120,255,0.06)',
                          color: j === q.ans ? '#6EE7B7' : '#7B8DB0',
                        }}>
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', width: 16, flexShrink: 0 }}>{LTR[j]})</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {j === q.ans && <CheckCircle style={{ width: 12, height: 12, color: '#10B981', flexShrink: 0 }} />}
                        </div>
                      ))}
                    </div>
                    {q.exp && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 10 }}>
                        <p style={{ fontSize: 11, color: '#FCD34D', margin: 0, opacity: 0.8, lineHeight: 1.5 }}>💡 {q.exp}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {visibleQuestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#7B8DB0' }}>
              <p style={{ fontSize: 14 }}>Bütün suallar silindi.</p>
              <button onClick={reset} style={{ marginTop: 12, fontSize: 13, color: '#6378FF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Yenidən yüklə</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Play icon (lucide-react-dən import etmək əvəzinə)
function Play({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
