'use client';
import { create } from 'zustand';
import { Question, GeneratedQuestion } from './types';

// ── Quiz State ────────────────────────────────────────────────
interface QuizState {
  grade: string | null;
  examType: 'all_mixed' | 'by_subject' | null;
  subject: string | null;
  topic: string | null;
  questions: Question[];
  current: number;
  answers: (number | null)[];
  timerLeft: number;
  examFinished: boolean;
  genQuestions: GeneratedQuestion[];
  uploadedText: string;
  uploadedFileName: string;
  uploadedIsBase64: boolean;

  setGrade: (g: string) => void;
  setExamType: (t: 'all_mixed' | 'by_subject') => void;
  setSubject: (s: string) => void;
  setTopic: (t: string) => void;
  launchQuiz: (qs: Question[]) => void;
  setAnswer: (idx: number, ans: number) => void;
  setCurrent: (i: number) => void;
  setTimerLeft: (t: number) => void;
  finishExam: () => void;
  resetQuiz: () => void;
  setGenQuestions: (qs: GeneratedQuestion[]) => void;
  setUploadedText: (t: string, name: string, isBase64: boolean) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  grade: null, examType: null, subject: null, topic: null,
  questions: [], current: 0, answers: [], timerLeft: 0,
  examFinished: false, genQuestions: [],
  uploadedText: '', uploadedFileName: '', uploadedIsBase64: false,

  setGrade: (g) => set({ grade: g, examType: null, subject: null, topic: null }),
  setExamType: (t) => set({ examType: t, subject: null, topic: null }),
  setSubject: (s) => set({ subject: s, topic: null }),
  setTopic: (t) => set({ topic: t }),
  launchQuiz: (qs) => set({ questions: qs, current: 0, answers: new Array(qs.length).fill(null), examFinished: false, timerLeft: qs.length * 90 }),
  setAnswer: (idx, ans) => set((s) => { const a = [...s.answers]; a[idx] = ans; return { answers: a }; }),
  setCurrent: (i) => set({ current: i }),
  setTimerLeft: (t) => set({ timerLeft: t }),
  finishExam: () => set({ examFinished: true }),
  resetQuiz: () => set({ grade: null, examType: null, subject: null, topic: null, questions: [], current: 0, answers: [], examFinished: false, timerLeft: 0 }),
  setGenQuestions: (qs) => set({ genQuestions: qs }),
  setUploadedText: (t, name, isBase64) => set({ uploadedText: t, uploadedFileName: name, uploadedIsBase64: isBase64 }),
}));

// ── App State ─────────────────────────────────────────────────
type Screen = 'auth' | 'home' | 'quiz' | 'result' | 'teacher' | 'admin';
type Lang = 'az' | 'ru' | 'en';
type Theme = 'dark' | 'light';

interface AppState {
  screen: Screen;
  lang: Lang;
  theme: Theme;
  setScreen: (s: Screen) => void;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'auth',
  lang: 'az',
  theme: 'dark',
  setScreen: (s) => set({ screen: s }),
  setLang: (l) => set({ lang: l }),
  setTheme: (t) => set({ theme: t }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}));
