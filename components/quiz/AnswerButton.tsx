'use client';

interface AnswerButtonProps {
  label: string;
  index: number;
  selectedAnswer: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
}

export default function AnswerButton({
  label,
  index,
  selectedAnswer,
  correctIndex,
  onSelect,
}: AnswerButtonProps) {
  const isSelected = selectedAnswer === index;
  const isCorrect = index === correctIndex;
  const hasAnswered = selectedAnswer !== null;

  let cls = 'w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ';

  if (!hasAnswered) {
    cls += 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
  } else if (isCorrect) {
    cls += 'border-green-500 bg-green-50 text-green-800';
  } else if (isSelected && !isCorrect) {
    cls += 'border-red-400 bg-red-50 text-red-800';
  } else {
    cls += 'border-gray-200 bg-gray-50 text-gray-400 cursor-default';
  }

  return (
    <button
      className={cls}
      onClick={() => !hasAnswered && onSelect(index)}
      disabled={hasAnswered}
    >
      <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][index]}.</span>
      {label}
      {hasAnswered && isCorrect && <span className="ml-2">✓</span>}
      {hasAnswered && isSelected && !isCorrect && <span className="ml-2">✗</span>}
    </button>
  );
}
