'use client';
import { useState } from 'react';
import { getCurUser, getUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { BarChart2, AlertTriangle, BookOpen, TrendingUp, Award, ChevronDown, ChevronUp, Search, FileText, Users, LogOut, Cpu, Sun, Moon } from 'lucide-react';
import PDFUploadPanel from '@/components/pdf/PDFUploadPanel';

type Tab = 'overview' | 'students' | 'weak' | 'pdf';

export default function TeacherScreen() {
  const { setScreen, theme, toggleTheme } = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const cu = getCurUser();
  const users = getUsers();

  // Unikal şagirdlər
  const studentMap = new Map<string, typeof users[string]>();
  Object.entries(users).forEach(([uname, u]) => {
    if (u.role !== 'teacher' && u.role !== 'admin' && !studentMap.has(uname)) {
      studentMap.set(uname, u);
    }
  });
  const students = Array.from(studentMap.entries());

  const allHist = students.flatMap(([, u]) => u.history || []);
  const totalExams = allHist.length;
  const avgBal = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.bal700 || 0), 0) / totalExams) : 0;
  const avgPct = totalExams ? Math.round(allHist.reduce((s, h) => s + (h.pct || 0), 0) / totalExams) : 0;

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
    .sort((a, b) => a.pct - b.pct).slice(0, 15);

  // Son sınaqlar — unikal
  const recentExams = (() => {
    const seen = new Set<string>();
    return students
      .flatMap(([, u]) => (u.history || []).slice(0, 1).map(h => ({ ...h, sname: u.name, sgrade: u.grade })))
      .filter(h => { const k = h.sname + h.label + h.date; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 8);
  })();

  const filtered = search
    ? students.filter(([, u]) => u.name.toLowerCase().includes(search.toLowerCase()) || String(u.grade).includes(search))
    : students;

  const byGrade = new Map<string, typeof students>();
  filtered.forEach(e => {
    const g = e[1].grade || '?';
    if (!byGrade.has(g)) byGrade.set(g, []);
    byGrade.get(g)!.push(e);
  });

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', position: 'relative' };
  const sc = (pct: number) => pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 style={{ width: 15, height: 15 }} />, label: 'İcmal' },
    { id: 'students' as Tab, icon: <Users style={{ width: 15, height: 15 }} />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle style={{ width: 15, height: 15 }} />, label: 'Analiz' },
    { id: 'pdf' as Tab, icon: <FileText style={{ width: 15, height: 15 }} />, label: 'PDF Sual' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--txt)', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'monospace' }}>Müəllim Paneli</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cu && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>{cu.name.charAt(0)}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>{cu.name}</span>
              </div>
            )}
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
        <div className="tab-bar" style={{ marginBottom: 20 }}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`tab-item${tab === tb.id ? ' active' : ''}`}>
              {tb.icon}<span>{tb.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { n: students.length, l: 'Şagird', c: 'var(--acc)', icon: <Users style={{ width: 20, height: 20 }} /> },
                { n: totalExams, l: 'Sınaq', c: 'var(--green)', icon: <BookOpen style={{ width: 20, height: 20 }} /> },
                { n: avgBal, l: 'Orta bal', c: 'var(--amber)', icon: <Award style={{ width: 20, height: 20 }} /> },
                { n: avgPct + '%', l: 'Orta faiz', c: 'var(--acc2)', icon: <TrendingUp style={{ width: 20, height: 20 }} /> },
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
            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Son sınaqlar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentExams.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{h.sname.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.sname}</div>
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

        {/* Students */}
        {tab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--txt3)' }} />
              <input type="text" placeholder="Şagird adı axtar..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '11px 14px 11px 38px', background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 13, fontSize: 13, color: 'var(--txt)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
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
                  const isOpen = expanded === uname;
                  return (
                    <div key={uname} style={{ borderBottom: '1px solid var(--bd)' }}>
                      <button onClick={() => setExpanded(isOpen ? null : uname)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 2 }}>{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {avg !== null && <span style={{ fontSize: 12, fontWeight: 700, color: lc }}>{avg}%</span>}
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
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--txt2)' }}>
                <Users style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 14 }}>Şagird tapılmadı.</p>
              </div>
            )}
          </div>
        )}

        {/* Weak */}
        {tab === 'weak' && (
          <div style={{ ...card, padding: 18 }} className="animate-fade-in">
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Ən çox çətinlik çəkilən mövzular</div>
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
        )}

        {/* PDF */}
        {tab === 'pdf' && (
          <div className="animate-fade-in">
            <div style={{ padding: '11px 16px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 13, marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: '#C084FC', margin: 0, lineHeight: 1.6 }}>
                📄 PDF faylı yükləyin — AI mövzulara görə suallar yaradacaq. Hər mövzunu ayrıca silə bilərsiniz.
              </p>
            </div>
            <PDFUploadPanel teacherMode />
          </div>
        )}
      </div>
    </div>
  );
}
