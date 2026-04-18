'use client';
import { useState } from 'react';
import { doLogin, doRegister, saveCurUser, seedDemoAccounts } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  User, Lock, UserPlus, LogIn, GraduationCap, Cpu,
  Zap, Shield, Globe, Copy, Check
} from 'lucide-react';

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

  const handleLogin = () => {
    setLoginError('');
    if (!loginUser || !loginPass) { setLoginError('Bütün xanaları doldurun.'); return; }
    setLoading(true);
    // Ensure demo accounts exist before login attempt
    seedDemoAccounts();
    const result = doLogin(loginUser, loginPass);
    setLoading(false);
    if (!result.success) { setLoginError(result.error || ''); return; }
    saveCurUser(result.user!);
    const role = result.user?.role;
    if (role === 'admin') setScreen('admin');
    else if (role === 'teacher') setScreen('teacher');
    else setScreen('home');
  };

  const handleRegister = () => {
    setRegError(''); setRegSuccess('');
    const result = doRegister(regName, regGrade, regUser, regPass);
    if (!result.success) { setRegError(result.error || ''); return; }
    setRegSuccess('✓ Qeydiyyat tamamlandı! İndi daxil olun.');
    setTimeout(() => { setTab('login'); setLoginUser(regUser); setRegSuccess(''); }, 1500);
  };

  const quickLogin = (user: string, pass: string) => {
    seedDemoAccounts();
    setLoginUser(user);
    setLoginPass(pass);
    setLoginError('');
    setLoading(true);
    const result = doLogin(user, pass);
    setLoading(false);
    if (!result.success) { setLoginError(result.error || ''); return; }
    saveCurUser(result.user!);
    const role = result.user?.role;
    if (role === 'admin') setScreen('admin');
    else if (role === 'teacher') setScreen('teacher');
    else setScreen('home');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const demoAccounts = [
    { role: 'Admin', user: 'admin', pass: 'admin123', color: '#EF4444', icon: <Shield className="w-3.5 h-3.5" /> },
    { role: 'Müəllim', user: 'teacher', pass: 'teacher123', color: '#A855F7', icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(99,120,255,0.07)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(168,85,247,0.05)' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center shadow-[0_0_40px_rgba(99,120,255,0.35)] mb-4">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#E8EEFF] tracking-tight">SinaqAZ</h1>
          <p className="text-xs text-[#3D4F70] font-mono mt-1 tracking-wider">700 ballıq sistem · AI-powered</p>

          {/* Feature pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
            {[
              { icon: <Zap className="w-3 h-3" />, text: '700 bal sistemi', c: '#F59E0B' },
              { icon: <Globe className="w-3 h-3" />, text: 'AI axtarış', c: '#06B6D4' },
              { icon: <Shield className="w-3 h-3" />, text: 'PDF → Sual', c: '#A855F7' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ borderColor: f.c + '30', background: f.c + '10', color: f.c }}>
                {f.icon}{f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          {/* Tabs */}
          <div className="flex border-b border-[rgba(99,120,255,0.1)]">
            {(['login', 'register'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all',
                  tab === t
                    ? 'text-[#E8EEFF] border-b-2 border-[#6378FF] bg-[rgba(99,120,255,0.05)]'
                    : 'text-[#7B8DB0] hover:text-[#E8EEFF] hover:bg-[rgba(99,120,255,0.03)]'
                )}>
                {t === 'login' ? <><LogIn className="w-4 h-4" />Giriş</> : <><UserPlus className="w-4 h-4" />Qeydiyyat</>}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Login */}
            {tab === 'login' && (
              <div className="space-y-4 animate-fade-in">
                <Input label="İstifadəçi adı" placeholder="istifadəçi adınızı daxil edin"
                  value={loginUser} onChange={e => setLoginUser(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  icon={<User className="w-4 h-4" />} />
                <Input label="Şifrə" type="password" placeholder="şifrənizi daxil edin"
                  value={loginPass} onChange={e => setLoginPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  icon={<Lock className="w-4 h-4" />} />

                {loginError && (
                  <div className="flex items-center gap-2 p-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" />
                    <p className="text-xs text-[#EF4444]">{loginError}</p>
                  </div>
                )}

                <Button variant="primary" size="lg" className="w-full" onClick={handleLogin} loading={loading}>
                  <LogIn className="w-4 h-4" />Daxil ol
                </Button>

                <p className="text-center text-sm text-[#7B8DB0]">
                  Hesabınız yoxdur?{' '}
                  <button onClick={() => setTab('register')} className="text-[#6378FF] font-semibold hover:underline">
                    Qeydiyyatdan keçin
                  </button>
                </p>
              </div>
            )}

            {/* Register */}
            {tab === 'register' && (
              <div className="space-y-4 animate-fade-in">
                <Input label="Ad Soyad" placeholder="adınızı daxil edin"
                  value={regName} onChange={e => setRegName(e.target.value)}
                  icon={<User className="w-4 h-4" />} />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#3D4F70] uppercase tracking-wider">Sinif</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D4F70]" />
                    <select value={regGrade} onChange={e => setRegGrade(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#0D1120] border border-[rgba(99,120,255,0.2)] rounded-xl text-sm text-[#E8EEFF] outline-none focus:border-[#6378FF] transition-all appearance-none">
                      <option value="">Sinif seçin...</option>
                      {['1','2','3','4','5','6','7','8','9','10','11'].map(g => (
                        <option key={g} value={g} className="bg-[#0D1120]">{g}-ci sinif</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input label="İstifadəçi adı" placeholder="istifadəçi adı seçin"
                  value={regUser} onChange={e => setRegUser(e.target.value)}
                  icon={<User className="w-4 h-4" />} />
                <Input label="Şifrə" type="password" placeholder="şifrə yaradın (min. 4 simvol)"
                  value={regPass} onChange={e => setRegPass(e.target.value)}
                  icon={<Lock className="w-4 h-4" />} />

                {regError && (
                  <div className="flex items-center gap-2 p-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" />
                    <p className="text-xs text-[#EF4444]">{regError}</p>
                  </div>
                )}
                {regSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                    <p className="text-xs text-[#10B981]">{regSuccess}</p>
                  </div>
                )}

                <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                  <UserPlus className="w-4 h-4" />Qeydiyyatdan keç
                </Button>

                <p className="text-center text-sm text-[#7B8DB0]">
                  Hesabınız var?{' '}
                  <button onClick={() => setTab('login')} className="text-[#6378FF] font-semibold hover:underline">
                    Daxil olun
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-2xl p-4">
          <div className="text-[10px] font-bold text-[#3D4F70] uppercase tracking-wider mb-3 text-center">
            Demo hesablar — bir kliklə daxil ol
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <div key={acc.user} className="bg-[#0D1120] border border-[rgba(99,120,255,0.1)] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: acc.color + '20', color: acc.color }}>
                    {acc.icon}
                  </div>
                  <span className="text-xs font-bold" style={{ color: acc.color }}>{acc.role}</span>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#3D4F70]">İstifadəçi adı</span>
                    <div className="flex items-center gap-1">
                      <code className="text-[11px] font-mono text-[#E8EEFF] bg-[#141B2D] px-1.5 py-0.5 rounded">{acc.user}</code>
                      <button onClick={() => copyToClipboard(acc.user, acc.user + '_u')}
                        className="text-[#3D4F70] hover:text-[#6378FF] transition-all">
                        {copied === acc.user + '_u' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#3D4F70]">Şifrə</span>
                    <div className="flex items-center gap-1">
                      <code className="text-[11px] font-mono text-[#E8EEFF] bg-[#141B2D] px-1.5 py-0.5 rounded">{acc.pass}</code>
                      <button onClick={() => copyToClipboard(acc.pass, acc.user + '_p')}
                        className="text-[#3D4F70] hover:text-[#6378FF] transition-all">
                        {copied === acc.user + '_p' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => quickLogin(acc.user, acc.pass)}
                  className="w-full py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: acc.color + '20', color: acc.color, border: `1px solid ${acc.color}30` }}>
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
