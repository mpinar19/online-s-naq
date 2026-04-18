// ═══════════════════════════════════════
// types.ts — Bütün TypeScript tipləri
// ═══════════════════════════════════════

export interface User {
  username?: string;
  name: string;
  grade: string;
  role: 'student' | 'teacher' | 'admin';
  pass: string;
  history: HistoryEntry[];
  streak?: StreakData;
  weekGoal?: number;
}

export interface HistoryEntry {
  label: string;
  bal700: number;
  correct: number;
  total: number;
  pct: number;
  date: string;
  topicBreakdown?: Record<string, TopicStat>;
}

export interface TopicStat {
  correct: number;
  total: number;
  subject: string;
}

export interface StreakData {
  count: number;
  lastDay: string;
  weekExams: number;
  weekKey: string;
  totalDays: number;
}

export interface Question {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  bal?: number;
  _subject?: string;
  _topic?: string;
}

export interface RawQuestion {
  az?: { q: string; opts: string[]; exp: string };
  ru?: { q: string; opts: string[]; exp: string };
  en?: { q: string; opts: string[]; exp: string };
  ans: number;
  bal?: number;
}

export interface SubjectInfo {
  name: string;
  icon: string;
  bg: string;
  color: string;
}

export interface ExamConfig {
  subject: string;
  count: number;
}

export interface GeneratedQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  topic?: string;
  difficulty?: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export type ExamType = 'all_mixed' | 'by_subject';
export type UserRole = 'student' | 'teacher' | 'admin';
export type Screen = 'auth' | 'home' | 'quiz' | 'result' | 'teacher' | 'admin';
