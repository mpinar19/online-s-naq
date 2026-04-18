'use client';
import { useEffect, useState } from 'react';
import { getCurUser, getUsers } from '@/lib/auth';
import { HistoryEntry } from '@/lib/types';
import { X, BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props { onClose: () => void; }

export default function HistoryModal({ onClose }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const cu = getCurUser();
    if (!cu) return;
    const users = getUsers();
    setHistory(users[cu.username]?.history || []);
  }, []);

  const best = history.length ? Math.max(...history.map(h => h.bal700 || 0)) : 0;
  const avg = history.length ? Math.round(history.reduce((s, h) => s + (h.bal700 || 0), 0) / history.length) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#141B2D', border: '1px solid rgba(99,120,255,0.2)', borderRadius: 20, width: '100%', maxWidth: 440, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }} className="animate-fade-up">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,120,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 style={{ width: 16, height: 16, color: '#6378FF' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF', margin: 0 }}>Nəticə tarixi</h3>
              <p style={{ fontSize: 11, color: '#3D4F70', margin: 0, marginTop: 2 }}>{history.length} sınaq</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Summary */}
        {history.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(99,120,255,0.08)' }}>
            <div style={{ background: '#0D1120', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>{best}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Ən yaxşı bal</div>
            </div>
            <div style={{ background: '#0D1120', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#6378FF' }}>{avg}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#3D4F70', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Orta bal</div>
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#7B8DB0' }}>
              <BarChart2 style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.2 }} />
              <p style={{ fontSize: 14, margin: 0 }}>Hələ sınaq götürməmisiniz.</p>
            </div>
          ) : history.map((h, i) => {
            const prev = history[i + 1];
            const trend = prev ? (h.bal700 > prev.bal700 ? 'up' : h.bal700 < prev.bal700 ? 'down' : 'same') : null;
            const sc = (h.pct || 0) >= 70 ? '#10B981' : (h.pct || 0) >= 50 ? '#F59E0B' : '#EF4444';
            return (
              <div key={i} style={{ background: '#0D1120', border: '1px solid rgba(99,120,255,0.08)', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</div>
                    <div style={{ fontSize: 11, color: '#3D4F70', marginTop: 3 }}>{h.correct}/{h.total} doğru · {h.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {trend && (
                      <span style={{ color: trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#3D4F70' }}>
                        {trend === 'up' ? <TrendingUp style={{ width: 14, height: 14 }} /> : trend === 'down' ? <TrendingDown style={{ width: 14, height: 14 }} /> : <Minus style={{ width: 14, height: 14 }} />}
                      </span>
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: sc, lineHeight: 1 }}>{h.bal700}</div>
                      <div style={{ fontSize: 10, color: '#3D4F70' }}>/ 700</div>
                    </div>
                  </div>
                </div>
                <div style={{ height: 4, background: '#141B2D', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: sc, width: `${h.pct}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
