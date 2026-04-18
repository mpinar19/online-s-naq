'use client';
import { useState, useEffect } from 'react';
import { getUsers, getCurUser } from '@/lib/auth';
import { User } from '@/lib/types';
import { X, Trophy } from 'lucide-react';

interface Props { onClose: () => void; }

interface Entry { uname: string; name: string; grade: string; best: number; count: number; }

export default function LeaderboardModal({ onClose }: Props) {
  const [tab, setTab] = useState<'all' | 'grade' | 'week'>('all');
  const [entries, setEntries] = useState<Entry[]>([]);
  const cu = getCurUser();

  useEffect(() => {
    const users = getUsers();
    const now = Date.now();
    const weekMs = 7 * 24 * 3600 * 1000;

    // Unikal username-lərlə işlə
    const seen = new Set<string>();
    const list: Entry[] = [];

    Object.entries(users).forEach(([uname, u]: [string, User]) => {
      if (seen.has(uname)) return;
      seen.add(uname);
      if (u.role === 'teacher' || u.role === 'admin') return;
      let hist = [...(u.history || [])];
      if (!hist.length) return;

      if (tab === 'grade' && cu) hist = hist.filter(() => u.grade === cu.grade);
      if (tab === 'week') {
        hist = hist.filter(h => {
          try {
            const p = h.date.split('.');
            return (now - new Date(+p[2], +p[1] - 1, +p[0]).getTime()) < weekMs;
          } catch { return false; }
        });
      }
      if (!hist.length) return;
      const best = Math.max(...hist.map(h => h.bal700 || 0));
      list.push({ uname, name: u.name, grade: u.grade, best, count: hist.length });
    });

    list.sort((a, b) => b.best - a.best);
    setEntries(list.slice(0, 20));
  }, [tab]);

  const medals = ['🥇', '🥈', '🥉'];
  const medalColors = ['#F59E0B', '#94A3B8', '#CD7F32'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, width: '100%', maxWidth: 440, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }} className="animate-fade-up">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy style={{ width: 16, height: 16, color: '#F59E0B' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF', margin: 0 }}>Liderboard</h3>
              <p style={{ fontSize: 11, color: '#3D4F70', margin: 0, marginTop: 2 }}>Ən yaxşı nəticələr</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '12px 16px 0' }}>
          <div className="tab-bar">
            {(['all', 'grade', 'week'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`tab-item${tab === t ? ' active' : ''}`}>
                {t === 'all' ? 'Ümumi' : t === 'grade' ? 'Sinifdən' : 'Bu həftə'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#7B8DB0' }}>
              <Trophy style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
              <p style={{ fontSize: 14, margin: 0 }}>Hələ nəticə yoxdur.</p>
            </div>
          ) : entries.map((e, i) => {
            const isMe = cu && e.uname === cu.username;
            const isTop3 = i < 3;
            return (
              <div key={e.uname} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14,
                border: isMe ? '1px solid rgba(99,120,255,0.4)' : isTop3 ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(99,120,255,0.08)',
                background: isMe ? 'rgba(99,120,255,0.08)' : isTop3 ? 'rgba(245,158,11,0.04)' : '#0D1120',
              }}>
                <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                  {isTop3
                    ? <span style={{ fontSize: 20 }}>{medals[i]}</span>
                    : <span style={{ fontSize: 12, fontWeight: 700, color: '#3D4F70', fontFamily: 'monospace' }}>{i + 1}</span>}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6378FF,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {e.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {e.name}
                    {isMe && <span style={{ fontSize: 10, color: '#6378FF', fontWeight: 700, background: 'rgba(99,120,255,0.15)', padding: '1px 6px', borderRadius: 10 }}>siz</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#3D4F70', marginTop: 2 }}>{e.grade}-ci sinif · {e.count} sınaq</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: isTop3 ? medalColors[i] : '#6378FF' }}>{e.best}</div>
                  <div style={{ fontSize: 10, color: '#3D4F70' }}>/ 700</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
