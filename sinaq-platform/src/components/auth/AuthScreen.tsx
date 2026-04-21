'use client';
import { useState } from 'react';
import { doLogin, doRegister, saveCurUser, seedDemoAccounts } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import Button from '@/components/ui/Button';
import { User, Lock, UserPlus, LogIn, GraduationCap, ChevronDown, Sun, Moon, Globe } from 'lucide-react';

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
  const { setScreen, lang, setLang, theme, toggleTheme } = useAppStore();

  const T = (k: Parameters<typeof t>[1]) => t(lang, k);

  const go = (role?: string) => {
    if (role === 'admin') setScreen('admin');
    else if (role === 'teacher') setScreen('teacher');
    else setScreen('home');
  };

  const handleLogin = () => {
    setLoginError('');
    if (!loginUser || !loginPass) { setLoginError(T('fillAll')); return; }
    setLoading(true);
    seedDemoAccounts();
    const r = doLogin(loginUser, loginPass);
    setLoading(false);
    if (!r.success) { setLoginError(r.error || T('wrongCreds')); return; }
    saveCurUser(r.user!);
    go(r.user?.role);
  };

  const handleRegister = () => {
    setRegError(''); setRegSuccess('');
    const r = doRegister(regName, regGrade, regUser, regPass);
    if (!r.success) { setRegError(r.error || ''); return; }
    setRegSuccess(T('regDone'));
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

  const isDark = theme === 'dark';
  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 38px',
    background: 'var(--bg2)', border: '1px solid var(--bd2)',
    borderRadius: 12, color: 'var(--txt)', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--txt3)',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
  };
  const field: React.CSSProperties = { marginBottom: 14 };
  const iconPos: React.CSSProperties = { position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt3)', pointerEvents: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,120,255,0.07)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(168,85,247,0.05)', filter: 'blur(80px)' }} />
      </div>

      {/* Top controls */}
      <div style={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 10 }}>
        {/* Lang */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 10, padding: 4 }}>
          {(['az','ru','en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '4px 8px', borderRadius: 7, fontSize: 11, fontWeight: 700,
              background: lang === l ? 'var(--acc)' : 'transparent',
              color: lang === l ? '#fff' : 'var(--txt2)',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
            }}>{l}</button>
          ))}
        </div>
        {/* Theme */}
        <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt2)', cursor: 'pointer' }}>
          {isDark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 36px rgba(99,120,255,0.35)', marginBottom: 12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="4" width="14" height="20" rx="2" fill="white" opacity="0.95"/>
              <rect x="7" y="8" width="10" height="2" rx="1" fill="#6378FF"/>
              <rect x="7" y="12" width="10" height="2" rx="1" fill="#6378FF"/>
              <rect x="7" y="16" width="6" height="2" rx="1" fill="#6378FF"/>
              <path d="M21 14 L27 8 L29 10 L23 16 L21 17 Z" fill="white" opacity="0.9"/>
              <path d="M21 17 L19 19 L20 17 Z" fill="#F59E0B"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.02em', margin: 0 }}>{T('appName')}</h1>
          <p style={{ fontSize: 12, color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 4 }}>{T('appSub')}</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--bd2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px var(--shadow)', marginBottom: 10 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--bd)' }}>
            {(['login', 'register'] as const).map(tb => (
              <button key={tb} onClick={() => setTab(tb)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '13px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: tab === tb ? 'var(--acc-bg)' : 'transparent',
                color: tab === tb ? 'var(--txt)' : 'var(--txt2)',
                borderBottom: tab === tb ? '2px solid var(--acc)' : '2px solid transparent',
                fontFamily: 'inherit',
              }}>
                {tb === 'login' ? <><LogIn style={{ width: 15, height: 15 }} />{T('login')}</> : <><UserPlus style={{ width: 15, height: 15 }} />{T('register')}</>}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {tab === 'login' && (
              <div className="animate-fade-in">
                <div style={field}>
                  <label style={lbl}>{T('username')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconPos}><User style={{ width: 15, height: 15 }} /></span>
                    <input style={inp} placeholder={T('username')} value={loginUser} onChange={e => setLoginUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                <div style={field}>
                  <label style={lbl}>{T('password')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconPos}><Lock style={{ width: 15, height: 15 }} /></span>
                    <input type="password" style={inp} placeholder={T('password')} value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                </div>
                {loginError && <div style={{ padding: '9px 13px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 11, marginBottom: 14, fontSize: 12, color: 'var(--red)' }}>{loginError}</div>}
                <Button variant="primary" size="lg" className="w-full" onClick={handleLogin} loading={loading}>
                  <LogIn style={{ width: 15, height: 15 }} />{T('loginBtn')}
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt2)', marginTop: 14 }}>
                  {T('noAccount')}{' '}
                  <button onClick={() => setTab('register')} style={{ color: 'var(--acc)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>{T('register')}</button>
                </p>
              </div>
            )}

            {tab === 'register' && (
              <div className="animate-fade-in">
                {[
                  { lbl: T('fullname'), icon: <User style={{ width: 15, height: 15 }} />, val: regName, set: setRegName, type: 'text' },
                ].map((f, i) => (
                  <div key={i} style={field}>
                    <label style={lbl}>{f.lbl}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconPos}>{f.icon}</span>
                      <input type={f.type} style={inp} placeholder={f.lbl} value={f.val} onChange={e => f.set(e.target.value)} />
                    </div>
                  </div>
                ))}
                <div style={field}>
                  <label style={lbl}>{T('grade')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconPos}><GraduationCap style={{ width: 15, height: 15 }} /></span>
                    <select style={{ ...inp, appearance: 'none' }} value={regGrade} onChange={e => setRegGrade(e.target.value)}>
                      <option value="">{T('selectGrade')}</option>
                      {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                        <option key={g} value={g} style={{ background: 'var(--bg2)' }}>{g}-ci sinif</option>
                      ))}
                    </select>
                  </div>
                </div>
                {[
                  { lbl: T('username'), icon: <User style={{ width: 15, height: 15 }} />, val: regUser, set: setRegUser, type: 'text' },
                  { lbl: T('password'), icon: <Lock style={{ width: 15, height: 15 }} />, val: regPass, set: setRegPass, type: 'password' },
                ].map((f, i) => (
                  <div key={i} style={field}>
                    <label style={lbl}>{f.lbl}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconPos}>{f.icon}</span>
                      <input type={f.type} style={inp} placeholder={f.lbl} value={f.val} onChange={e => f.set(e.target.value)} />
                    </div>
                  </div>
                ))}
                {regError && <div style={{ padding: '9px 13px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 11, marginBottom: 14, fontSize: 12, color: 'var(--red)' }}>{regError}</div>}
                {regSuccess && <div style={{ padding: '9px 13px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 11, marginBottom: 14, fontSize: 12, color: 'var(--green)' }}>{regSuccess}</div>}
                <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                  <UserPlus style={{ width: 15, height: 15 }} />{T('registerBtn')}
                </Button>
                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt2)', marginTop: 14 }}>
                  {T('hasAccount')}{' '}
                  <button onClick={() => setTab('login')} style={{ color: 'var(--acc)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>{T('login')}</button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demo accounts — gizli */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--bd)', borderRadius: 14, overflow: 'hidden' }}>
          <button onClick={() => setShowDemo(!showDemo)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{T('demoAccounts')}</span>
            <ChevronDown style={{ width: 14, height: 14, color: 'var(--txt3)', transform: showDemo ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {showDemo && (
            <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="animate-fade-in">
              {[
                { role: 'Admin', user: 'admin', pass: 'admin123', color: '#EF4444' },
                { role: 'Muellim', user: 'teacher', pass: 'teacher123', color: '#A855F7' },
              ].map(acc => (
                <div key={acc.user} style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: acc.color, marginBottom: 6 }}>{acc.role}</div>
                  <div style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 8, fontFamily: 'monospace' }}>{acc.user} / {acc.pass}</div>
                  <button onClick={() => quickLogin(acc.user, acc.pass)} style={{ width: '100%', padding: '7px 0', borderRadius: 9, fontSize: 12, fontWeight: 700, background: acc.color + '18', color: acc.color, border: `1px solid ${acc.color}30`, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {T('loginBtn')} →
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