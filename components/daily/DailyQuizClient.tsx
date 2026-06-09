'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDaily } from '@/hooks/useDaily';
import { checkAnswer } from '@/data/dailyPuzzles';
import DailyLeaderboard from './DailyLeaderboard';

type Phase = 'nickname' | 'game' | 'result' | 'leaderboard';

const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵', FRA: '🇫🇷', EGY: '🇪🇬', BRA: '🇧🇷',
  USA: '🇺🇸', GBR: '🇬🇧', DEU: '🇩🇪', CHN: '🇨🇳',
  IND: '🇮🇳', KOR: '🇰🇷', ITA: '🇮🇹', AUS: '🇦🇺',
};

export default function DailyQuizClient() {
  const {
    today, puzzle, nickname, saveNickname,
    alreadySubmitted, localResult,
    submitScore, leaderboard, leaderboardLoading, fetchLeaderboard,
  } = useDaily();

  const [phase, setPhase]               = useState<Phase>(alreadySubmitted ? 'leaderboard' : 'nickname');
  const [nameInput, setNameInput]       = useState(nickname);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [guessInput, setGuessInput]     = useState('');
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [gameResult, setGameResult]     = useState<{ hintsUsed: number; correct: boolean } | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (alreadySubmitted && phase === 'nickname') {
      setPhase('leaderboard');
      fetchLeaderboard();
    }
  }, [alreadySubmitted, phase, fetchLeaderboard]);

  const startGame = useCallback(() => {
    saveNickname(nameInput.trim() || '名無し');
    setHintsRevealed(0);
    setGuessInput('');
    setWrongFeedback(false);
    setGameResult(null);
    setPhase('game');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [nameInput, saveNickname]);

  const revealHint = useCallback(() => {
    setHintsRevealed((prev) => Math.min(prev + 1, 8));
    setWrongFeedback(false);
  }, []);

  const handleGuess = useCallback(async () => {
    if (!puzzle || !guessInput.trim() || submitting) return;
    if (checkAnswer(guessInput, puzzle.countryId)) {
      const result = { hintsUsed: hintsRevealed, correct: true };
      setGameResult(result);
      setSubmitting(true);
      try {
        await submitScore(hintsRevealed, true);
        await fetchLeaderboard();
      } finally {
        setSubmitting(false);
      }
      setPhase('result');
    } else {
      setWrongFeedback(true);
      setTimeout(() => setWrongFeedback(false), 1500);
    }
  }, [puzzle, guessInput, hintsRevealed, submitting, submitScore, fetchLeaderboard]);

  const handleGiveUp = useCallback(async () => {
    const result = { hintsUsed: hintsRevealed, correct: false };
    setGameResult(result);
    await submitScore(hintsRevealed, false);
    setPhase('result');
  }, [hintsRevealed, submitScore]);

  // ── パズルなし ────────────────────────────────────────────
  if (!puzzle && phase !== 'leaderboard') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🗓️</div>
        <p className="text-gray-500 text-sm">本日のクイズは準備中です</p>
        <button
          onClick={() => { fetchLeaderboard(); setPhase('leaderboard'); }}
          className="mt-4 text-xs text-blue-500 hover:text-blue-700"
        >
          ランキングを見る
        </button>
      </div>
    );
  }

  // ── ニックネーム入力 ──────────────────────────────────────
  if (phase === 'nickname') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">国当てクイズ</h2>
          <p className="text-sm text-gray-500 mb-6">
            {today}　ヒントを開いて国名を当てよう！
          </p>
          <div className="mb-6 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === 'Enter' && startGame()}
              placeholder="あなたの名前（最大20文字）"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
          <button
            onClick={startGame}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            スタート
          </button>
          <button
            onClick={() => { fetchLeaderboard(); setPhase('leaderboard'); }}
            className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            今日のランキングを見る
          </button>
        </div>
      </div>
    );
  }

  // ── ゲーム ────────────────────────────────────────────────
  if (phase === 'game' && puzzle) {
    const allRevealed = hintsRevealed >= 8;
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            className="h-1.5 bg-blue-500 transition-all duration-500"
            style={{ width: `${(hintsRevealed / 8) * 100}%` }}
          />
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">{today}</p>
              <h2 className="text-base font-extrabold text-gray-900">🌍 この国はどこ？</h2>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              ヒント {hintsRevealed} / 8
            </span>
          </div>
        </div>

        {/* ヒント一覧 */}
        <div className="space-y-2">
          {Array.from({ length: hintsRevealed }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3 flex gap-3 items-start"
            >
              <span className="flex-shrink-0 text-xs font-bold text-blue-500 mt-0.5 w-5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{puzzle.hints[i]}</p>
            </div>
          ))}
        </div>

        {/* ヒントを開くボタン */}
        {!allRevealed && (
          <button
            onClick={revealHint}
            className="w-full py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-semibold hover:bg-blue-50 transition-colors text-sm"
          >
            ヒント {hintsRevealed + 1} を開く
          </button>
        )}

        {/* 回答エリア */}
        {hintsRevealed > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
            <p className="text-xs font-medium text-gray-500">国名を入力してください</p>
            <input
              ref={inputRef}
              type="text"
              value={guessInput}
              onChange={(e) => { setGuessInput(e.target.value); setWrongFeedback(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="例：日本、フランス…"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                wrongFeedback
                  ? 'border-red-300 focus:ring-red-300 bg-red-50'
                  : 'border-gray-200 focus:ring-blue-400'
              }`}
            />
            {wrongFeedback && (
              <p className="text-xs text-red-500 font-medium">❌ 不正解です。もう一度！</p>
            )}
            <button
              onClick={handleGuess}
              disabled={!guessInput.trim() || submitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {submitting ? '送信中...' : '回答する'}
            </button>
            {allRevealed && (
              <button
                onClick={handleGiveUp}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
              >
                ギブアップして答えを見る
              </button>
            )}
          </div>
        )}

        {/* ギブアップ（全ヒント前でも選択可） */}
        {hintsRevealed >= 3 && !allRevealed && (
          <button
            onClick={handleGiveUp}
            className="w-full py-2 text-xs text-gray-300 hover:text-gray-500"
          >
            ギブアップ
          </button>
        )}
      </div>
    );
  }

  // ── 結果 ──────────────────────────────────────────────────
  if (phase === 'result' && puzzle) {
    const result = gameResult ?? localResult;
    const correct = result?.correct ?? false;
    const hintsUsed = result?.hintsUsed ?? 0;
    const flag = COUNTRY_FLAGS[puzzle.countryId] ?? '🌍';

    return (
      <div className="max-w-md mx-auto px-4 py-8 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-3">{correct ? '🎉' : '😔'}</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            {correct ? '正解！' : '残念…'}
          </h2>
          {correct ? (
            <p className="text-sm text-blue-600 font-semibold mb-4">
              {hintsUsed}個目のヒントで正解！
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">また明日チャレンジしよう！</p>
          )}

          <div className="bg-gray-50 rounded-xl py-4 px-6 mb-6">
            <p className="text-xs text-gray-400 mb-1">今日の答え</p>
            <p className="text-2xl font-extrabold text-gray-800">
              {flag} {puzzle.countryName}
            </p>
          </div>

          <button
            onClick={() => { fetchLeaderboard(); setPhase('leaderboard'); }}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            ランキングを見る
          </button>
        </div>

        {/* 全ヒント表示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            全ヒント
          </h3>
          <ol className="space-y-2">
            {puzzle.hints.map((hint, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="flex-shrink-0 font-bold text-blue-400 w-4">{i + 1}</span>
                <span className={i < hintsUsed ? 'text-gray-800' : 'text-gray-400'}>{hint}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // ── ランキング ────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <DailyLeaderboard
        date={today}
        puzzle={puzzle}
        entries={leaderboard}
        loading={leaderboardLoading}
        myNickname={nickname}
        myResult={localResult}
        onRefresh={fetchLeaderboard}
        onBackToQuiz={() => !alreadySubmitted && setPhase('nickname')}
        alreadySubmitted={alreadySubmitted}
      />
    </div>
  );
}
