'use client';
// ═══════════════════════════════════════
// store.ts — Zustand global state
// ═══════════════════════════════════════
import { create } from 'zustand';
import { Question, GeneratedQuestion } from './types';

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
  isAdaptive: boolean;
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
  grade: null,
  examType: null,
  subject: null,
  topic: null,
  questions: [],
  current: 0,
  answers: [],
  timerLeft: 0,
  examFinished: false,
  isAdaptive: false,
  genQuestions: [],
  uploadedText: '',
  uploadedFileName: '',
  uploadedIsBase64: false,

  setGrade: (g) => set({ grade: g, examType: null, subject: null, topic: null }),
  setExamType: (t) => set({ examType: t, subject: null, topic: null }),
  setSubject: (s) => set({ subject: s, topic: null }),
  setTopic: (t) => set({ topic: t }),
  launchQuiz: (qs) => set({
    questions: qs,
    current: 0,
    answers: new Array(qs.length).fill(null),
    examFinished: false,
    timerLeft: qs.length * 90,
  }),
  setAnswer: (idx, ans) => set((s) => {
    const answers = [...s.answers];
    answers[idx] = ans;
    return { answers };
  }),
  setCurrent: (i) => set({ current: i }),
  setTimerLeft: (t) => set({ timerLeft: t }),
  finishExam: () => set({ examFinished: true }),
  resetQuiz: () => set({
    grade: null, examType: null, subject: null, topic: null,
    questions: [], current: 0, answers: [], examFinished: false,
    timerLeft: 0, isAdaptive: false,
  }),
  setGenQuestions: (qs) => set({ genQuestions: qs }),
  setUploadedText: (t, name, isBase64) => set({
    uploadedText: t, uploadedFileName: name, uploadedIsBase64: isBase64
  }),
}));

interface AppState {
  screen: 'auth' | 'home' | 'quiz' | 'result' | 'teacher' | 'admin';
  setScreen: (s: AppState['screen']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'auth',
  setScreen: (s) => set({ screen: s }),
}));
