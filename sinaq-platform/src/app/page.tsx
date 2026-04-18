'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getCurUser, seedDemoAccounts } from '@/lib/auth';
import AuthScreen from '@/components/auth/AuthScreen';
import HomeScreen from '@/components/home/HomeScreen';
import QuizScreen from '@/components/quiz/QuizScreen';
import ResultScreen from '@/components/result/ResultScreen';
import TeacherScreen from '@/components/teacher/TeacherScreen';
import AdminScreen from '@/components/admin/AdminScreen';

export default function Page() {
  const { screen, setScreen } = useAppStore();

  useEffect(() => {
    seedDemoAccounts();
    const cu = getCurUser();
    if (cu) {
      if (cu.role === 'admin') setScreen('admin');
      else if (cu.role === 'teacher') setScreen('teacher');
      else setScreen('home');
    }
  }, []);

  return (
    <main>
      {screen === 'auth'    && <AuthScreen />}
      {screen === 'home'    && <HomeScreen />}
      {screen === 'quiz'    && <QuizScreen />}
      {screen === 'result'  && <ResultScreen />}
      {screen === 'teacher' && <TeacherScreen />}
      {screen === 'admin'   && <AdminScreen />}
    </main>
  );
}