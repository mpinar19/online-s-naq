'use client';
import { useState, useEffect } from 'react';
import { getUsers, getCurUser } from '@/lib/auth';
import { User } from '@/lib/types';
import { X, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props { onClose: () => void; }

export default function LeaderboardModal({ onClose }: Props) {
  const [tab, setTab] = useState<'all' | 'grade' | 'week'>('all');
  const [entries, setEntries] = useState<{ uname: string; name: string; grade: string; best: number; count: number }[]>([]);
  const cu = getCurUser();

  useEffect(() => {
    const users = getUsers();
    const now = Date.now();
    const weekMs = 7 * 24 * 3600 * 1000;

    const list = Object.entries(users)
      .filter(([, u]) => u.role !== 'teacher' && u.history?.length)
      .map(([uname, u]: [string, User]) => {
        let hist = [...(u.history || [])];
        if (tab === 'grade' && cu) hist = hist.filter(() => u.grade === cu.grade);
        if (tab === 'week') {
          hist = hist.filter((h) => {
            try {
              const p = h.date.split('.');
              return (now - new Date(+p[2], +p[1] - 1, +p[0]).getTime()) < weekMs;
            } catch { return false; }
          });
        }
        if (!hist.length) return null;
        const best = Math.max(...hist.map((h) => h.bal700 || 0));
        return { uname, name: u.name, grade: u.grade, best, count: hist.length };
      })
      .filter(Boolean)
      .sort((a, b) => b!.best - a!.best)
      .slice(0, 20) as { uname: string; name: string; grade: string; best: number; count: number }[];

    setEntries(list);
  }, [tab]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-[rgba(99,120,255,0.1)]">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-sm font-bold text-[#E8EEFF]">Liderboard</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 p-3 bg-[#0D1120] mx-4 mt-4 rounded-xl">
          {(['all', 'grade', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all',
                tab === t ? 'bg-gradient-to-r from-[#6378FF] to-[#A855F7] text-white' : 'text-[#7B8DB0] hover:text-[#E8EEFF]'
              )}
            >
              {t === 'all' ? 'Ümumi' : t === 'grade' ? 'Sinifdən' : 'Bu həftə'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {entries.length === 0 ? (
            <p className="text-center text-sm text-[#7B8DB0] py-8">Hələ nəticə yoxdur.</p>
          ) : (
            entries.map((e, i) => {
              const isMe = cu && e.uname === cu.username;
              return (
                <div
                  key={e.uname}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    isMe
                      ? 'border-[rgba(99,120,255,0.4)] bg-[rgba(99,120,255,0.08)]'
                      : 'border-[rgba(99,120,255,0.1)] bg-[#0D1120]'
                  )}
                >
                  <div className="w-8 text-center text-lg">{medals[i] || <span className="text-xs font-bold text-[#3D4F70]">{i + 1}</span>}</div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6378FF] to-[#A855F7] flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
                    {e.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#E8EEFF]">
                      {e.name}
                      {isMe && <span className="text-xs text-[#6378FF] ml-1">(siz)</span>}
                    </div>
                    <div className="text-xs text-[#7B8DB0]">{e.grade}-ci sinif · {e.count} sınaq</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold gradient-text">{e.best}</div>
                    <div className="text-[10px] text-[#3D4F70]">ən yaxşı bal</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
