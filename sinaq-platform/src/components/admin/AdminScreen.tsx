'use client';
import { useState } from 'react';
import { getUsers, saveUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { User } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Cpu, LogOut, Users, BarChart2, AlertTriangle, BookOpen, Plus, Trash2, Shield, TrendingUp, Award } from 'lucide-react';

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

  const card: React.CSSProperties = { background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 18, overflow: 'hidden', position: 'relative' };

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 style={{ width: 16, height: 16 }} />, label: 'İcmal' },
    { id: 'teachers' as Tab, icon: <Shield style={{ width: 16, height: 16 }} />, label: 'Müəllimlər' },
    { id: 'students' as Tab, icon: <Users style={{ width: 16, height: 16 }} />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle style={{ width: 16, height: 16 }} />, label: 'Analiz' },
  ];

  // Son sınaqlar — unikal, duplikat yox
  const recentExams = (() => {
    const seen = new Set<string>();
    return students
      .flatMap(([, u]) => (u.history || []).slice(0, 1).map(h => ({ ...h, sname: u.name, sgrade: u.grade })))
      .filter(h => { const k = h.sname + h.label + h.date; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6);
  })();

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,32,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#EF3340,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#E8EEFF', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace' }}>Admin Paneli</div>
            </div>
          </div>
          <button onClick={() => { logout(); setScreen('auth'); }} style={{ width: 36, height: 36, borderRadius: 10, background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B8DB0', cursor: 'pointer' }}>
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <div className="tab-bar" style={{ marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item${tab === t.id ? ' active' : ''}`}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { n: teachers.length, l: 'Müəllim', c: '#A855F7', icon: <Shield style={{ width: 20, height: 20 }} /> },
                { n: students.length, l: 'Şagird', c: '#6378FF', icon: <Users style={{ width: 20, height: 20 }} /> },
                { n: totalExams, l: 'Sınaq', c: '#10B981', icon: <BookOpen style={{ width: 20, height: 20 }} /> },
                { n: avgBal, l: 'Orta bal', c: '#F59E0B', icon: <Award style={{ width: 20, height: 20 }} /> },
              ].map((s, i) => (
                <div key={i} style={{ ...card, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: s.c + '18', color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...card, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Son sınaqlar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentExams.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0D1120', borderRadius: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{h.sname.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.sname} <span style={{ color: '#3D4F70' }}>({h.sgrade}-ci sinif)</span></div>
                      <div style={{ fontSize: 11, color: '#3D4F70', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label} · {h.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>{h.bal700}/700</div>
                  </div>
                ))}
                {recentExams.length === 0 && <p style={{ fontSize: 13, color: '#7B8DB0', textAlign: 'center', padding: '24px 0' }}>Hələ sınaq yoxdur.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Teachers */}
        {tab === 'teachers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={() => setShowAdd(!showAdd)}>
                <Plus style={{ width: 15, height: 15 }} />Müəllim əlavə et
              </Button>
            </div>
            {showAdd && (
              <div style={{ ...card, padding: 20 }} className="animate-fade-up">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF', marginBottom: 16 }}>Yeni Müəllim</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                  <Input label="Ad Soyad" placeholder="Müəllimin adı" value={tName} onChange={e => setTName(e.target.value)} />
                  <Input label="İstifadəçi adı" placeholder="login" value={tUser} onChange={e => setTUser(e.target.value)} />
                  <Input label="Şifrə" type="password" placeholder="min. 4 simvol" value={tPass} onChange={e => setTPass(e.target.value)} />
                </div>
                {msg && <p style={{ fontSize: 12, color: msg.ok ? '#10B981' : '#EF4444', marginBottom: 12 }}>{msg.text}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="primary" size="sm" onClick={addTeacher}>Yadda saxla</Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Ləğv et</Button>
                </div>
              </div>
            )}
            <div style={card}>
              {teachers.length === 0
                ? <p style={{ fontSize: 13, color: '#7B8DB0', padding: '20px', textAlign: 'center' }}>Hələ müəllim yoxdur.</p>
                : teachers.map(([uname, u]) => (
                  <div key={uname} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid rgba(99,120,255,0.06)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#A855F7,#6378FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', marginTop: 2 }}>@{uname}</div>
                    </div>
                    <button onClick={() => del(uname)} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ ...card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users style={{ width: 16, height: 16, color: '#6378FF' }} />
              <span style={{ fontSize: 13, color: '#7B8DB0' }}>Cəmi <strong style={{ color: '#E8EEFF' }}>{students.length}</strong> şagird</span>
            </div>
            {(() => {
              const byGrade = new Map<string, [string, User][]>();
              students.forEach(([uname, u]) => {
                const g = u.grade || '?';
                if (!byGrade.has(g)) byGrade.set(g, []);
                byGrade.get(g)!.push([uname, u]);
              });
              return Array.from(byGrade.entries()).sort((a, b) => +a[0] - +b[0]).map(([grade, list]) => (
                <div key={grade} style={card}>
                  <div style={{ padding: '12px 20px', background: 'rgba(99,120,255,0.05)', borderBottom: '1px solid rgba(99,120,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{grade}-ci sinif</span>
                    <span style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace' }}>{list.length} şagird</span>
                  </div>
                  {list.map(([uname, u]) => {
                    const hist = u.history || [];
                    const best = hist.length ? Math.max(...hist.map(h => h.bal700 || 0)) : null;
                    const avg = hist.length ? Math.round(hist.reduce((s, h) => s + (h.pct || 0), 0) / hist.length) : null;
                    const lc = avg === null ? '#3D4F70' : avg >= 85 ? '#10B981' : avg >= 70 ? '#6378FF' : avg >= 50 ? '#F59E0B' : '#EF4444';
                    return (
                      <div key={uname} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(99,120,255,0.06)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', marginTop: 2 }}>{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {avg !== null && <span style={{ fontSize: 12, fontWeight: 700, color: lc }}>{avg}%</span>}
                          <button onClick={() => del(uname)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer', border: 'none' }}>
                            <Trash2 style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        )}

        {/* Weak */}
        {tab === 'weak' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ ...card, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#EF4444' }}>{weakTopics.filter(r => r.pct < 40).length}</div>
                <div style={{ fontSize: 11, color: '#3D4F70', marginTop: 6 }}>Kritik mövzu (&lt;40%)</div>
              </div>
              <div style={{ ...card, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>{weakTopics.filter(r => r.pct >= 40 && r.pct < 70).length}</div>
                <div style={{ fontSize: 11, color: '#3D4F70', marginTop: 6 }}>Orta mövzu (40-70%)</div>
              </div>
            </div>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Bütün mövzular</div>
              {weakTopics.length === 0
                ? <p style={{ fontSize: 13, color: '#7B8DB0', padding: '16px 0' }}>Hələ kifayət qədər məlumat yoxdur.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {weakTopics.map((r, i) => {
                    const fc = r.pct < 40 ? '#EF4444' : r.pct < 70 ? '#F59E0B' : '#10B981';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0D1120', borderRadius: 12 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{r.pct < 40 ? '🔴' : r.pct < 70 ? '🟡' : '🟢'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.topic}</div>
                          <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace', marginTop: 2 }}>{r.total} sual</div>
                        </div>
                        <div style={{ width: 100, flexShrink: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: fc, marginBottom: 4 }}>{r.pct}%</div>
                          <div style={{ height: 6, background: '#141B2D', borderRadius: 3, overflow: 'hidden' }}>
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
