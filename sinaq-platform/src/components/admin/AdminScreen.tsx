'use client';
import { useState } from 'react';
import { getUsers, saveUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Cpu, LogOut, Users, BarChart2, AlertTriangle,
  BookOpen, Plus, Trash2, Shield, TrendingUp, Award
} from 'lucide-react';

type Tab = 'overview' | 'teachers' | 'students' | 'weak';

export default function AdminScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const [tab, setTab] = useState<Tab>('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [tName, setTName] = useState('');
  const [tUser, setTUser] = useState('');
  const [tPass, setTPass] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const users = getUsers();
  const teachers = Object.entries(users).filter(([, u]) => u.role === 'teacher');
  const students = Object.entries(users).filter(([, u]) => u.role !== 'teacher' && u.role !== 'admin');
  const allHist = students.flatMap(([, u]) => u.history || []);
  const totalExams = allHist.length;
  const avgBal = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.bal700 || 0), 0) / totalExams) : 0;
  const avgPct = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.pct || 0), 0) / totalExams) : 0;

  const topicMap: Record<string, { correct: number; total: number }> = {};
  students.forEach(([, u]) => {
    (u.history || []).forEach(h => {
      if (!h.topicBreakdown) return;
      Object.entries(h.topicBreakdown).forEach(([t, s]) => {
        if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 };
        topicMap[t].correct += s.correct;
        topicMap[t].total += s.total;
      });
    });
  });
  const weakTopics = Object.entries(topicMap)
    .filter(([, s]) => s.total >= 3)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct / s.total * 100), total: s.total }))
    .sort((a, b) => a.pct - b.pct);

  const addTeacher = () => {
    if (!tName || !tUser || !tPass) { setMsg({ text: 'Bütün xanaları doldurun.', ok: false }); return; }
    if (tPass.length < 4) { setMsg({ text: 'Şifrə ən az 4 simvol.', ok: false }); return; }
    const u = getUsers();
    if (u[tUser]) { setMsg({ text: 'Bu istifadəçi adı mövcuddur.', ok: false }); return; }
    u[tUser] = { name: tName, grade: 'Müəllim', role: 'teacher', pass: tPass, history: [] };
    saveUsers(u);
    setMsg({ text: '✓ Müəllim əlavə edildi!', ok: true });
    setTName(''); setTUser(''); setTPass('');
    refresh();
    setTimeout(() => { setShowAdd(false); setMsg(null); }, 1500);
  };

  const del = (uname: string) => {
    if (!confirm(`"${uname}" silinsin?`)) return;
    const u = getUsers(); delete u[uname]; saveUsers(u); refresh();
  };

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 className="w-4 h-4" />, label: 'İcmal' },
    { id: 'teachers' as Tab, icon: <Shield className="w-4 h-4" />, label: 'Müəllimlər' },
    { id: 'students' as Tab, icon: <Users className="w-4 h-4" />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle className="w-4 h-4" />, label: 'Analiz' },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-[rgba(99,120,255,0.1)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF3340] to-[#A855F7] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-[#E8EEFF]">SinaqAZ</div>
              <div className="text-[10px] text-[#3D4F70] font-mono">Admin Paneli</div>
            </div>
          </div>
          <button onClick={() => { logout(); setScreen('auth'); }}
            className="w-9 h-9 rounded-xl bg-[#141B2D] border border-[rgba(99,120,255,0.12)] flex items-center justify-center text-[#7B8DB0] hover:text-[#EF4444] transition-all">
            <LogOut className="w-4 h-4" />
          </button>
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
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { n: teachers.length, l: 'Müəllim', c: '#A855F7', icon: <Shield className="w-5 h-5" /> },
                { n: students.length, l: 'Şagird', c: '#6378FF', icon: <Users className="w-5 h-5" /> },
                { n: totalExams, l: 'Sınaq', c: '#10B981', icon: <BookOpen className="w-5 h-5" /> },
                { n: avgBal, l: 'Orta bal', c: '#F59E0B', icon: <Award className="w-5 h-5" /> },
                { n: avgPct + '%', l: 'Orta faiz', c: '#06B6D4', icon: <TrendingUp className="w-5 h-5" /> },
              ].map((s, i) => (
                <div key={i} className="section-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: s.c + '18', color: s.c }}>{s.icon}</div>
                  <div>
                    <div className="text-lg font-black" style={{ color: s.c }}>{s.n}</div>
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
                  .slice(0, 6)
                  .map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#0D1120] rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                        {h.sname.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#E8EEFF] truncate">{h.sname} <span className="text-[#3D4F70]">({h.sgrade}-ci sinif)</span></div>
                        <div className="text-xs text-[#3D4F70] truncate">{h.label} · {h.date}</div>
                      </div>
                      <div className="text-sm font-bold flex-shrink-0"
                        style={{ color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>
                        {h.bal700}/700
                      </div>
                    </div>
                  ))}
                {totalExams === 0 && <p className="text-sm text-[#7B8DB0] py-4 text-center">Hələ sınaq yoxdur.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Teachers */}
        {tab === 'teachers' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setShowAdd(!showAdd)}>
                <Plus className="w-4 h-4" />Müəllim əlavə et
              </Button>
            </div>
            {showAdd && (
              <div className="section-card p-5 space-y-4 animate-fade-up">
                <div className="text-sm font-bold text-[#E8EEFF]">Yeni Müəllim</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="Ad Soyad" placeholder="Müəllimin adı" value={tName} onChange={e => setTName(e.target.value)} />
                  <Input label="İstifadəçi adı" placeholder="login" value={tUser} onChange={e => setTUser(e.target.value)} />
                  <Input label="Şifrə" type="password" placeholder="min. 4 simvol" value={tPass} onChange={e => setTPass(e.target.value)} />
                </div>
                {msg && <p className={`text-xs ${msg.ok ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{msg.text}</p>}
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={addTeacher}>Yadda saxla</Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Ləğv et</Button>
                </div>
              </div>
            )}
            <div className="section-card overflow-hidden">
              {teachers.length === 0
                ? <p className="text-sm text-[#7B8DB0] p-5 text-center">Hələ müəllim yoxdur.</p>
                : (
                  <div className="divide-y divide-[rgba(99,120,255,0.06)]">
                    {teachers.map(([uname, u]) => (
                      <div key={uname} className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6378FF] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-[#E8EEFF]">{u.name}</div>
                          <div className="text-xs text-[#3D4F70] font-mono">@{uname}</div>
                        </div>
                        <button onClick={() => del(uname)}
                          className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div className="space-y-4 animate-fade-in">
            <div className="section-card p-4 flex items-center gap-3">
              <Users className="w-4 h-4 text-[#6378FF]" />
              <span className="text-sm text-[#7B8DB0]">Cəmi <span className="text-[#E8EEFF] font-bold">{students.length}</span> şagird</span>
            </div>
            {(() => {
              const byGrade: Record<string, [string, User][]> = {};
              students.forEach(([uname, u]) => {
                const g = u.grade || '?';
                if (!byGrade[g]) byGrade[g] = [];
                byGrade[g].push([uname, u]);
              });
              return Object.entries(byGrade).sort((a, b) => +a[0] - +b[0]).map(([grade, list]) => (
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
                        <div key={uname} className="flex items-center gap-3 p-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#E8EEFF]">{u.name}</div>
                            <div className="text-xs text-[#3D4F70] font-mono">{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {avg !== null && <span className="text-xs font-bold" style={{ color: lc }}>{avg}%</span>}
                            <button onClick={() => del(uname)}
                              className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.08)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* Weak topics */}
        {tab === 'weak' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="section-card p-4 text-center">
                <div className="text-2xl font-black text-[#EF4444]">{weakTopics.filter(r => r.pct < 40).length}</div>
                <div className="text-xs text-[#3D4F70] mt-1">Kritik mövzu (&lt;40%)</div>
              </div>
              <div className="section-card p-4 text-center">
                <div className="text-2xl font-black text-[#F59E0B]">{weakTopics.filter(r => r.pct >= 40 && r.pct < 70).length}</div>
                <div className="text-xs text-[#3D4F70] mt-1">Orta mövzu (40-70%)</div>
              </div>
            </div>
            <div className="section-card p-5">
              <div className="text-xs font-bold text-[#3D4F70] uppercase tracking-wider mb-4">Bütün mövzular</div>
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
                          <div className="w-28 flex-shrink-0">
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
          </div>
        )}
      </div>
    </div>
  );
}
