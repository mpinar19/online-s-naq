'use client';
import { useState } from 'react';
import { getUsers, saveUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { User } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Cpu, LogOut, Users, BarChart2, AlertTriangle,
  BookOpen, Plus, Trash2, Shield, TrendingUp, Award,
  Sun, Moon, ChevronDown, ChevronUp, Search
} from 'lucide-react';

type Tab = 'overview' | 'teachers' | 'students' | 'weak';

export default function AdminScreen() {
  const { setScreen, theme, toggleTheme } = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [tName, setTName] = useState('');
  const [tUser, setTUser] = useState('');
  const [tPass, setTPass] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  // Fresh data on every render
  const users = getUsers();

  // Unikal şagirdlər
  const studentMap = new Map<string, User>();
  Object.entries(users).forEach(([uname, u]) => {
    if (u.role !== 'teacher' && u.role !== 'admin' && !studentMap.has(uname)) {
      studentMap.set(uname, u);
    }
  });
  const students = Array.from(studentMap.entries());
  const teachers = Object.entries(users).filter(([, u]) => u.role === 'teacher');

  const allHist = students.flatMap(([, u]) => u.history || []);
  const totalExams = allHist.length;
  const avgBal = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.bal700 || 0), 0) / totalExams) : 0;
  const avgPct = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.pct || 0), 0) / totalExams) : 0;

  // Zəif mövzular
  const topicMap: Record<string, { correct: number; total: number }> = {};
  students.forEach(([, u]) => {
    (u.history || []).forEach(h => {
      if (!h.topicBreakdown) return;
      Object.entries(h.topicBreakdown).forEach(([tp, s]) => {
        if (!topicMap[tp]) topicMap[tp] = { correct: 0, total: 0 };
        topicMap[tp].correct += s.correct;
        topicMap[tp].total += s.total;
      });
    });
  });
  const weakTopics = Object.entries(topicMap)
    .filter(([, s]) => s.total >= 3)
    .map(([topic, s]) => ({ topic, pct: Math.round(s.correct / s.total * 100), total: s.total }))
    .sort((a, b) => a.pct - b.pct);

  // Son sınaqlar — unikal
  const recentExams = (() => {
    const seen = new Set<string>();
    return students
      .flatMap(([, u]) => (u.history || []).slice(0, 1).map(h => ({ ...h, sname: u.name, sgrade: u.grade })))
      .filter(h => { const k = h.sname + h.label + h.date; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6);
  })();

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

  // Filtered students
  const filteredStudents = studentSearch
    ? students.filter(([, u]) => u.name.toLowerCase().includes(studentSearch.toLowerCase()) || String(u.grade).includes(studentSearch))
    : students;

  const byGrade = new Map<string, [string, User][]>();
  filteredStudents.forEach(([uname, u]) => {
    const g = u.grade || '?';
    if (!byGrade.has(g)) byGrade.set(g, []);
    byGrade.get(g)!.push([uname, u]);
  });

  // Styles
  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', position: 'relative' };
  const sc = (pct: number) => pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 style={{ width: 15, height: 15 }} />, label: 'İcmal' },
    { id: 'teachers' as Tab, icon: <Shield style={{ width: 15, height: 15 }} />, label: 'Müəllimlər' },
    { id: 'students' as Tab, icon: <Users style={{ width: 15, height: 15 }} />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle style={{ width: 15, height: 15 }} />, label: 'Analiz' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#EF3340,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--txt)', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace' }}>Admin Paneli</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
              {theme === 'dark' ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
            </button>
            <button onClick={() => { logout(); setScreen('auth'); }} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
              <LogOut style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px 80px' }}>
        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: 20 }}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`tab-item${tab === tb.id ? ' active' : ''}`}>
              {tb.icon}<span>{tb.label}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { n: teachers.length, l: 'Müəllim', c: '#A855F7', icon: <Shield style={{ width: 20, height: 20 }} /> },
                { n: students.length, l: 'Şagird', c: 'var(--acc)', icon: <Users style={{ width: 20, height: 20 }} /> },
                { n: totalExams, l: 'Sınaq', c: 'var(--green)', icon: <BookOpen style={{ width: 20, height: 20 }} /> },
                { n: avgBal, l: 'Orta bal', c: 'var(--amber)', icon: <Award style={{ width: 20, height: 20 }} /> },
              ].map((s, i) => (
                <div key={i} style={{ ...card, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.c + '18', color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Son sınaqlar */}
            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Son sınaqlar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentExams.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{h.sname.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.sname} <span style={{ color: 'var(--txt3)', fontSize: 11 }}>({h.sgrade}-ci sinif)</span></div>
                      <div style={{ fontSize: 11, color: 'var(--txt3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label} · {h.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: sc(h.pct || 0) }}>{h.bal700}/700</div>
                  </div>
                ))}
                {recentExams.length === 0 && <p style={{ fontSize: 13, color: 'var(--txt2)', textAlign: 'center', padding: '20px 0' }}>Hələ sınaq yoxdur.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── TEACHERS ── */}
        {tab === 'teachers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={() => setShowAdd(!showAdd)}>
                <Plus style={{ width: 14, height: 14 }} />Müəllim əlavə et
              </Button>
            </div>

            {showAdd && (
              <div style={{ ...card, padding: 18 }} className="animate-fade-up">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>Yeni Müəllim</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                  <Input label="Ad Soyad" placeholder="Müəllimin adı" value={tName} onChange={e => setTName(e.target.value)} />
                  <Input label="İstifadəçi adı" placeholder="login" value={tUser} onChange={e => setTUser(e.target.value)} />
                  <Input label="Şifrə" type="password" placeholder="min. 4 simvol" value={tPass} onChange={e => setTPass(e.target.value)} />
                </div>
                {msg && <p style={{ fontSize: 12, color: msg.ok ? 'var(--green)' : 'var(--red)', marginBottom: 10 }}>{msg.text}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="primary" size="sm" onClick={addTeacher}>Yadda saxla</Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Ləğv et</Button>
                </div>
              </div>
            )}

            <div style={card}>
              {teachers.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--txt2)', padding: 18, textAlign: 'center' }}>Hələ müəllim yoxdur.</p>
                : teachers.map(([uname, u]) => (
                  <div key={uname} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '1px solid var(--bd)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#A855F7,var(--acc))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>@{uname}</div>
                    </div>
                    <button onClick={() => del(uname)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── STUDENTS ── */}
        {tab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--txt3)' }} />
              <input type="text" placeholder="Şagird adı axtar..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                style={{ width: '100%', padding: '11px 14px 11px 38px', background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 13, fontSize: 13, color: 'var(--txt)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <div style={{ ...card, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users style={{ width: 15, height: 15, color: 'var(--acc)' }} />
              <span style={{ fontSize: 13, color: 'var(--txt2)' }}>Cəmi <strong style={{ color: 'var(--txt)' }}>{students.length}</strong> şagird</span>
            </div>

            {Array.from(byGrade.entries()).sort((a, b) => +a[0] - +b[0]).map(([grade, list]) => (
              <div key={grade} style={card}>
                <div style={{ padding: '11px 18px', background: 'var(--acc-bg)', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{grade}-ci sinif</span>
                  <span style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace' }}>{list.length} şagird</span>
                </div>
                {list.map(([uname, u]) => {
                  const hist = u.history || [];
                  const best = hist.length ? Math.max(...hist.map(h => h.bal700 || 0)) : null;
                  const avg = hist.length ? Math.round(hist.reduce((s, h) => s + (h.pct || 0), 0) / hist.length) : null;
                  const lc = avg === null ? 'var(--txt3)' : avg >= 85 ? 'var(--green)' : avg >= 70 ? 'var(--acc)' : avg >= 50 ? 'var(--amber)' : 'var(--red)';
                  const isOpen = expandedStudent === uname;
                  return (
                    <div key={uname} style={{ borderBottom: '1px solid var(--bd)' }}>
                      <button onClick={() => setExpandedStudent(isOpen ? null : uname)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {avg !== null && <span style={{ fontSize: 12, fontWeight: 700, color: lc }}>{avg}%</span>}
                          <button onClick={e => { e.stopPropagation(); del(uname); }} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer' }}>
                            <Trash2 style={{ width: 11, height: 11 }} />
                          </button>
                          {isOpen ? <ChevronUp style={{ width: 14, height: 14, color: 'var(--txt3)' }} /> : <ChevronDown style={{ width: 14, height: 14, color: 'var(--txt3)' }} />}
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 18px 14px' }} className="animate-fade-in">
                          {hist.length === 0
                            ? <p style={{ fontSize: 12, color: 'var(--txt3)', padding: '6px 0' }}>Hələ sınaq yoxdur.</p>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {hist.slice(0, 5).map((h, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--bg2)', borderRadius: 11 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</div>
                                    <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 2 }}>{h.date}</div>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: sc(h.pct || 0) }}>{h.bal700}/700</div>
                                    <div style={{ fontSize: 10, color: 'var(--txt3)' }}>{h.pct}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--txt2)' }}>
                <Users style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 14 }}>Şagird tapılmadı.</p>
              </div>
            )}
          </div>
        )}

        {/* ── WEAK TOPICS ── */}
        {tab === 'weak' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ ...card, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--red)' }}>{weakTopics.filter(r => r.pct < 40).length}</div>
                <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 6 }}>Kritik mövzu (&lt;40%)</div>
              </div>
              <div style={{ ...card, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--amber)' }}>{weakTopics.filter(r => r.pct >= 40 && r.pct < 70).length}</div>
                <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 6 }}>Orta mövzu (40-70%)</div>
              </div>
            </div>
            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Bütün mövzular</div>
              {weakTopics.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--txt2)', padding: '14px 0' }}>Hələ kifayət qədər məlumat yoxdur.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {weakTopics.map((r, i) => {
                    const fc = r.pct < 40 ? 'var(--red)' : r.pct < 70 ? 'var(--amber)' : 'var(--green)';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 12 }}>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{r.pct < 40 ? '🔴' : r.pct < 70 ? '🟡' : '🟢'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.topic}</div>
                          <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>{r.total} sual</div>
                        </div>
                        <div style={{ width: 90, flexShrink: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: fc, marginBottom: 4 }}>{r.pct}%</div>
                          <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: fc, width: `${r.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
