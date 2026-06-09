'use client';

import { Badge } from '@/types';

interface BadgeListProps {
  badges: Badge[];
}

export default function BadgeList({ badges }: BadgeListProps) {
  const BADGE_ICONS: Record<string, string> = {
    // 進捗
    first_step:     '⭐',
    five_countries: '✈️',
    world_10:       '🌏',
    world_25:       '🌍',
    // グループ
    eu_conqueror:   '🇪🇺',
    g7_challenger:  '🎖️',
    brics_explorer: '🌐',
    // 地域
    asia_master:    '🏯',
    europe_master:  '🏰',
    // 実績
    perfect_score:  '💯',
    perfect_3times: '🏆',
    accuracy_star:  '🎯',
    quiz_veteran:   '🎖️',
    // 地域（追加）
    africa_master:   '🌍',
    americas_master: '🌎',
    oceania_master:  '🦘',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        バッジコレクション
      </h2>
      <div className="space-y-2.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              badge.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <span className={`text-2xl ${badge.unlocked ? '' : 'grayscale opacity-40'}`}>
              {BADGE_ICONS[badge.id] ?? '🎖️'}
            </span>
            <div>
              <p
                className={`text-sm font-semibold ${
                  badge.unlocked ? 'text-yellow-700' : 'text-gray-400'
                }`}
              >
                {badge.name}
              </p>
              <p className="text-xs text-gray-400">{badge.description}</p>
            </div>
            {badge.unlocked && (
              <span className="ml-auto text-xs font-bold text-yellow-500">獲得！</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
