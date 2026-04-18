'use client';
import { useState } from 'react';
import { getCurUser, getUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Cpu, LogOut, Users, BarChart2, AlertTriangle,
  BookOpen, TrendingUp, Award, ChevronDown, ChevronUp, Search, FileText
} from 'lucide-react';
import PDFUploadPanel from '@/components/pdf/PDFUploadPanel';

type Tab = 'overview' | 'students' | 'weak' | 'pdf';

export default function TeacherScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const cu = getCurUser();
  const users = getUsers();

  const students = Object.entries(users).filter(([, u]) => u.role !== 'teacher' && u.role !== 'admin');
  const allHist = students.flatMap(([, u]) => u.history || []);
  const totalExams = allHist.length;
  const avgBal = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.bal700 || 0), 0) / totalExams) : 0;
  const avgPct = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.pct || 0), 0) / totalExams) : 0;

  const topicMap: Record<string, { correct: number; total: number }> = {};
  students.forEach(([, u]) => {
    (u.history || []).forEach(h => {
      if (!h.topicBreakdown) return;
      Object.entries(h.topicBreakdown).forEach(([topic, stat]) => {
        if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
        topicMap[topic].correct += stat.correct;
        topicMap[topic].total += stat.total;
      });
    });
  });
  const weakTopics = Object.entries(topicMap)
    .filter(([, s]) => s.total >= 3)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct / s.total * 100), total: s.total }))
    .sort((a, b) => a.pct - b.pct).slice(0, 15);

  const filtered = search
    ? students.filter(([, u]) => u.name.toLowerCase().includes(search.toLowerCase()) || String(u.grade).includes(search))
    : students;

  const byGrade: Record<string, typeof students> = {};
  filtered.forEach(e => {
    const g = e[1].grade || '?';
    if (!byGrade[g]) byGrade[g] = [];
    byGrade[g].push(e);
  });

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 className="w-4 h-4" />, label: 'İcmal' },
    { id: 'students' as Tab, icon: <Users className="w-4 h-4" />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle className="w-4 h-4" />, label: 'Analiz' },
    { id: 'pdf' as Tab, icon: <FileText className="w-4 h-4" />, label: 'PDF Sual' },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-[rgba(99,120,255,0.1)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-[#E8EEFF] leading-tight">SinaqAZ</div>
              <div className="text-[10px] text-[#3D4F70] font-mono">Müəllim Paneli</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cu && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#141B2D] border border-[rgba(99,120,255,0.12)] rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-[10px] font-black text-white">
                  {cu.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-[#E8EEFF]">{cu.name}</span>
              </div>
            )}
            <button onClick={() => { logout(); setScreen('auth'); }}
              className="w-9 h-9 rounded-xl bg-[#141B2D] border border-[rgba(99,120,255,0.12)] flex items-center justify-center text-[#7B8DB0] hover:text-[#EF4444] transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
        <div className="tab-bar mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn('tab-item', tab === t.id && 'active')}>
              {t.icon}<span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { n: students.length, l: 'Şagird', c: '#6378FF', icon: <Users className="w-5 h-5" /> },
                { n: totalExams, l: 'Sınaq', c: '#10B981', icon: <BookOpen className="w-5 h-5" /> },
                { n: avgBal, l: 'Orta bal', c: '#F59E0B', icon: <Award className="w-5 h-5" /> },
                { n: avgPct + '%', l: 'Orta faiz', c: '#A855F7', icon: <TrendingUp className="w-5 h-5" /> },
              ].map((s, i) => (
                <div key={i} className="section-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: s.c + '18', color: s.c }}>{s.icon}</div>
                  <div>
                    <div className="text-xl font-black" style={{ color: s.c }}>{s.n}</div>
                    <div className="text-[10px] text-[#3D4F70] font-semibold uppercase tracking-wider">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-card p-5">
              <div className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider mb-4">Son sınaqlar</div>
              <div className="space-y-2">
                {students
                  .flatMap(([, u]) => (u.history || []).slice(0, 2).map(h => ({ ...h, sname: u.name, sgrade: u.grade })))
                  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                  .slice(0, 8)
                  .map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#0D1120] rounded-xl border border-[rgba(99,120,255,0.07)]">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                        {h.sname.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#E8EEFF] truncate">{h.sname}</div>
                        <div className="text-xs text-[#3D4F70] truncate">{h.label} · {h.date}</div>
                      </div>
                      <div className="text-sm font-bold flex-shrink-0"
                        style={{ color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>
                        {h.bal700}/700
                      </div>
                    </div>
                  ))}
                {totalExams === 0 && <p className="text-sm text-[#7B8DB0] text-center py-6">Hələ sınaq yoxdur.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D4F70]" />
              <input type="text" placeholder="Şagird adı və ya sinif axtar..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-xl text-sm text-[#E8EEFF] placeholder:text-[#3D4F70] outline-none focus:border-[#6378FF] transition-all" />
            </div>
            {Object.entries(byGrade).sort((a, b) => +a[0] - +b[0]).map(([grade, list]) => (
              <div key={grade} className="section-card overflow-hidden">
                <div className="px-5 py-3 bg-[rgba(99,120,255,0.05)] border-b border-[rgba(99,120,255,0.1)] flex items-center gap-2">
                  <span className="text-sm font-bold text-[#E8EEFF]">{grade}-ci sinif</span>
                  <span className="text-xs text-[#3D4F70] font-mono">{list.length} şagird</span>
                </div>
                <div className="divide-y divide-[rgba(99,120,255,0.06)]">
                  {list.map(([uname, u]) => {
                    const hist = u.history || [];
                    const best = hist.length ? Math.max(...hist.map(h => h.bal700 || 0)) : null;
                    const avg = hist.length ? Math.round(hist.reduce((s, h) => s + (h.pct || 0), 0) / hist.length) : null;
                    let lc = '#3D4F70';
                    if (avg !== null) lc = avg >= 85 ? '#10B981' : avg >= 70 ? '#6378FF' : avg >= 50 ? '#F59E0B' : '#EF4444';
                    return (
                      <div key={uname}>
                        <button className="w-full flex items-center gap-3 p-4 hover:bg-[rgba(99,120,255,0.03)] transition-all text-left"
                          onClick={() => setExpanded(expanded === uname ? null : uname)}>
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[#E8EEFF]">{u.name}</div>
                            <div className="text-xs text-[#3D4F70] font-mono">{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {avg !== null && <span className="text-sm font-bold" style={{ color: lc }}>{avg}%</span>}
                            {expanded === uname ? <ChevronUp className="w-4 h-4 text-[#3D4F70]" /> : <ChevronDown className="w-4 h-4 text-[#3D4F70]" />}
                          </div>
                        </button>
                        {expanded === uname && (
                          <div className="px-4 pb-4 animate-fade-in space-y-2">
                            {hist.length === 0
                              ? <p className="text-xs text-[#3D4F70] py-2">Hələ sınaq yoxdur.</p>
                              : hist.slice(0, 5).map((h, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-[#0D1120] rounded-xl">
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-[#E8EEFF] truncate">{h.label}</div>
                                    <div className="text-[10px] text-[#3D4F70]">{h.date}</div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-bold" style={{ color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>
                                      {h.bal700}/700
                                    </div>
                                    <div className="text-[10px] text-[#3D4F70]">{h.pct}%</div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#7B8DB0]">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Şagird tapılmadı.</p>
              </div>
            )}
          </div>
        )}

        {/* Weak topics */}
        {tab === 'weak' && (
          <div className="section-card p-5 animate-fade-in">
            <div className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider mb-4">Ən çox çətinlik çəkilən mövzular</div>
            {weakTopics.length === 0
              ? <p className="text-sm text-[#7B8DB0] py-4">Hələ kifayət qədər məlumat yoxdur.</p>
              : (
                <div className="space-y-2">
                  {weakTopics.map((r, i) => {
                    const fc = r.pct < 40 ? '#EF4444' : r.pct < 70 ? '#F59E0B' : '#10B981';
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#0D1120] rounded-xl">
                        <span className="text-base flex-shrink-0">{r.pct < 40 ? '🔴' : r.pct < 70 ? '🟡' : '🟢'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#E8EEFF] truncate">{r.topic}</div>
                          <div className="text-[10px] text-[#3D4F70] font-mono">{r.total} sual</div>
                        </div>
                        <div className="w-24 flex-shrink-0">
                          <div className="text-xs font-bold mb-1" style={{ color: fc }}>{r.pct}%</div>
                          <div className="h-1.5 bg-[#141B2D] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: fc }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* PDF tab */}
        {tab === 'pdf' && (
          <div className="animate-fade-in">
            <div className="mb-4 p-4 bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.2)] rounded-xl">
              <p className="text-sm text-[#C084FC]">
                📄 PDF faylı yükləyin — AI oxuyub mövzulara görə suallar yaradacaq. Sualları sınaq kimi başlada bilərsiniz.
              </p>
            </div>
            <PDFUploadPanel teacherMode />
          </div>
        )}
      </div>
    </div>
  );
}
