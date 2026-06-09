'use client';

interface ProgressStatsProps {
  cleared: number;
  inProgress: number;
  total: number;
  accuracy: number;
}

export default function ProgressStats({ cleared, inProgress, total, accuracy }: ProgressStatsProps) {
  const pct = Math.round((cleared / total) * 100 * 10) / 10;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        世界征服の進捗
      </h2>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-4xl font-extrabold text-gray-900">{pct}</span>
        <span className="text-lg font-bold text-gray-400 mb-1">%</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">世界の{pct}%を制覇</p>

      {/* プログレスバー */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-green-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center mb-3">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-green-600">{cleared}</p>
          <p className="text-xs text-gray-500 mt-0.5">攻略済み</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-blue-500">{inProgress}</p>
          <p className="text-xs text-gray-500 mt-0.5">挑戦中</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-gray-400">{total - cleared - inProgress}</p>
          <p className="text-xs text-gray-500 mt-0.5">未挑戦</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-purple-500">{accuracy}<span className="text-base">%</span></p>
          <p className="text-xs text-gray-500 mt-0.5">正解率</p>
        </div>
      </div>
    </div>
  );
}
