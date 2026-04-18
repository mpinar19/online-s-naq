'use client';
import { useState } from 'react';
import { doLogin, doRegister, saveCurUser, seedDemoAccounts } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import { User, Lock, UserPlus, LogIn, GraduationCap, Cpu, Shield, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState<string | null>(null);
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
    if (!r.success) { setLoginError(r.error || ''); return; }
    saveCurUser(r.user!);
    go(r.user?.role);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: '#0D1120',
    border: '1px solid rgba(99,120,255,0.2)',
    borderRadius: '12px',
    color: '#E8EEFF',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#3D4F70',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '6px',
  };

  const fieldStyle: React.CSSProperties = { marginBottom: '16px' };

  const demos = [
    { role: 'Admin', user: 'admin', pass: 'admin123', color: '#EF4444' },
    { role: 'Müəllim', user: 'teacher', pass: 'teacher123', color: '#A855F7' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative', overflow: 'hidden' }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,120,255,0.07)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(168,85,247,0.05)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(99,120,255,0.35)', marginBottom: 16 }}>
            <Cpu style={{ width: 32, height: 32, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#E8EEFF', letterSpacing: '-0.02em', margin: 0 }}>SinaqAZ</h1>
          <p style={{ fontSize: 11, color: '#3D4F70', fontFamily: 'monospace', marginTop: 6, letterSpacing: '0.08em' }}>700 ballıq sistem · AI-powered</p>
        </div>

        {/* Card */}
        <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', marginBottom: 16 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: tab === t ? 'rgba(99,120,255,0.06)' : 'transparent',
                color: tab === t ? '#E8EEFF' : '#7B8DB0',
                borderBottom: tab === t ? '2px solid #6378FF' : '2px solid transparent',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
                {t === 'login' ? <><LogIn style={{ width: 16, height: 16 }} />Giriş</> : <><UserPlus style={{ width: 16, height: 16 }} />Qeydiyyat</>}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {tab === 'login' && (
              <div className="animate-fade-in">
                <div style={fieldStyle}>
                  <label style={labelStyle}>İstifadəçi adı</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <input style={{ ...inputStyle, paddingLeft: 40 }} placeholder="istifadəçi adınızı daxil edin"
                      value={loginUser} onChange={e => setLoginUser(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Şifrə</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <input type="password" style={{ ...inputStyle, paddingLeft: 40 }} placeholder="şifrənizi daxil edin"
                      value={loginPass} onChange={e => setLoginPass(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                {loginError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{loginError}</p>
                  </div>
                )}
                <Button variant="primary" size="lg" className="w-full" onClick={handleLogin} loading={loading}>
                  <LogIn style={{ width: 16, height: 16 }} />Daxil ol
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#7B8DB0', marginTop: 16 }}>
                  Hesabınız yoxdur?{' '}
                  <button onClick={() => setTab('register')} style={{ color: '#6378FF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Qeydiyyatdan keçin
                  </button>
                </p>
              </div>
            )}

            {tab === 'register' && (
              <div className="animate-fade-in">
                <div style={fieldStyle}>
                  <label style={labelStyle}>Ad Soyad</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <input style={{ ...inputStyle, paddingLeft: 40 }} placeholder="adınızı daxil edin"
                      value={regName} onChange={e => setRegName(e.target.value)} />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Sinif</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <select style={{ ...inputStyle, paddingLeft: 40, appearance: 'none' }}
                      value={regGrade} onChange={e => setRegGrade(e.target.value)}>
                      <option value="">Sinif seçin...</option>
                      {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                        <option key={g} value={g} style={{ background: '#0D1120' }}>{g}-ci sinif</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>İstifadəçi adı</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <input style={{ ...inputStyle, paddingLeft: 40 }} placeholder="istifadəçi adı seçin"
                      value={regUser} onChange={e => setRegUser(e.target.value)} />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Şifrə</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#3D4F70' }} />
                    <input type="password" style={{ ...inputStyle, paddingLeft: 40 }} placeholder="min. 4 simvol"
                      value={regPass} onChange={e => setRegPass(e.target.value)} />
                  </div>
                </div>
                {regError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{regError}</p>
                  </div>
                )}
                {regSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#10B981', margin: 0 }}>{regSuccess}</p>
                  </div>
                )}
                <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                  <UserPlus style={{ width: 16, height: 16 }} />Qeydiyyatdan keç
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#7B8DB0', marginTop: 16 }}>
                  Hesabınız var?{' '}
                  <button onClick={() => setTab('login')} style={{ color: '#6378FF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Daxil olun
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demo accounts */}
        <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 20, padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'center', marginBottom: 12 }}>
            Demo hesablar — bir kliklə daxil ol
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {demos.map(acc => (
              <div key={acc.user} style={{ background: '#0D1120', border: '1px solid rgba(99,120,255,0.1)', borderRadius: 14, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: acc.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield style={{ width: 14, height: 14, color: acc.color }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: acc.color }}>{acc.role}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#3D4F70' }}>İstifadəçi adı</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#E8EEFF', background: '#141B2D', padding: '2px 6px', borderRadius: 4 }}>{acc.user}</code>
                      <button onClick={() => copy(acc.user, acc.user + '_u')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D4F70', padding: 2 }}>
                        {copied === acc.user + '_u' ? <Check style={{ width: 12, height: 12, color: '#10B981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#3D4F70' }}>Şifrə</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#E8EEFF', background: '#141B2D', padding: '2px 6px', borderRadius: 4 }}>{acc.pass}</code>
                      <button onClick={() => copy(acc.pass, acc.user + '_p')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D4F70', padding: 2 }}>
                        {copied === acc.user + '_p' ? <Check style={{ width: 12, height: 12, color: '#10B981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => quickLogin(acc.user, acc.pass)} style={{
                  width: '100%', padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  background: acc.color + '20', color: acc.color, border: `1px solid ${acc.color}35`,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                }}>
                  Daxil ol →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
