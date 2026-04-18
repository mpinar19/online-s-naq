// qbank.ts - Sual banki wrapper
import { Question, RawQuestion, SubjectInfo, ExamConfig } from './types';
import { getQ, shuffle } from './utils';

export const ALL_GRADES = ['1','2','3','4','5','6','7','8','9','10','11'];

export const EXAM_CONFIG: Record<string, ExamConfig[]> = {
  '1_all':  [{ subject:'Azerbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Heyat bilgisi', count:5 }],
  '2_all':  [{ subject:'Azerbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Heyat bilgisi', count:5 }],
  '3_all':  [{ subject:'Azerbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Heyat bilgisi', count:5 }],
  '4_all':  [{ subject:'Azerbaycan dili', count:18 },{ subject:'Riyaziyyat', count:14 },{ subject:'Heyat bilgisi', count:8 },{ subject:'Ingilis dili', count:5 }],
  '5_all':  [{ subject:'Azerbaycan dili', count:12 },{ subject:'Riyaziyyat', count:12 },{ subject:'Tarix', count:7 },{ subject:'Cografiya', count:7 },{ subject:'Ingilis dili', count:7 },{ subject:'Biologiya', count:5 }],
  '6_all':  [{ subject:'Azerbaycan dili', count:12 },{ subject:'Riyaziyyat', count:12 },{ subject:'Tarix', count:7 },{ subject:'Cografiya', count:7 },{ subject:'Ingilis dili', count:7 },{ subject:'Biologiya', count:5 }],
  '7_all':  [{ subject:'Azerbaycan dili', count:10 },{ subject:'Riyaziyyat', count:12 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:5 },{ subject:'Tarix', count:7 },{ subject:'Cografiya', count:5 },{ subject:'Ingilis dili', count:3 }],
  '8_all':  [{ subject:'Azerbaycan dili', count:10 },{ subject:'Riyaziyyat', count:12 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Tarix', count:6 },{ subject:'Cografiya', count:4 },{ subject:'Ingilis dili', count:3 }],
  '9_all':  [{ subject:'Azerbaycan dili', count:10 },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:6 },{ subject:'Biologiya', count:6 },{ subject:'Tarix', count:6 }],
  '10_all': [{ subject:'Azerbaycan dili', count:8  },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Biologiya', count:7 },{ subject:'Tarix', count:6 }],
  '11_all': [{ subject:'Azerbaycan dili', count:8  },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Biologiya', count:7 },{ subject:'Tarix', count:6 }],
};

export const SUBJECTS_BY_GRADE: Record<string, SubjectInfo[]> = {
  '1':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Heyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '2':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'��', bg:'#EDE7F6', color:'#4527A0' },{ name:'Heyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '3':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Heyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '4':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Heyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' }],
  '5':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'��', bg:'#E8F5E9', color:'#2E7D32' }],
  '6':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '7':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '8':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '9':  [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Edebiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
  '10': [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Edebiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
  '11': [{ name:'Azerbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Cografiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'Ingilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Edebiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
};

type QBankType = Record<string, Record<string, Record<string, RawQuestion[]>>>;
let _qbank: QBankType | null = null;

export function getQBankSync(): QBankType {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { QBANK_BY_GRADE?: QBankType };
    if (w.QBANK_BY_GRADE) return w.QBANK_BY_GRADE;
  }
  return {};
}

export async function getQBank(): Promise<QBankType> {
  if (_qbank) return _qbank;
  if (typeof window !== 'undefined') {
    const w = window as unknown as { QBANK_BY_GRADE?: QBankType };
    if (w.QBANK_BY_GRADE) { _qbank = w.QBANK_BY_GRADE; return _qbank; }
  }
  return {};
}

export function buildQuestions(
  qbank: QBankType,
  grade: string,
  examType: 'all_mixed' | 'by_subject',
  subject?: string | null,
  topic?: string | null
): Question[] {
  const gradeBank = qbank[grade] || {};
  if (examType === 'all_mixed') {
    const cfg = EXAM_CONFIG[grade + '_all'] || [];
    const result: Question[] = [];
    cfg.forEach(({ subject: subj, count }) => {
      const subjectBank = gradeBank[subj] || {};
      const all: Question[] = [];
      Object.entries(subjectBank).forEach(([t, qs]) =>
        qs.forEach(q => all.push({ ...getQ(q), _subject: subj, _topic: t }))
      );
      const sh = shuffle([...all]);
      const take = Math.min(count, sh.length);
      for (let i = 0; i < take; i++) result.push({ ...sh[i] });
    });
    return result;
  }
  if (!subject) return [];
  const subjectBank = gradeBank[subject] || {};
  const pool: Question[] = [];
  if (!topic || topic === 'all') {
    Object.entries(subjectBank).forEach(([t, qs]) =>
      qs.forEach(q => pool.push({ ...getQ(q), _subject: subject, _topic: t }))
    );
  } else {
    (subjectBank[topic] || []).forEach(q =>
      pool.push({ ...getQ(q), _subject: subject, _topic: topic })
    );
  }
  return shuffle([...pool]);
}