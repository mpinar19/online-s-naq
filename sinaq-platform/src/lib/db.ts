// ═══════════════════════════════════════
// db.ts — Supabase database client
// localStorage ilə hybrid: Supabase varsa bulud, yoxdursa lokal
// ═══════════════════════════════════════
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, HistoryEntry } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('your_')) return null;
  if (!_client) _client = createClient(SUPABASE_URL, SUPABASE_KEY);
  return _client;
}

export const isSupabaseReady = () => !!getSupabase();

// ── Users ──────────────────────────────
export async function dbGetUsers(): Promise<Record<string, User>> {
  const sb = getSupabase();
  if (!sb) {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem('az_users') || '{}');
  }
  try {
    const { data } = await sb.from('users').select('*');
    if (!data) return {};
    const map: Record<string, User> = {};
    data.forEach((row: { username: string } & User) => { map[row.username] = row; });
    return map;
  } catch { return {}; }
}

export async function dbSaveUser(username: string, user: User): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    if (typeof window === 'undefined') return;
    const users = JSON.parse(localStorage.getItem('az_users') || '{}');
    users[username] = user;
    localStorage.setItem('az_users', JSON.stringify(users));
    return;
  }
  try {
    await sb.from('users').upsert({ username, ...user }, { onConflict: 'username' });
  } catch { /**/ }
}

export async function dbSaveHistory(username: string, entry: HistoryEntry): Promise<void> {
  const sb = getSupabase();
  if (!sb) return; // localStorage-da auth.ts idarə edir

  try {
    await sb.from('history').insert({
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
  } catch { /**/ }
}

export async function dbGetHistory(username: string): Promise<HistoryEntry[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb.from('history')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(30);
    if (!data) return [];
    return data.map((row: {
      label: string; bal700: number; correct: number;
      total: number; pct: number; date: string; topic_breakdown?: Record<string, { correct: number; total: number; subject: string }>;
    }) => ({
      label: row.label, bal700: row.bal700, correct: row.correct,
      total: row.total, pct: row.pct, date: row.date,
      topicBreakdown: row.topic_breakdown,
    }));
  } catch { return []; }
}

// ── Leaderboard ────────────────────────
export async function dbGetLeaderboard(filter?: { grade?: string; weekOnly?: boolean }): Promise<{
  username: string; name: string; grade: string; best: number; count: number;
}[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    let query = sb.from('leaderboard_view').select('*').order('best', { ascending: false }).limit(20);
    if (filter?.grade) query = query.eq('grade', filter.grade);
    const { data } = await query;
    return data || [];
  } catch { return []; }
}

// ── SQL schema (Supabase SQL Editor-də işlət) ──
export const SUPABASE_SCHEMA = `
-- Users cədvəli
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  pass TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- History cədvəli
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  label TEXT,
  bal700 INTEGER,
  correct INTEGER,
  total INTEGER,
  pct INTEGER,
  date TEXT,
  topic_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  u.username,
  u.name,
  u.grade,
  MAX(h.bal700) as best,
  COUNT(h.id) as count
FROM users u
JOIN history h ON u.username = h.username
WHERE u.role = 'student'
GROUP BY u.username, u.name, u.grade
ORDER BY best DESC;

-- RLS (Row Level Security) — hər kəs oxuya bilər
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON users FOR UPDATE USING (true);
CREATE POLICY "Public read history" ON history FOR SELECT USING (true);
CREATE POLICY "Public insert history" ON history FOR INSERT WITH CHECK (true);
`;
