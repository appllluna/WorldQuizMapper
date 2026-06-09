'use client';

import { DailyScoreEntry, DailyLocalResult, DailyPuzzle } from '@/hooks/useDaily';

const RANK_ICONS = ['🥇', '🥈', '🥉'];

const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵', FRA: '🇫🇷', EGY: '🇪🇬', BRA: '🇧🇷',
  USA: '🇺🇸', GBR: '🇬🇧', DEU: '🇩🇪', CHN: '🇨🇳',
  IND: '🇮🇳', KOR: '🇰🇷', ITA: '🇮🇹', AUS: '🇦🇺',
};

interface Props {
  date: string;
  puzzle: DailyPuzzle | null;
  entries: DailyScoreEntry[];
  loading: boolean;
  myNickname: string;
  myResult: DailyLocalResult | null;
  onRefresh: () => void;
  onBackToQuiz: () => void;
  alreadySubmitted: boolean;
}

export default function DailyLeaderboard({
  date, puzzle, entries, loading, myNickname, myResult, onRefresh, onBackToQuiz, alreadySubmitted,
}: Props) {
  const flag = puzzle ? (COUNTRY_FLAGS[puzzle.countryId] ?? '🌍') : '🌍';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">🏆 今日のランキング</h2>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          更新
        </button>
      </div>

      {/* 今日の答え */}
      {puzzle && (
        <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-blue-400 mb-0.5">今日の国</p>
          <p className="text-xl font-extrabold text-blue-700">
            {flag} {puzzle.countryName}
          </p>
        </div>
      )}

      {/* 自分の結果 */}
      {myResult && (
        <div className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${
          myResult.correct
            ? 'bg-green-50 text-green-700'
            : 'bg-gray-50 text-gray-500'
        }`}>
          {myResult.correct
            ? `あなたの記録：${myResult.hintsUsed}個目のヒントで正解 ✅`
            : 'あなたの結果：ギブアップ'}
        </div>
      )}

      {/* ランキング */}
      {loading ? (
        <p className="text-center py-8 text-gray-400 text-sm">読み込み中...</p>
      ) : entries.length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm">まだ正解者がいません。一番乗りを目指そう！</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => {
            const isMe = entry.nickname === myNickname;
            return (
              <div
                key={entry.docId ?? i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <span className="text-lg w-7 text-center flex-shrink-0">
                  {i < 3 ? RANK_ICONS[i] : <span className="text-sm text-gray-400 font-bold">{i + 1}</span>}
                </span>
                <span className={`flex-1 text-sm font-semibold ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                  {entry.nickname}
                  {isMe && <span className="ml-1.5 text-xs font-normal text-blue-400">（あなた）</span>}
                </span>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    ヒント {entry.hintsUsed}
                  </p>
                  <p className="text-xs text-gray-400">
                    {entry.hintsUsed === 1 ? '⚡ 1発正解！' : `${entry.hintsUsed}個目で正解`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!alreadySubmitted && (
        <button
          onClick={onBackToQuiz}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          クイズに挑戦する
        </button>
      )}
    </div>
  );
}
