'use client';
import { useEffect } from 'react';

export default function ErrorAlert() {
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      alert(`[JS Error]\n${e.message}\n${e.filename}:${e.lineno}`);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      alert(`[Promise Error]\n${String(e.reason)}`);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
  return null;
}
