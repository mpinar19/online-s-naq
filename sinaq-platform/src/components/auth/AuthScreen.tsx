'use client';
import { useState } from 'react';
import { doLogin, doRegister, saveCurUser, seedDemoAccounts } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import { User, Lock, UserPlus, LogIn, GraduationCap, BookOpen, ChevronDown } from 'lucide-react';

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regName, setRegName] = useState('');
  const [regGrade, setRegGrade] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const setScreen = useAppStore((s) => s.setScreen);

  const go = (role?: string) => {
    if (role === 'admin') setScreen('admin');
    else if (role === 'teacher') setScreen('teacher');
    else setScreen('home');
  };

  const handleLogin = () => {
    setLoginError('');
    if (!loginUser || !loginPass) { setLoginError('Bütün xanaları doldurun.'); return; }
    setLoading(true);
    seedDemoAccounts();
    const r = doLogin(loginUser, loginPass);
    setLoading(false);
    if (!r.success) { setLoginError(r.error || ''); return; }
    saveCurUser(r.user!);
    go(r.user?.role);
  };

  const handleRegister = () => {
    setRegError(''); setRegSuccess('');
    const r = doRegister(regName, regGrade, regUser, regPass);
    if (!r.success) { setRegError(r.error || ''); return; }
    setRegSuccess('✓ Qeydiyyat tamamlandı!');
    setTimeout(() => { setTab('login'); setLoginUser(regUser); setRegSuccess(''); }, 1500);
  };

  const quickLogin = (user: string, pass: string) => {
    seedDemoAccounts();
    setLoading(true);
    const r = doLogin(user, pass);
    setLoading(false);
    if (!r.success) return;
    saveCurUser(r.user!);
    go(r.user?.role);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#0D1120',
    border: '1px solid rgba(99,120,255,0.2)', borderRadius: 12,
    color: '#E8EEFF', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#3D4F70',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
  };
  const field: React.CSSProperties = { marginBottom: 16 };
  const iconWrap: React.CSSProperties = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3D4F70', pointerEvents: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative', overflow: 'hidden' }}>
      {/* bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,120,255,0.07)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(168,85,247,0.05)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 36px rgba(99,120,255,0.35)', marginBottom: 14 }}>
            <BookOpen style={{ width: 28, height: 28, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#E8EEFF', letterSpacing: '-0.02em', margin: 0 }}>SinaqAZ</h1>
          <p style={{ fontSize: 12, color: '#3D4F70', fontFamily: 'monospace', marginTop: 5, letterSpacing: '0.06em' }}>700 ballıq sınaq platforması</p>
        </div>

        {/* Card */}
        <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginBottom: 12 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '13px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: tab === t ? 'rgba(99,120,255,0.06)' : 'transparent',
                color: tab === t ? '#E8EEFF' : '#7B8DB0',
                borderBottom: tab === t ? '2px solid #6378FF' : '2px solid transparent',
                fontFamily: 'inherit',
              }}>
                {t === 'login' ? <><LogIn style={{ width: 15, height: 15 }} />Giriş</> : <><UserPlus style={{ width: 15, height: 15 }} />Qeydiyyat</>}
              </button>
            ))}
          </div>

          <div style={{ padding: 22 }}>
            {/* LOGIN */}
            {tab === 'login' && (
              <div className="animate-fade-in">
                <div style={field}>
                  <label style={lbl}>İstifadəçi adı</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><User style={{ width: 15, height: 15 }} /></span>
                    <input style={{ ...inp, paddingLeft: 38 }} placeholder="istifadəçi adınızı daxil edin"
                      value={loginUser} onChange={e => setLoginUser(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                <div style={field}>
                  <label style={lbl}>Şifrə</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><Lock style={{ width: 15, height: 15 }} /></span>
                    <input type="password" style={{ ...inp, paddingLeft: 38 }} placeholder="şifrənizi daxil edin"
                      value={loginPass} onChange={e => setLoginPass(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                {loginError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 11, marginBottom: 14 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{loginError}</p>
                  </div>
                )}
                <Button variant="primary" size="lg" className="w-full" onClick={handleLogin} loading={loading}>
                  <LogIn style={{ width: 15, height: 15 }} />Daxil ol
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#7B8DB0', marginTop: 14 }}>
                  Hesabınız yoxdur?{' '}
                  <button onClick={() => setTab('register')} style={{ color: '#6378FF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Qeydiyyatdan keçin
                  </button>
                </p>
              </div>
            )}

            {/* REGISTER */}
            {tab === 'register' && (
              <div className="animate-fade-in">
                <div style={field}>
                  <label style={lbl}>Ad Soyad</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><User style={{ width: 15, height: 15 }} /></span>
                    <input style={{ ...inp, paddingLeft: 38 }} placeholder="adınızı daxil edin"
                      value={regName} onChange={e => setRegName(e.target.value)} />
                  </div>
                </div>
                <div style={field}>
                  <label style={lbl}>Sinif</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><GraduationCap style={{ width: 15, height: 15 }} /></span>
                    <select style={{ ...inp, paddingLeft: 38, appearance: 'none' }}
                      value={regGrade} onChange={e => setRegGrade(e.target.value)}>
                      <option value="">Sinif seçin...</option>
                      {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                        <option key={g} value={g} style={{ background: '#0D1120' }}>{g}-ci sinif</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={field}>
                  <label style={lbl}>İstifadəçi adı</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><User style={{ width: 15, height: 15 }} /></span>
                    <input style={{ ...inp, paddingLeft: 38 }} placeholder="istifadəçi adı seçin"
                      value={regUser} onChange={e => setRegUser(e.target.value)} />
                  </div>
                </div>
                <div style={field}>
                  <label style={lbl}>Şifrə</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><Lock style={{ width: 15, height: 15 }} /></span>
                    <input type="password" style={{ ...inp, paddingLeft: 38 }} placeholder="min. 4 simvol"
                      value={regPass} onChange={e => setRegPass(e.target.value)} />
                  </div>
                </div>
                {regError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 11, marginBottom: 14 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{regError}</p>
                  </div>
                )}
                {regSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 11, marginBottom: 14 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#10B981', margin: 0 }}>{regSuccess}</p>
                  </div>
                )}
                <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                  <UserPlus style={{ width: 15, height: 15 }} />Qeydiyyatdan keç
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#7B8DB0', marginTop: 14 }}>
                  Hesabınız var?{' '}
                  <button onClick={() => setTab('login')} style={{ color: '#6378FF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Daxil olun
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demo accounts — gizli, açmaq üçün düymə */}
        <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
          <button onClick={() => setShowDemo(!showDemo)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Demo hesablar (müəllim / admin)
            </span>
            <ChevronDown style={{ width: 14, height: 14, color: '#3D4F70', transform: showDemo ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showDemo && (
            <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="animate-fade-in">
              {[
                { role: 'Admin', user: 'admin', pass: 'admin123', color: '#EF4444' },
                { role: 'Müəllim', user: 'teacher', pass: 'teacher123', color: '#A855F7' },
              ].map(acc => (
                <div key={acc.user} style={{ background: '#0D1120', border: '1px solid rgba(99,120,255,0.08)', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: acc.color, marginBottom: 8 }}>{acc.role}</div>
                  <div style={{ fontSize: 11, color: '#3D4F70', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'monospace', color: '#7B8DB0' }}>{acc.user}</span> / <span style={{ fontFamily: 'monospace', color: '#7B8DB0' }}>{acc.pass}</span>
                  </div>
                  <button onClick={() => quickLogin(acc.user, acc.pass)} style={{
                    width: '100%', padding: '7px 0', borderRadius: 9, fontSize: 12, fontWeight: 700,
                    background: acc.color + '18', color: acc.color, border: `1px solid ${acc.color}30`,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    Daxil ol →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
