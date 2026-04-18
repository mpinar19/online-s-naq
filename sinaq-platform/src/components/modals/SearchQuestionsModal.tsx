'use client';
import { useState } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { GeneratedQuestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X, Search, Loader2, Play, Globe, BookOpen, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const LTR = ['A', 'B', 'C', 'D'];

interface Props {
  inline?: boolean;
  onClose: () => void;
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
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = [...new Set(questions.map((q) => q.topic).filter(Boolean))] as string[];

  const handleSearch = async () => {
    if (!topic && !subject) { setError('Mövzu və ya fənn daxil edin'); return; }
    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const res = await fetch('/api/search-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, count: parseInt(count) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setQuestions(data.questions || []);
      setSearched(true);
    } catch (e) {
      setError('Xəta: ' + (e instanceof Error ? e.message : 'Bilinməyən xəta'));
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = selectedTopic === 'all'
    ? questions
    : questions.filter((q) => q.topic === selectedTopic);

  const handleStartQuiz = () => {
    const qs = filteredQuestions.map((q) => ({
      q: q.q,
      opts: q.opts,
      ans: q.ans,
      exp: q.exp,
      bal: 10,
      _subject: subject || 'Axtarış',
      _topic: q.topic || topic || 'Ümumi',
    }));
    launchQuiz(qs);
    onClose();
    setScreen('quiz');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(99,120,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(99,120,255,0.1)] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#6378FF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8EEFF]">İnternet axtarışı</h3>
              <p className="text-xs text-[#7B8DB0]">Mövzu üzrə suallar tap və sınaq başlat</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search form */}
        <div className="p-5 border-b border-[rgba(99,120,255,0.1)]">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              label="Mövzu"
              placeholder="məs: Fotosintez, Kvadrat tənlik"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              icon={<BookOpen className="w-4 h-4" />}
            />
            <Input
              label="Fənn (istəyə bağlı)"
              placeholder="məs: Biologiya, Riyaziyyat"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              icon={<Tag className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider block mb-2">Sinif (istəyə bağlı)</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0D1120] border border-[rgba(99,120,255,0.2)] rounded-xl text-sm text-[#E8EEFF] outline-none focus:border-[#6378FF] transition-all appearance-none"
              >
                <option value="">Sinif seçin...</option>
                {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                  <option key={g} value={g} className="bg-[#0D1120]">{g}-ci sinif</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider block mb-2">Sual sayı</label>
              <div className="flex gap-1.5">
                {['5', '10', '20'].map((n) => (
                  <button key={n} onClick={() => setCount(n)} className={cn('chip text-xs px-3 py-2', count === n && 'active')}>{n}</button>
                ))}
              </div>
            </div>
            <Button variant="primary" onClick={handleSearch} loading={loading} className="flex-shrink-0">
              <Search className="w-4 h-4" />
              Axtar
            </Button>
          </div>
          {error && <p className="text-xs text-[#EF4444] mt-2">{error}</p>}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 text-[#6378FF] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#7B8DB0]">İnternetdən axtarılır və suallar yaradılır...</p>
            </div>
          )}

          {!loading && searched && questions.length === 0 && (
            <div className="text-center py-12 text-[#7B8DB0]">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sual tapılmadı. Başqa mövzu cəhd edin.</p>
            </div>
          )}

          {!loading && questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#E8EEFF]">{questions.length} sual tapıldı</span>
                <Button variant="primary" size="sm" onClick={handleStartQuiz}>
                  <Play className="w-3.5 h-3.5" />
                  Sınaq kimi başla
                </Button>
              </div>

              {/* Topic filter */}
              {topics.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button onClick={() => setSelectedTopic('all')} className={cn('chip', selectedTopic === 'all' && 'active')}>
                    Bütün mövzular
                  </button>
                  {topics.map((t) => (
                    <button key={t} onClick={() => setSelectedTopic(t)} className={cn('chip', selectedTopic === t && 'active')}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {filteredQuestions.map((q, i) => (
                  <div key={i} className="bg-[#0D1120] border border-[rgba(99,120,255,0.1)] rounded-xl p-4">
                    <p className="text-sm font-semibold text-[#E8EEFF] mb-3">{i + 1}. {q.q}</p>
                    <div className="space-y-1.5">
                      {q.opts.map((opt, j) => (
                        <div
                          key={j}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                            j === q.ans
                              ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#6EE7B7]'
                              : 'text-[#7B8DB0]'
                          )}
                        >
                          <span className="font-bold font-mono">{LTR[j]})</span>
                          {opt}
                          {j === q.ans && <span className="ml-auto">✓</span>}
                        </div>
                      ))}
                    </div>
                    {q.topic && (
                      <div className="mt-2 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#3D4F70]" />
                        <span className="text-[10px] text-[#3D4F70]">{q.topic}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !searched && (
            <div className="text-center py-12 text-[#7B8DB0]">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Mövzu daxil edin və axtarın</p>
              <p className="text-xs mt-1 opacity-60">AI internet məlumatlarına əsasən suallar yaradacaq</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
