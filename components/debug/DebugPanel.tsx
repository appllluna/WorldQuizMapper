'use client';
import { useEffect, useState } from 'react';

export default function DebugPanel() {
  const [jsRunning, setJsRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [info, setInfo] = useState('');

  useEffect(() => {
    setJsRunning(true);
    setInfo(`UA: ${navigator.userAgent.slice(0, 80)}`);

    const handleError = (e: ErrorEvent) => {
      setErrors((prev) => [...prev, `[Error] ${e.message} (${e.filename}:${e.lineno})`]);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      setErrors((prev) => [...prev, `[Promise] ${String(e.reason)}`]);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-black/80 text-white text-xs p-2 max-h-40 overflow-y-auto">
      <div className={jsRunning ? 'text-green-400' : 'text-red-400'}>
        JS: {jsRunning ? '✓ 動作中' : '✗ 未実行'}
      </div>
      <div className="text-gray-400 break-all">{info}</div>
      {errors.length === 0 ? (
        <div className="text-gray-500">エラーなし</div>
      ) : (
        errors.map((e, i) => (
          <div key={i} className="text-red-300 break-all">{e}</div>
        ))
      )}
    </div>
  );
}
