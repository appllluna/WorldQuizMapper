'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useMemo } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { countries, numericToCountry } from '@/data/countries';
import { quizDataMap } from '@/data/quizData';
import { Country, ClearStatus } from '@/types';
import QuizModal from '@/components/quiz/QuizModal';
import ProgressStats from '@/components/ui/ProgressStats';
import BadgeList from '@/components/ui/BadgeList';
import CountryList from '@/components/map/CountryList';
import SiteHeader from '@/components/layout/SiteHeader';

// react-simple-maps はブラウザ専用のため動的インポート
const WorldMap = dynamic(() => import('@/components/map/WorldMap'), { ssr: false });

const hasQuizByNumeric = (num: string): boolean => {
  const country = numericToCountry[num];
  return country ? !!quizDataMap[country.id] : false;
};

export default function HomePage() {
  const { progress, recordResult, getCountryStatus, getStats, resetProgress } = useProgress();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const stats = getStats();

  const getStatusByNumeric = useCallback(
    (num: string): ClearStatus => {
      const country = numericToCountry[num];
      return country ? getCountryStatus(country.id) : 'unplayed';
    },
    [getCountryStatus]
  );

  const handleMapClick = useCallback((isoNumeric: string) => {
    const country = numericToCountry[isoNumeric];
    if (country) setSelectedCountry(country);
  }, []);

  const handleListSelect = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleFinish = useCallback(
    (correctCount: number) => {
      if (!selectedCountry) return;
      recordResult(selectedCountry.id, correctCount);
    },
    [selectedCountry, recordResult]
  );

  const handleClose = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const quizQuestions = useMemo(
    () => (selectedCountry ? quizDataMap[selectedCountry.id]?.questions ?? [] : []),
    [selectedCountry]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader
        right={
          <button
            onClick={() => { if (confirm('進捗をリセットしますか？')) resetProgress(); }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            リセット
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* 左: 地図 + 国リスト */}
        <div className="space-y-6">
          <WorldMap
            getStatusByNumeric={getStatusByNumeric}
            hasQuizByNumeric={hasQuizByNumeric}
            onCountryClick={handleMapClick}
          />
          <CountryList
            countries={countries}
            getStatus={getCountryStatus}
            onSelect={handleListSelect}
          />
        </div>

        {/* 右: 進捗・バッジ */}
        <div className="space-y-6">
          <ProgressStats
            cleared={stats.cleared}
            inProgress={stats.inProgress}
            total={stats.total}
            accuracy={stats.accuracy}
          />
          <BadgeList badges={progress.badges} />
        </div>
      </div>

      {/* クイズモーダル */}
      {selectedCountry && quizQuestions.length > 0 && (
        <QuizModal
          key={selectedCountry.id}
          countryName={selectedCountry.name}
          questions={quizQuestions}
          onClose={handleClose}
          onFinish={handleFinish}
        />
      )}
    </main>
  );
}
