'use client';

import { useEffect } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizQuestion } from '@/types';
import AnswerButton from './AnswerButton';

const GENRE_LABELS: Record<string, string> = {
  geography:    '地理',
  history:      '歴史',
  culture:      '文化',
  food:         '食べ物',
  language:     '言語',
  economy:      '現代社会',
  politics:     '政治',
  technology:   'テクノロジー',
  entertainment:'エンタメ',
  arts:         '芸能',
  tourism:      '観光',
  person:       '人物',
};

const GENRE_COLORS: Record<string, string> = {
  geography:    'bg-blue-100 text-blue-700',
  history:      'bg-orange-100 text-orange-700',
  culture:      'bg-purple-100 text-purple-700',
  food:         'bg-yellow-100 text-yellow-700',
  language:     'bg-indigo-100 text-indigo-700',
  economy:      'bg-cyan-100 text-cyan-700',
  politics:     'bg-red-100 text-red-700',
  technology:   'bg-violet-100 text-violet-700',
  entertainment:'bg-lime-100 text-lime-700',
  arts:         'bg-fuchsia-100 text-fuchsia-700',
  tourism:      'bg-green-100 text-green-700',
  person:       'bg-pink-100 text-pink-700',
};

interface QuizModalProps {
  countryName: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onFinish: (correctCount: number) => void;
}

export default function QuizModal({ countryName, questions, onClose, onFinish }: QuizModalProps) {
  const quiz = useQuiz(questions);

  useEffect(() => {
    quiz.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (quiz.isFinished) {
      onFinish(quiz.correctCount);
    }
  }, [quiz.isFinished, quiz.correctCount, onFinish]);

  if (!quiz.isStarted || !quiz.currentQuestion) {
    return null;
  }

  const isPassed = quiz.correctCount >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">クイズ</p>
            <h2 className="text-xl font-bold text-gray-900">{countryName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {quiz.isFinished ? (
          /* 結果画面 */
          <div className="px-6 py-8 text-center">
            <div className={`text-6xl mb-4 ${isPassed ? '' : 'grayscale'}`}>
              {isPassed ? '🏆' : '📝'}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isPassed ? 'text-yellow-600' : 'text-gray-600'}`}>
              {isPassed ? '占領成功！' : 'もう少し！'}
            </h3>
            <p className="text-gray-500 mb-1">
              {quiz.total}問中 <span className="font-bold text-gray-800">{quiz.correctCount}問</span> 正解
            </p>
            {isPassed ? (
              <p className="text-sm text-yellow-700 bg-yellow-50 rounded-lg px-4 py-2 mt-4">
                {countryName}を地図に塗りました！
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                5問中3問以上正解すると占領できます。再挑戦しましょう！
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              地図に戻る
            </button>
          </div>
        ) : (
          /* 問題画面 */
          <div className="px-6 py-5">
            {/* 進捗バー */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: quiz.total }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i < quiz.currentIndex
                      ? 'bg-blue-500'
                      : i === quiz.currentIndex
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* ジャンルタグ & 問題番号 */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  GENRE_COLORS[quiz.currentQuestion.genre]
                }`}
              >
                {GENRE_LABELS[quiz.currentQuestion.genre]}
              </span>
              <span className="text-xs text-gray-400">
                {quiz.currentIndex + 1} / {quiz.total}
              </span>
            </div>

            {/* 問題文 */}
            <p className="text-base font-semibold text-gray-800 mb-5 leading-snug">
              {quiz.currentQuestion.question}
            </p>

            {/* 選択肢 */}
            <div className="space-y-2.5 mb-5">
              {quiz.currentQuestion.options.map((opt, i) => (
                <AnswerButton
                  key={i}
                  label={opt}
                  index={i}
                  selectedAnswer={quiz.selectedAnswer}
                  correctIndex={quiz.currentQuestion!.correctIndex}
                  onSelect={quiz.answer}
                />
              ))}
            </div>

            {/* 解説 & 次へボタン */}
            {quiz.selectedAnswer !== null && (
              <div className="space-y-3">
                {quiz.currentQuestion.explanation && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                    {quiz.currentQuestion.explanation}
                  </p>
                )}
                <button
                  onClick={quiz.next}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  {quiz.currentIndex + 1 < quiz.total ? '次の問題へ →' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
