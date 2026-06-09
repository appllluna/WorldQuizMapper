'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, CountryProgress, ClearStatus, Badge } from '@/types';
import { quizDataMap } from '@/data/quizData';
import { countries } from '@/data/countries';

const STORAGE_KEY = 'wqm_progress';
const PERFECT_THRESHOLD = 5; // QUESTIONS_PER_SESSION と合わせる

// ── バッジ定義 ────────────────────────────────────────────────
const BADGE_DEFINITIONS: Omit<Badge, 'unlocked'>[] = [
  // 進捗バッジ
  { id: 'first_step',     name: '最初の一歩',       description: '初めての国をクリアする' },
  { id: 'five_countries', name: '世界の旅人',       description: '5カ国をクリアする' },
  { id: 'world_10',       name: '世界の10%',        description: '20カ国をクリアする（全195国中）' },
  { id: 'world_25',       name: '世界の4分の1',      description: '50カ国をクリアする' },
  // グループバッジ（quizDataに存在する加盟国が対象）
  { id: 'eu_conqueror',   name: 'EU制覇',           description: 'クイズ対応EU加盟国をすべてクリアする（仏・独）' },
  { id: 'g7_challenger',  name: 'G7チャレンジャー', description: 'クイズ対応G7加盟国をすべてクリアする（日・米・英・仏・独）' },
  { id: 'brics_explorer', name: 'BRICS探索者',      description: 'クイズ対応BRICS加盟国をすべてクリアする（ブラジル・中国）' },
  // 地域バッジ
  { id: 'asia_master',    name: 'アジアの覇者',     description: 'クイズ対応アジアの全国をクリアする' },
  { id: 'europe_master',  name: 'ヨーロッパ制覇',   description: 'クイズ対応ヨーロッパの全国をクリアする' },
  // 実績バッジ
  { id: 'perfect_score',  name: '完璧主義者',       description: 'クイズセッションで5問全問正解する' },
  { id: 'perfect_3times', name: '三冠達成',         description: '全問正解を3回達成する' },
  { id: 'accuracy_star',  name: '精確無比',         description: '正解率80%以上を維持する（10セッション以上）' },
  { id: 'quiz_veteran',   name: 'クイズベテラン',   description: '累計30セッション完了する' },
  // 地域バッジ（追加）
  { id: 'africa_master',   name: 'アフリカ探検家',  description: 'クイズ対応アフリカの全国をクリアする' },
  { id: 'americas_master', name: 'アメリカ大陸制覇', description: 'クイズ対応北米・南米の全国をクリアする' },
  { id: 'oceania_master',  name: 'オセアニア制覇',  description: 'クイズ対応オセアニアの全国をクリアする' },
];

