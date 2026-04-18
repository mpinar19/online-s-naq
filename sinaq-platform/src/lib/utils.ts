import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Question, RawQuestion } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const getQ = (raw: RawQuestion): Question => {
  const lang = raw.az || raw.en || raw.ru;
  if (!lang) return { q: '', opts: [], ans: raw.ans, exp: '', bal: raw.bal };
  return { q: lang.q, opts: lang.opts, ans: raw.ans, exp: lang.exp, bal: raw.bal };
};

export const fmtTimer = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const getTodayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const getWeekKey = (): string => {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

export const GCOL: Record<string, { bg: string; txt: string }> = {
  '1': { bg: '#E8F4FD', txt: '#1565C0' }, '2': { bg: '#FFF3E0', txt: '#E65100' },
  '3': { bg: '#F3E5F5', txt: '#6A1B9A' }, '4': { bg: '#E8F5E9', txt: '#2E7D32' },
  '5': { bg: '#FBE9E7', txt: '#BF360C' }, '6': { bg: '#E0F2F1', txt: '#004D40' },
  '7': { bg: '#FCE4EC', txt: '#880E4F' }, '8': { bg: '#F9FBE7', txt: '#558B2F' },
  '9': { bg: '#EDE7F6', txt: '#4527A0' }, '10': { bg: '#E3F2FD', txt: '#0D47A1' },
  '11': { bg: '#FFF8E1', txt: '#F57F17' },
};
