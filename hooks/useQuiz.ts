'use client';

import { useState, useCallback } from 'react';
import { QuizQuestion, QuizGenre } from '@/types';

const QUESTIONS_PER_SESSION = 5;

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedAnswer: number | null;
  correctCount: number;
  isFinished: boolean;
  isStarted: boolean;
}

export function useQuiz(allQuestions: QuizQuestion[]) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    correctCount: 0,
    isFinished: false,
    isStarted: false,
  });

  const start = useCallback(() => {
    // ジャンルごとにグループ化し、均等にサンプリング
    const genres: QuizGenre[] = [
      'geography', 'history', 'culture', 'food', 'language',
      'economy', 'politics', 'technology', 'entertainment', 'arts',
      'tourism', 'person',
    ];
    // ジャンル順をシャッフルして毎回異なる組み合わせになるようにする
    const shuffledGenres = [...genres].sort(() => Math.random() - 0.5);
    const byGenre: Record<string, QuizQuestion[]> = {};
    for (const g of genres) byGenre[g] = [];
    for (const q of allQuestions) {
      if (byGenre[q.genre]) byGenre[q.genre].push(q);
    }

    const pool: QuizQuestion[] = [];
    let i = 0;
    while (pool.length < QUESTIONS_PER_SESSION) {
      const genre = shuffledGenres[i % shuffledGenres.length];
      const bucket = byGenre[genre];
      if (bucket.length > 0) {
        const idx = Math.floor(Math.random() * bucket.length);
        pool.push(bucket.splice(idx, 1)[0]);
      }
      i++;
      if (i > shuffledGenres.length * QUESTIONS_PER_SESSION) break;
    }

    // 不足分をランダム補完
    if (pool.length < QUESTIONS_PER_SESSION) {
      const rest = allQuestions.filter((q) => !pool.includes(q));
      pool.push(...rest.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SESSION - pool.length));
    }

    setState({
      questions: pool.slice(0, QUESTIONS_PER_SESSION),
      currentIndex: 0,
      selectedAnswer: null,
      correctCount: 0,
      isFinished: false,
      isStarted: true,
    });
  }, [allQuestions]);

  const answer = useCallback((index: number) => {
    setState((prev) => {
      if (prev.selectedAnswer !== null) return prev;
      const isCorrect = index === prev.questions[prev.currentIndex].correctIndex;
      return {
        ...prev,
        selectedAnswer: index,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex + 1 >= prev.questions.length) {
        return { ...prev, isFinished: true };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1, selectedAnswer: null };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      correctCount: 0,
      isFinished: false,
      isStarted: false,
    });
  }, []);

  return {
    ...state,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    total: QUESTIONS_PER_SESSION,
    start,
    answer,
    next,
    reset,
  };
}
