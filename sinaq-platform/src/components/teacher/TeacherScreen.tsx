'use client';
import { useState } from 'react';
import { getCurUser, getUsers, logout } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { BarChart2, AlertTriangle, BookOpen, TrendingUp, Award, ChevronDown, ChevronUp, Search, FileText, Users, LogOut, Cpu } from 'lucide-react';
import PDFUploadPanel from '@/components/pdf/PDFUploadPanel';

type Tab = 'overview' | 'students' | 'weak' | 'pdf';

export default function TeacherScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const cu = getCurUser();

  // Her render-da fresh data al
  const users = getUsers();

  // Şagirdlər — unikal username ilə (duplikat yox)
  const studentMap = new Map<string, typeof users[string]>();
  Object.entries(users).forEach(([uname, u]) => {
    if (u.role !== 'teacher' && u.role !== 'admin') {
      if (!studentMap.has(uname)) studentMap.set(uname, u);
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

  // Axtarış + sinifə görə qruplaşdır (unikal)
  const filtered = search
    ? students.filter(([, u]) => u.name.toLowerCase().includes(search.toLowerCase()) || String(u.grade).includes(search))
    : students;

  const byGrade = new Map<string, Array<[string, typeof users[string]]>>();
  filtered.forEach(entry => {
    const g = entry[1].grade || '?';
    if (!byGrade.has(g)) byGrade.set(g, []);
    byGrade.get(g)!.push(entry);
  });

  const tabs = [
    { id: 'overview' as Tab, icon: <BarChart2 style={{ width: 16, height: 16 }} />, label: 'İcmal' },
    { id: 'students' as Tab, icon: <Users style={{ width: 16, height: 16 }} />, label: 'Şagirdlər' },
    { id: 'weak' as Tab, icon: <AlertTriangle style={{ width: 16, height: 16 }} />, label: 'Analiz' },
    { id: 'pdf' as Tab, icon: <FileText style={{ width: 16, height: 16 }} />, label: 'PDF Sual' },
  ];

  const card: React.CSSProperties = { background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 18, overflow: 'hidden', position: 'relative' };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,32,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#E8EEFF', lineHeight: 1.2 }}>SinaqAZ</div>
              <div style={{ fontSize: 10, color: '#3D4F70', fontFamily: 'monospace' }}>Müəllim Paneli</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cu && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', borderRadius: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>{cu.name.charAt(0)}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EEFF' }}>{cu.name}</span>
              </div>
            )}
            <button onClick={() => { logout(); setScreen('auth'); }} style={{ width: 36, height: 36, borderRadius: 10, background: '#141B2D', border: '1px solid rgba(99,120,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B8DB0', cursor: 'pointer' }}>
              <LogOut style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item${tab === t.id ? ' active' : ''}`}>
              {t.icon}<span style={{ display: 'none' }} className="sm:inline">{t.label}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { n: students.length, l: 'Şagird', c: '#6378FF', icon: <Users style={{ width: 20, height: 20 }} /> },
                { n: totalExams, l: 'Sınaq', c: '#10B981', icon: <BookOpen style={{ width: 20, height: 20 }} /> },
                { n: avgBal, l: 'Orta bal', c: '#F59E0B', icon: <Award style={{ width: 20, height: 20 }} /> },
                { n: avgPct + '%', l: 'Orta faiz', c: '#A855F7', icon: <TrendingUp style={{ width: 20, height: 20 }} /> },
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
                {students
                  .flatMap(([, u]) => (u.history || []).slice(0, 2).map(h => ({ ...h, sname: u.name, sgrade: u.grade })))
                  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                  .slice(0, 8)
                  .map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0D1120', borderRadius: 12, border: '1px solid rgba(99,120,255,0.07)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{h.sname.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.sname}</div>
                        <div style={{ fontSize: 11, color: '#3D4F70', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label} · {h.date}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>{h.bal700}/700</div>
                    </div>
                  ))}
                {totalExams === 0 && <p style={{ fontSize: 13, color: '#7B8DB0', textAlign: 'center', padding: '24px 0' }}>Hələ sınaq yoxdur.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
              <input type="text" placeholder="Şagird adı və ya sinif axtar..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#141B2D', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 14, fontSize: 13, color: '#E8EEFF', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            {Array.from(byGrade.entries()).sort((a, b) => +a[0] - +b[0]).map(([grade, list]) => (
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
                  const isOpen = expanded === uname;
                  return (
                    <div key={uname} style={{ borderBottom: '1px solid rgba(99,120,255,0.06)' }}>
                      <button onClick={() => setExpanded(isOpen ? null : uname)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', marginTop: 2 }}>{hist.length} sınaq · {best !== null ? best + ' bal' : '—'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                          {avg !== null && <span style={{ fontSize: 13, fontWeight: 700, color: lc }}>{avg}%</span>}
                          {isOpen ? <ChevronUp style={{ width: 16, height: 16, color: '#3D4F70' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#3D4F70' }} />}
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 20px 16px' }} className="animate-fade-in">
                          {hist.length === 0
                            ? <p style={{ fontSize: 12, color: '#3D4F70', padding: '8px 0' }}>Hələ sınaq yoxdur.</p>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {hist.slice(0, 5).map((h, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0D1120', borderRadius: 12 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</div>
                                    <div style={{ fontSize: 10, color: '#3D4F70', marginTop: 2 }}>{h.date}</div>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444' }}>{h.bal700}/700</div>
                                    <div style={{ fontSize: 10, color: '#3D4F70' }}>{h.pct}%</div>
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
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#7B8DB0' }}>
                <Users style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 14 }}>Şagird tapılmadı.</p>
              </div>
            )}
          </div>
        )}

        {/* Weak topics */}
        {tab === 'weak' && (
          <div style={{ ...card, padding: 20 }} className="animate-fade-in">
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Ən çox çətinlik çəkilən mövzular</div>
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
        )}

        {/* PDF */}
        {tab === 'pdf' && (
          <div className="animate-fade-in">
            <div style={{ padding: '12px 16px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, marginBottom: 16 }}>
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
