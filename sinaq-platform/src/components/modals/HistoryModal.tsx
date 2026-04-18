'use client';
import { useEffect, useState } from 'react';
import { getCurUser, getUsers } from '@/lib/auth';
import { HistoryEntry } from '@/lib/types';
import { X, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props { onClose: () => void; }

export default function HistoryModal({ onClose }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const cu = getCurUser();
    if (!cu) return;
    const users = getUsers();
    setHistory(users[cu.username]?.history || []);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#141B2D] border border-[rgba(99,120,255,0.2)] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-[rgba(99,120,255,0.1)]">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-[#6378FF]" />
            <h3 className="text-sm font-bold text-[#E8EEFF]">Nəticə tarixi</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
            <p className="text-center text-sm text-[#7B8DB0] py-8">Hələ sınaq götürməmisiniz.</p>
          ) : (
            history.map((h, i) => (
              <div key={i} className="bg-[#0D1120] border border-[rgba(99,120,255,0.1)] rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#E8EEFF] mb-1">{h.label}</div>
                    <div className="text-xs text-[#7B8DB0]">{h.correct}/{h.total} doğru · {h.pct}% · {h.date}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={cn(
                      'text-lg font-black',
                      h.pct >= 70 ? 'text-[#10B981]' : h.pct >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                    )}>
                      {h.bal700}
                    </div>
                    <div className="text-[10px] text-[#3D4F70]">/ 700</div>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-[#141B2D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${h.pct}%`,
                      background: h.pct >= 70 ? '#10B981' : h.pct >= 50 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
