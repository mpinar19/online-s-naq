// auth.ts — localStorage + Supabase hybrid
import { User } from './types';

// ── localStorage helpers ──────────────────────────────────────
export const getUsers = (): Record<string, User> => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem('az_users') || '{}'); } catch { return {}; }
};

export const saveUsers = (u: Record<string, User>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('az_users', JSON.stringify(u));
};

export const getCurUser = (): (User & { username: string }) | null => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(sessionStorage.getItem('az_cur') || 'null'); } catch { return null; }
};

export const saveCurUser = (u: (User & { username: string }) | null) => {
  if (typeof window === 'undefined') return;
  if (u) sessionStorage.setItem('az_cur', JSON.stringify(u));
  else sessionStorage.removeItem('az_cur');
};

// ── Supabase helpers ──────────────────────────────────────────
function getSupabase() {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || url.includes('your_') || !key || key.includes('your_')) return null;
  // Lazy import — sadece Supabase konfiqurasiya edilibsə yüklənir
  return { url, key };
}

async function sbUpsertUser(username: string, user: User) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(sb.url, sb.key);
    await client.from('users').upsert({ username, ...user }, { onConflict: 'username' });
  } catch { /* Supabase xətası — localStorage-da saxlanılır */ }
}

async function sbSaveHistory(username: string, entry: {
  label: string; bal700: number; correct: number; total: number; pct: number; date: string;
  topicBreakdown?: Record<string, { correct: number; total: number; subject: string }>;
}) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(sb.url, sb.key);
    await client.from('history').insert({
      username,
      label: entry.label,
      bal700: entry.bal700,
      correct: entry.correct,
      total: entry.total,
      pct: entry.pct,
      date: entry.date,
      topic_breakdown: entry.topicBreakdown || {},
      created_at: new Date().toISOString(),
    });
  } catch { /* ignore */ }
}

// ── Auth functions ────────────────────────────────────────────
export const doLogin = (
  username: string,
  pass: string
): { success: boolean; error?: string; user?: User & { username: string } } => {
  const users = getUsers();
  if (!users[username] || users[username].pass !== pass) {
    return { success: false, error: 'İstifadəçi adı və ya şifrə yanlışdır.' };
  }
  const user = { ...users[username], username };
  saveCurUser(user);
  return { success: true, user };
};

export const doRegister = (
  name: string,
  grade: string,
  username: string,
  pass: string
): { success: boolean; error?: string } => {
  if (!name || !username || !pass) return { success: false, error: 'Bütün xanaları doldurun.' };
  if (!grade) return { success: false, error: 'Sinif seçin.' };
  if (pass.length < 4) return { success: false, error: 'Şifrə ən az 4 simvol olmalıdır.' };
  const users = getUsers();
  if (users[username]) return { success: false, error: 'Bu istifadəçi adı artıq mövcuddur.' };
  const newUser: User = { name, grade, role: 'student', pass, history: [] };
  users[username] = newUser;
  saveUsers(users);
  // Supabase-ə də yaz (async, xəta olsa localStorage-da qalır)
  sbUpsertUser(username, newUser).catch(() => {});
  return { success: true };
};

export const logout = () => { saveCurUser(null); };

// ── History save (localStorage + Supabase) ────────────────────
export const saveHistory = (username: string, entry: {
  label: string; bal700: number; correct: number; total: number; pct: number; date: string;
  topicBreakdown?: Record<string, { correct: number; total: number; subject: string }>;
}) => {
  // localStorage
  const users = getUsers();
  if (!users[username]) return;
  if (!users[username].history) users[username].history = [];
  users[username].history.unshift(entry);
  if (users[username].history.length > 30) users[username].history.length = 30;
  saveUsers(users);
  // Supabase (async)
  sbSaveHistory(username, entry).catch(() => {});
};

// ── Demo accounts ─────────────────────────────────────────────
export const seedDemoAccounts = () => {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  let changed = false;
  if (!users['admin']) {
    users['admin'] = { name: 'Administrator', grade: 'Admin', role: 'admin', pass: 'admin123', history: [] };
    changed = true;
  }
  if (!users['teacher']) {
    users['teacher'] = { name: 'Müəllim Demo', grade: 'Müəllim', role: 'teacher', pass: 'teacher123', history: [] };
    changed = true;
  }
  if (changed) saveUsers(users);
};
