'use client';
import { useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { GeneratedQuestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import { X, Search, Loader2, Globe, BookOpen, Tag, Sparkles, FileText } from 'lucide-react';

const LTR = ['A', 'B', 'C', 'D'];

const QUICK = [
  { label: 'Fotosintez', subject: 'Biologiya' },
  { label: 'Kvadrat tənlik', subject: 'Riyaziyyat' },
  { label: 'Nyuton qanunları', subject: 'Fizika' },
  { label: 'Azərbaycan tarixi', subject: 'Tarix' },
  { label: 'Kimyəvi reaksiyalar', subject: 'Kimya' },
  { label: 'Coğrafi kəşflər', subject: 'Coğrafiya' },
];

interface Props {
  onClose: () => void;
  inline?: boolean;
}

type SearchTab = 'internet' | 'text';

export default function SearchQuestionsModal({ onClose, inline = false }: Props) {
  const { launchQuiz } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const [searchTab, setSearchTab] = useState<SearchTab>('internet');

  // Internet search state
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [count, setCount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selTopic, setSelTopic] = useState('all');

  // Text-to-quiz state
  const [textInput, setTextInput] = useState('');
  const [textCount, setTextCount] = useState('10');
  const [textLoading, setTextLoading] = useState(false);
  const [textQuestions, setTextQuestions] = useState<GeneratedQuestion[]>([]);
  const [textError, setTextError] = useState('');

  const allTopics = [...new Set(questions.map(q => q.topic).filter(Boolean))] as string[];

  const doSearch = async () => {
    if (!topic && !subject) { setError('Mövzu daxil edin'); return; }
    setLoading(true); setError(''); setQuestions([]); setSearched(false);
    try {
      const res = await fetch('/api/search-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, count: parseInt(count) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xəta');
      setQuestions(data.questions || []);
      setSearched(true); setSelTopic('all');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xəta baş verdi');
    } finally { setLoading(false); }
  };

  const doTextQuiz = async () => {
    if (!textInput.trim() || textInput.trim().length < 20) { setTextError('Mətn ən az 20 simvol olmalıdır'); return; }
    setTextLoading(true); setTextError(''); setTextQuestions([]);
    try {
      const res = await fetch('/api/text-to-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput, count: parseInt(textCount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xəta');
      setTextQuestions(data.questions || []);
    } catch (e) {
      setTextError(e instanceof Error ? e.message : 'Xəta baş verdi');
    } finally { setTextLoading(false); }
  };

  const filtered = selTopic === 'all' ? questions : questions.filter(q => q.topic === selTopic);

  const startQuiz = (qs: GeneratedQuestion[]) => {
    launchQuiz(qs.map(q => ({ q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, bal: 10, _subject: subject || 'Axtarış', _topic: q.topic || topic || 'Ümumi' })));
    onClose(); setScreen('quiz');
  };

  // Styles
  const inp: React.CSSProperties = { width: '100%', padding: '10px 13px', background: 'var(--bg2)', border: '1px solid var(--bd2)', borderRadius: 11, color: 'var(--txt)', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 };

  const questionCard = (q: GeneratedQuestion, i: number) => (
    <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--txt3)', flexShrink: 0, marginTop: 2, background: 'var(--surface)', padding: '2px 5px', borderRadius: 4, border: '1px solid var(--bd)' }}>{i + 1}</span>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.q}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8 }}>
        {q.opts.map((opt, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 9, fontSize: 12, background: j === q.ans ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: j === q.ans ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--bd)', color: j === q.ans ? 'var(--green)' : 'var(--txt2)' }}>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', width: 14, flexShrink: 0 }}>{LTR[j]})</span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
            {j === q.ans && <span style={{ color: 'var(--green)' }}>✓</span>}
          </div>
        ))}
      </div>
      {q.topic && <span className="topic-tag"><Tag style={{ width: 10, height: 10 }} />{q.topic}</span>}
    </div>
  );

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Sub-tabs */}
      <div style={{ padding: '12px 16px 0', borderBottom: '1px solid var(--bd)' }}>
        <div className="tab-bar" style={{ marginBottom: 0 }}>
          <button onClick={() => setSearchTab('internet')} className={`tab-item${searchTab === 'internet' ? ' active' : ''}`}>
            <Globe style={{ width: 14, height: 14 }} />İnternet axtarışı
          </button>
          <button onClick={() => setSearchTab('text')} className={`tab-item${searchTab === 'text' ? ' active' : ''}`}>
            <FileText style={{ width: 14, height: 14 }} />Mətn → Sual
          </button>
        </div>
      </div>

      {/* Internet search */}
      {searchTab === 'internet' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quick picks */}
          {!searched && (
            <div>
              <div style={lbl}>Sürətli seçim</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {QUICK.map(qt => (
                  <button key={qt.label} onClick={() => { setTopic(qt.label); setSubject(qt.subject); }} className={`chip${topic === qt.label && subject === qt.subject ? ' active' : ''}`}>
                    {qt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Mövzu</label>
              <div style={{ position: 'relative' }}>
                <BookOpen style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--txt3)' }} />
                <input style={{ ...inp, paddingLeft: 30 }} placeholder="məs: Fotosintez..." value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} />
              </div>
            </div>
            <div>
              <label style={lbl}>Fənn</label>
              <div style={{ position: 'relative' }}>
                <Tag style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--txt3)' }} />
                <input style={{ ...inp, paddingLeft: 30 }} placeholder="məs: Biologiya..." value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <label style={lbl}>Sinif</label>
              <select style={{ ...inp, appearance: 'none' }} value={grade} onChange={e => setGrade(e.target.value)}>
                <option value="">Seçin...</option>
                {['1','2','3','4','5','6','7','8','9','10','11'].map(g => <option key={g} value={g} style={{ background: 'var(--bg2)' }}>{g}-ci sinif</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Sual sayı</label>
              <div style={{ display: 'flex', gap: 5 }}>
                {['5','10','20','30'].map(n => <button key={n} onClick={() => setCount(n)} className={`chip${count === n ? ' active' : ''}`}>{n}</button>)}
              </div>
            </div>
            <Button variant="primary" onClick={doSearch} loading={loading}>
              <Search style={{ width: 14, height: 14 }} />Axtar
            </Button>
          </div>

          {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 11, fontSize: 12, color: 'var(--red)' }}>{error}</div>}

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader2 style={{ width: 36, height: 36, color: 'var(--acc)', margin: '0 auto 12px' }} className="animate-spin" />
              <p style={{ fontSize: 13, color: 'var(--txt2)', margin: 0 }}>Axtarılır...</p>
            </div>
          )}

          {!loading && searched && questions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt2)' }}>
              <Search style={{ width: 40, height: 40, margin: '0 auto 10px', opacity: 0.2 }} />
              <p style={{ fontSize: 13, margin: 0 }}>Sual tapılmadı.</p>
            </div>
          )}

          {!loading && !searched && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt2)' }}>
              <Globe style={{ width: 40, height: 40, margin: '0 auto 10px', opacity: 0.15 }} />
              <p style={{ fontSize: 13, margin: '0 0 5px' }}>Mövzu daxil edin və axtarın</p>
              <p style={{ fontSize: 11, margin: 0, opacity: 0.6 }}>AI Wikipedia-dan məlumat alıb suallar yaradacaq</p>
            </div>
          )}

          {!loading && questions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles style={{ width: 15, height: 15, color: 'var(--amber)' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{questions.length} sual</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => startQuiz(filtered)}>
                  ▶ Sınaq kimi başla
                </Button>
              </div>
              {allTopics.length > 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--bd)' }}>
                  <button onClick={() => setSelTopic('all')} className={`chip${selTopic === 'all' ? ' active' : ''}`}>Bütün mövzular</button>
                  {allTopics.map(tp => <button key={tp} onClick={() => setSelTopic(tp)} className={`chip${selTopic === tp ? ' active' : ''}`}><Tag style={{ width: 10, height: 10 }} />{tp}</button>)}
                </div>
              )}
              {filtered.map((q, i) => questionCard(q, i))}
            </div>
          )}
        </div>
      )}

      {/* Text to quiz */}
      {searchTab === 'text' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '10px 14px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--acc3)', margin: 0, lineHeight: 1.6 }}>
              📝 Mövzu mətni daxil edin — AI mətni oxuyub ona uyğun suallar yaradacaq
            </p>
          </div>

          <div>
            <label style={lbl}>Mövzu mətni</label>
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Burada mövzu mətni daxil edin... (dərslik paraqrafı, Wikipedia mətni, qeydlər və s.)"
              style={{ ...inp, padding: '12px 14px', minHeight: 160, resize: 'vertical', lineHeight: 1.6 }}
            />
            <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 5, textAlign: 'right' }}>{textInput.length} simvol</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div>
              <label style={lbl}>Sual sayı</label>
              <div style={{ display: 'flex', gap: 5 }}>
                {['5','10','15','20'].map(n => <button key={n} onClick={() => setTextCount(n)} className={`chip${textCount === n ? ' active' : ''}`}>{n}</button>)}
              </div>
            </div>
            <Button variant="primary" onClick={doTextQuiz} loading={textLoading}>
              <Sparkles style={{ width: 14, height: 14 }} />Suallar yarat
            </Button>
          </div>

          {textError && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 11, fontSize: 12, color: 'var(--red)' }}>{textError}</div>}

          {textLoading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader2 style={{ width: 36, height: 36, color: 'var(--acc)', margin: '0 auto 12px' }} className="animate-spin" />
              <p style={{ fontSize: 13, color: 'var(--txt2)', margin: 0 }}>Mətn analiz edilir...</p>
            </div>
          )}

          {!textLoading && textQuestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{textQuestions.length} sual yaradıldı</span>
                <Button variant="primary" size="sm" onClick={() => startQuiz(textQuestions)}>
                  ▶ Sınaq kimi başla
                </Button>
              </div>
              {textQuestions.map((q, i) => questionCard(q, i))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (inline) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 400 }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--bd2)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px var(--shadow)' }} className="animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--acc-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe style={{ width: 15, height: 15, color: 'var(--acc)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', margin: 0 }}>Sual yarat</h3>
              <p style={{ fontSize: 11, color: 'var(--txt2)', margin: 0, marginTop: 2 }}>İnternet axtarışı · Mətn → Sual</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}
