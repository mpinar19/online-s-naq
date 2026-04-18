import { User } from './types';

export const getUsers = (): Record<string, User> => {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('az_users') || '{}');
};

export const saveUsers = (u: Record<string, User>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('az_users', JSON.stringify(u));
};

export const getCurUser = (): (User & { username: string }) | null => {
  if (typeof window === 'undefined') return null;
  return JSON.parse(sessionStorage.getItem('az_cur') || 'null');
};

export const saveCurUser = (u: (User & { username: string }) | null) => {
  if (typeof window === 'undefined') return;
  if (u) sessionStorage.setItem('az_cur', JSON.stringify(u));
  else sessionStorage.removeItem('az_cur');
};

export const doLogin = (
  username: string,
  pass: string
): { success: boolean; error?: string; user?: User & { username: string } } => {
  const users = getUsers();
  if (!users[username] || users[username].pass !== pass) {
    return { success: false, error: 'Istifadeci adi ve ya sifre yanlisdir.' };
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
  if (!name || !username || !pass) return { success: false, error: 'Butun xanalari doldurun.' };
  if (!grade) return { success: false, error: 'Sinif secin.' };
  if (pass.length < 4) return { success: false, error: 'Sifre en az 4 simvol olmalidir.' };
  const users = getUsers();
  if (users[username]) return { success: false, error: 'Bu istifadeci adi artiq movcuddur.' };
  users[username] = { name, grade, role: 'student', pass, history: [] };
  saveUsers(users);
  return { success: true };
};

export const logout = () => { saveCurUser(null); };

export const seedDemoAccounts = () => {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  let changed = false;
  if (!users['admin']) {
    users['admin'] = { name: 'Administrator', grade: 'Admin', role: 'admin', pass: 'admin123', history: [] };
    changed = true;
  }
  if (!users['teacher']) {
    users['teacher'] = { name: 'Muellim Demo', grade: 'Muellim', role: 'teacher', pass: 'teacher123', history: [] };
    changed = true;
  }
  if (changed) saveUsers(users);
};