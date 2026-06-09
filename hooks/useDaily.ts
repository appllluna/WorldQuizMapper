'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  collection, addDoc, getDocs, query, where, limit, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DailyScore } from '@/types';
import { getPuzzleForDate, DailyPuzzle } from '@/data/dailyPuzzles';

export type { DailyPuzzle };

export interface DailyScoreEntry extends DailyScore {
  docId?: string;
}

export interface DailyLocalResult {
  hintsUsed: number;
  correct: boolean;
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const submittedKey = (date: string) => `wqm_daily_submitted_${date}`;
const resultKey    = (date: string) => `wqm_daily_result_${date}`;
const nicknameKey  = 'wqm_daily_nickname';

export function useDaily() {
  const today = getTodayString();
  const puzzle = getPuzzleForDate(today);

  const [nickname, setNickname]               = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [localResult, setLocalResult]         = useState<DailyLocalResult | null>(null);
  const [leaderboard, setLeaderboard]         = useState<DailyScoreEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem(nicknameKey);
    if (savedName) setNickname(savedName);
    setAlreadySubmitted(!!localStorage.getItem(submittedKey(today)));
    const savedResult = localStorage.getItem(resultKey(today));
    if (savedResult) {
      try { setLocalResult(JSON.parse(savedResult)); } catch { /* ignore */ }
    }
  }, [today]);

  const saveNickname = useCallback((name: string) => {
    setNickname(name);
    localStorage.setItem(nicknameKey, name);
  }, []);

  const submitScore = useCallback(
    async (hintsUsed: number, correct: boolean): Promise<void> => {
      // 正解のみ Firestore に送信
      if (correct) {
        const entry: DailyScore = {
          date: today,
          nickname: nickname.trim() || '名無し',
          hintsUsed,
          correct,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, 'daily_scores'), entry);
      }
      const result: DailyLocalResult = { hintsUsed, correct };
      localStorage.setItem(resultKey(today), JSON.stringify(result));
      localStorage.setItem(submittedKey(today), '1');
      setLocalResult(result);
      setAlreadySubmitted(true);
    },
    [today, nickname],
  );

  const fetchLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    try {
      const q = query(
        collection(db, 'daily_scores'),
        where('date', '==', today),
        limit(100),
      );
      const snap = await getDocs(q);
      const entries = snap.docs.map((d) => ({
        docId: d.id,
        ...(d.data() as DailyScore),
      }));
      // クライアント側でソート・フィルタ（composite index 不要）
      const ranked = entries
        .filter((e) => e.correct)
        .sort((a, b) => a.hintsUsed - b.hintsUsed)
        .slice(0, 20);
      setLeaderboard(ranked);
    } catch (e) {
      console.error('Leaderboard fetch error:', e);
    } finally {
      setLeaderboardLoading(false);
    }
  }, [today]);

  return {
    today,
    puzzle,
    nickname,
    saveNickname,
    alreadySubmitted,
    localResult,
    submitScore,
    leaderboard,
    leaderboardLoading,
    fetchLeaderboard,
  };
}
