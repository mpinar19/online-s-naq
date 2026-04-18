'use client';
import { useState, useRef } from 'react';
import { useQuizStore, useAppStore } from '@/lib/store';
import { GeneratedQuestion } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Upload, FileText, Loader2, Play, RefreshCw, BookOpen, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const LTR = ['A', 'B', 'C', 'D'];

export default function PDFUploadPanel() {
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
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadedRef = useRef<{ text: string; isBase64: boolean }>({ text: '', isBase64: false });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('Fayl 10MB-dan böyükdür.'); return; }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (file.name.endsWith('.pdf')) {
        uploadedRef.current = { text: result, isBase64: true };
        setUploadedText(result, file.name, true);
      } else {
        const text = result.slice(0, 15000);
        uploadedRef.current = { text, isBase64: false };
        setUploadedText(text, file.name, false);
      }
      setStep(2);
    };
    if (file.name.endsWith('.pdf')) reader.readAsDataURL(file);
    else reader.readAsText(file, 'UTF-8');
  };

  const handleGenerate = async () => {
    if (!uploadedRef.current.text) { setError('Fayl yüklənməyib'); return; }
    setLoading(true);
    setStep(3);
    setError('');

    const texts = ['Mətn analiz edilir...', 'Mövzular müəyyənləşdirilir...', 'Suallar yaradılır...', 'Cavablar formalaşdırılır...', 'Yekun yoxlama...'];
    let li = 0;
    const interval = setInterval(() => setLoadingText(texts[li++ % texts.length]), 2000);

    try {
      const res = await fetch('/api/generate-from-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: uploadedRef.current.text,
          isBase64: uploadedRef.current.isBase64,
          fileName,
          count: parseInt(count),
          difficulty,
          lang,
        }),
      });
      clearInterval(interval);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setGenQuestions(data.questions || []);
      setTopics(data.topics || []);
      setStep(4);
    } catch (e) {
      clearInterval(interval);
      setError('Xəta: ' + (e instanceof Error ? e.message : 'Bilinməyən xəta'));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = selectedTopic === 'all'
    ? genQuestions
    : genQuestions.filter((q: GeneratedQuestion) => q.topic === selectedTopic);

  const handleStartQuiz = () => {
    const qs = filteredQuestions.map((q: GeneratedQuestion) => ({
      q: q.q,
      opts: q.opts,
      ans: q.ans,
      exp: q.exp,
      bal: 10,
      _subject: 'PDF',
      _topic: q.topic || 'Ümumi',
    }));
    launchQuiz(qs);
    setScreen('quiz');
  };

  return (
    <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[rgba(99,120,255,0.1)]">
        <div className="w-10 h-10 rounded-xl bg-[rgba(6,182,212,0.1)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#06B6D4]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#E8EEFF]">PDF-dən sual yarat</h3>
          <p className="text-xs text-[#7B8DB0]">PDF faylı yüklə — AI sualları oxuyub yeni suallar yaradacaq</p>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[rgba(99,120,255,0.2)] rounded-xl p-8 text-center cursor-pointer hover:border-[rgba(99,120,255,0.4)] hover:bg-[rgba(99,120,255,0.03)] transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[rgba(99,120,255,0.1)] flex items-center justify-center mx-auto mb-3 group-hover:bg-[rgba(99,120,255,0.15)] transition-all">
              <Upload className="w-7 h-7 text-[#6378FF]" />
            </div>
            <p className="text-sm font-semibold text-[#E8EEFF] mb-1">PDF faylı seçmək üçün klikləyin</p>
            <p className="text-xs text-[#7B8DB0]">PDF, TXT · Maks. 10MB</p>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={handleFile} />
          {error && <p className="text-xs text-[#EF4444] mt-2">{error}</p>}
        </div>
      )}

      {/* Step 2: Parameters */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-xl">
            <FileText className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span className="text-xs font-semibold text-[#6EE7B7]">✓ {fileName} — hazır</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider block mb-2">Sual sayı</label>
            <div className="flex gap-2">
              {['5', '10', '20', '30', '50'].map((n) => (
                <button key={n} onClick={() => setCount(n)} className={cn('chip', count === n && 'active')}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider block mb-2">Çətinlik</label>
            <div className="flex gap-2 flex-wrap">
              {['qarışıq', 'asan', 'orta', 'çətin'].map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={cn('chip', difficulty === d && 'active')}>{d}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider block mb-2">Dil</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { val: 'Azərbaycan dilində', label: 'Azərbaycan' },
                { val: 'rus dilində', label: 'Rus' },
                { val: 'ingilis dilində', label: 'İngilis' },
              ].map((l) => (
                <button key={l.val} onClick={() => setLang(l.val)} className={cn('chip', lang === l.val && 'active')}>{l.label}</button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-[#EF4444]">{error}</p>}

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => { setStep(1); setFileName(''); }}>
              <RefreshCw className="w-3.5 h-3.5" />
              Yenidən
            </Button>
            <Button variant="primary" onClick={handleGenerate}>
              Suallar yarat
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Loading */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(99,120,255,0.1)] flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[#6378FF] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#E8EEFF] mb-1">{loadingText || 'Suallar yaradılır...'}</p>
          <p className="text-xs text-[#7B8DB0]">Bu bir neçə saniyə çəkə bilər</p>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-bold text-[#E8EEFF]">{genQuestions.length} sual yaradıldı</span>
              {topics.length > 0 && (
                <span className="text-xs text-[#7B8DB0] ml-2">· {topics.length} mövzu</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setStep(1); setFileName(''); setGenQuestions([]); }}>
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button variant="primary" size="sm" onClick={handleStartQuiz}>
                <Play className="w-3.5 h-3.5" />
                Sınaq kimi başla
              </Button>
            </div>
          </div>

          {/* Topic filter */}
          {topics.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setSelectedTopic('all')} className={cn('chip', selectedTopic === 'all' && 'active')}>
                Bütün mövzular
              </button>
              {topics.map((t) => (
                <button key={t} onClick={() => setSelectedTopic(t)} className={cn('chip', selectedTopic === t && 'active')}>
                  <Tag className="w-3 h-3" />
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredQuestions.map((q: GeneratedQuestion, i: number) => (
              <div key={i} className="bg-[#0D1120] border border-[rgba(99,120,255,0.1)] rounded-xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xs font-mono text-[#3D4F70] flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-sm font-semibold text-[#E8EEFF]">{q.q}</p>
                </div>
                <div className="space-y-1.5">
                  {q.opts.map((opt: string, j: number) => (
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
    </div>
  );
}
