'use client';
import { useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { GeneratedQuestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import { X, Search, Loader2, Globe, BookOpen, Tag, Sparkles } from 'lucide-react';

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

export default function SearchQuestionsModal({ onClose, inline = false }: Props) {
  const { launchQuiz } = useQuizStore();
  const setScreen = useAppStore((s) => s.setScreen);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [count, setCount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selTopic, setSelTopic] = useState('all');

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
      setError((e instanceof Error ? e.message : 'Xəta baş verdi'));
    } finally { setLoading(false); }
  };

  const filtered = selTopic === 'all' ? questions : questions.filter(q => q.topic === selTopic);

  const startQuiz = () => {
    launchQuiz(filtered.map(q => ({ q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, bal: 10, _subject: subject || 'Axtarış', _topic: q.topic || topic || 'Ümumi' })));
    onClose(); setScreen('quiz');
  };

  // ── Styles ──
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: '#0D1120',
    border: '1px solid rgba(99,120,255,0.2)', borderRadius: 12,
    color: '#E8EEFF', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, color: '#3D4F70',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
  };

  const formSection = (
    <div style={{ padding: 20, borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
      {/* Quick picks */}
      {!searched && (
        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>Sürətli seçim</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK.map(qt => (
              <button key={qt.label} onClick={() => { setTopic(qt.label); setSubject(qt.subject); }}
                className={`chip${topic === qt.label && subject === qt.subject ? ' active' : ''}`}>
                {qt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Mövzu</label>
          <div style={{ position: 'relative' }}>
            <BookOpen style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#3D4F70' }} />
            <input style={{ ...inputStyle, paddingLeft: 32 }} placeholder="məs: Fotosintez..."
              value={topic} onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Fənn</label>
          <div style={{ position: 'relative' }}>
            <Tag style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#3D4F70' }} />
            <input style={{ ...inputStyle, paddingLeft: 32 }} placeholder="məs: Biologiya..."
              value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={labelStyle}>Sinif</label>
          <select style={{ ...inputStyle, appearance: 'none' }} value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="">Seçin...</option>
            {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
              <option key={g} value={g} style={{ background: '#0D1120' }}>{g}-ci sinif</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Sual sayı</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {['5','10','20','30'].map(n => (
              <button key={n} onClick={() => setCount(n)} className={`chip${count === n ? ' active' : ''}`}>{n}</button>
            ))}
          </div>
        </div>
        <Button variant="primary" onClick={doSearch} loading={loading}>
          <Search style={{ width: 15, height: 15 }} />Axtar
        </Button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  );

  const resultsSection = (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 style={{ width: 40, height: 40, color: '#6378FF', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#E8EEFF', margin: '0 0 6px' }}>Axtarılır...</p>
          <p style={{ fontSize: 12, color: '#7B8DB0', margin: 0 }}>AI suallar yaradır</p>
        </div>
      )}

      {!loading && searched && questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7B8DB0' }}>
          <Search style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
          <p style={{ fontSize: 14, margin: 0 }}>Sual tapılmadı. Başqa mövzu cəhd edin.</p>
        </div>
      )}

      {!loading && !searched && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7B8DB0' }}>
          <Globe style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.15 }} />
          <p style={{ fontSize: 14, margin: '0 0 6px' }}>Mövzu daxil edin və axtarın</p>
          <p style={{ fontSize: 12, margin: 0, opacity: 0.6 }}>AI Wikipedia-dan məlumat alıb suallar yaradacaq</p>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 16, height: 16, color: '#F59E0B' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{questions.length} sual yaradıldı</span>
              {allTopics.length > 0 && <span style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace' }}>· {allTopics.length} mövzu</span>}
            </div>
            <Button variant="primary" size="sm" onClick={startQuiz}>
              <Play style={{ width: 13, height: 13 }} />Sınaq kimi başla
            </Button>
          </div>

          {/* Topic filter */}
          {allTopics.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, padding: '12px 14px', background: '#0D1120', borderRadius: 14, border: '1px solid rgba(99,120,255,0.08)' }}>
              <button onClick={() => setSelTopic('all')} className={`chip${selTopic === 'all' ? ' active' : ''}`}>Bütün mövzular</button>
              {allTopics.map(t => (
                <button key={t} onClick={() => setSelTopic(t)} className={`chip${selTopic === t ? ' active' : ''}`}>
                  <Tag style={{ width: 11, height: 11 }} />{t}
                </button>
              ))}
            </div>
          )}

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((q, i) => (
              <div key={i} style={{ background: '#0D1120', border: '1px solid rgba(99,120,255,0.08)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#3D4F70', flexShrink: 0, marginTop: 2, background: '#141B2D', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(99,120,255,0.1)' }}>{i + 1}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', margin: 0, flex: 1, lineHeight: 1.6 }}>{q.q}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                  {q.opts.map((opt, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, fontSize: 12,
                      background: j === q.ans ? 'rgba(16,185,129,0.1)' : '#141B2D',
                      border: j === q.ans ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,120,255,0.06)',
                      color: j === q.ans ? '#6EE7B7' : '#7B8DB0',
                    }}>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', width: 16, flexShrink: 0 }}>{LTR[j]})</span>
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                      {j === q.ans && <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>}
                    </div>
                  ))}
                </div>
                {q.topic && (
                  <span className="topic-tag"><Tag style={{ width: 10, height: 10 }} />{q.topic}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Inline mode
  if (inline) {
    return (
      <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 18, overflow: 'hidden' }}>
        {formSection}
        {resultsSection}
      </div>
    );
  }

  // Modal mode
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }} className="animate-fade-up">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,120,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe style={{ width: 16, height: 16, color: '#6378FF' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF', margin: 0 }}>İnternet axtarışı</h3>
              <p style={{ fontSize: 11, color: '#7B8DB0', margin: 0, marginTop: 2 }}>Mövzu üzrə AI suallar yarat</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
        {formSection}
        {resultsSection}
      </div>
    </div>
  );
}

function Play({ style }: { style?: React.CSSProperties }) {
  return <svg style={style} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