// 各グループの全メンバー（クイズ未対応国を含む完全リスト）
// quizDataMap に存在する分だけバッジ判定に使う
const G7_ALL    = ['JPN', 'USA', 'GBR', 'FRA', 'DEU', 'ITA', 'CAN'];
const EU_ALL    = ['FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'SWE', 'POL', 'AUT', 'PRT'];
const BRICS_ALL = ['BRA', 'RUS', 'IND', 'CHN', 'ZAF'];
const AMERICAS_REGIONS = ['北米', '南米'];

function getQuizIds(fullList: string[]): string[] {
  return fullList.filter((id) => !!quizDataMap[id]);
}

function getRegionQuizIds(region: string | string[]): string[] {
  const regions = Array.isArray(region) ? region : [region];
  return countries
    .filter((c) => regions.includes(c.region) && !!quizDataMap[c.id])
    .map((c) => c.id);
}

function allCleared(ids: string[], prog: Record<string, CountryProgress>): boolean {
  return ids.length > 0 && ids.every((id) => prog[id]?.status === 'cleared');
}

function checkBadges(
  prog: Record<string, CountryProgress>,
  badges: Badge[],
  perfectSessions: number,
  totalSessions: number,
): Badge[] {
  const cleared = Object.values(prog).filter((c) => c.status === 'cleared').length;
  const totalAttempts = Object.values(prog).reduce((s, c) => s + c.totalAttempts, 0);
  const totalCorrect  = Object.values(prog).reduce((s, c) => s + c.correctAnswers, 0);
  const accuracy = totalAttempts >= 50 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const g7Ids       = getQuizIds(G7_ALL);
  const euIds       = getQuizIds(EU_ALL);
  const bricsIds    = getQuizIds(BRICS_ALL);
  const asiaIds     = getRegionQuizIds('アジア');
  const euRopeIds   = getRegionQuizIds('ヨーロッパ');
  const africaIds   = getRegionQuizIds('アフリカ');
  const americasIds = getRegionQuizIds(AMERICAS_REGIONS);
  const oceaniaIds  = getRegionQuizIds('オセアニア');

  return badges.map((b) => {
    if (b.unlocked) return b;
    switch (b.id) {
      case 'first_step':      return cleared >= 1       ? { ...b, unlocked: true } : b;
      case 'five_countries':  return cleared >= 5       ? { ...b, unlocked: true } : b;
      case 'world_10':        return cleared >= 20      ? { ...b, unlocked: true } : b;
      case 'world_25':        return cleared >= 50      ? { ...b, unlocked: true } : b;
      case 'eu_conqueror':    return allCleared(euIds, prog)       ? { ...b, unlocked: true } : b;
      case 'g7_challenger':   return allCleared(g7Ids, prog)       ? { ...b, unlocked: true } : b;
      case 'brics_explorer':  return allCleared(bricsIds, prog)    ? { ...b, unlocked: true } : b;
      case 'asia_master':     return allCleared(asiaIds, prog)     ? { ...b, unlocked: true } : b;
      case 'europe_master':   return allCleared(euRopeIds, prog)   ? { ...b, unlocked: true } : b;
      case 'africa_master':   return allCleared(africaIds, prog)   ? { ...b, unlocked: true } : b;
      case 'americas_master': return allCleared(americasIds, prog) ? { ...b, unlocked: true } : b;
      case 'oceania_master':  return allCleared(oceaniaIds, prog)  ? { ...b, unlocked: true } : b;
      case 'perfect_score':   return perfectSessions >= 1  ? { ...b, unlocked: true } : b;
      case 'perfect_3times':  return perfectSessions >= 3  ? { ...b, unlocked: true } : b;
      case 'accuracy_star':   return accuracy >= 80        ? { ...b, unlocked: true } : b;
      case 'quiz_veteran':    return totalSessions >= 30   ? { ...b, unlocked: true } : b;
      default: return b;
    }
  });
}

// ── デフォルト進捗 ──────────────────────────────────────────
const defaultProgress = (): UserProgress => ({
  countries: {},
  badges: BADGE_DEFINITIONS.map((b) => ({ ...b, unlocked: false })),
  lastUpdated: new Date().toISOString(),
  perfectSessions: 0,
  totalSessions: 0,
});

// ── フック本体 ──────────────────────────────────────────────
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({
          ...defaultProgress(),
          ...parsed,
          perfectSessions: parsed.perfectSessions ?? 0,
          totalSessions: parsed.totalSessions ?? 0,
        });
      } catch { /* invalid JSON */ }
    }
  }, []);

  const recordResult = useCallback(
    (countryId: string, correctCount: number): void => {
      setProgress((prev) => {
        const current: CountryProgress = prev.countries[countryId] ?? {
          countryId,
          totalAttempts: 0,
          correctAnswers: 0,
          status: 'unplayed',
        };

        const newCorrect = current.correctAnswers + correctCount;
        // 1回のセッションで3問以上正解した場合のみ攻略済みに（累積ではない）
        const status: ClearStatus =
          correctCount >= 3
            ? 'cleared'
            : current.status === 'cleared'
              ? 'cleared'     // 既に攻略済みなら維持
              : 'in_progress';
        const isPerfect = correctCount >= PERFECT_THRESHOLD;

        const updatedCountries = {
          ...prev.countries,
          [countryId]: {
            ...current,
            totalAttempts: current.totalAttempts + 5,
            correctAnswers: newCorrect,
            status,
          },
        };

        const newPerfectSessions = prev.perfectSessions + (isPerfect ? 1 : 0);
        const newTotalSessions   = (prev.totalSessions ?? 0) + 1;

        const updated: UserProgress = {
          countries: updatedCountries,
          badges: checkBadges(updatedCountries, prev.badges, newPerfectSessions, newTotalSessions),
          lastUpdated: new Date().toISOString(),
          perfectSessions: newPerfectSessions,
          totalSessions: newTotalSessions,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const getCountryStatus = useCallback(
    (countryId: string): ClearStatus =>
      progress.countries[countryId]?.status ?? 'unplayed',
    [progress],
  );

  const getStats = useCallback(() => {
    const all = Object.values(progress.countries);
    const cleared    = all.filter((c) => c.status === 'cleared').length;
    const inProgress = all.filter((c) => c.status === 'in_progress').length;
    const totalAttempts = all.reduce((s, c) => s + c.totalAttempts, 0);
    const totalCorrect  = all.reduce((s, c) => s + c.correctAnswers, 0);
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    return { cleared, inProgress, total: 195, accuracy };
  }, [progress]);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    setProgress(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  return { progress, recordResult, getCountryStatus, getStats, resetProgress };
}
