'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection, doc, getDocs, setDoc, deleteDoc, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { quizData } from '@/data/quizData';
import { countries } from '@/data/countries';
import SiteHeader from '@/components/layout/SiteHeader';

// Firestore: verified_questions/{questionId} → { verified: true, updatedAt }

export default function AdminClient() {
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Firestore から検証済みIDを読み込む
  useEffect(() => {
    getDocs(collection(db, 'verified_questions'))
      .then((snap) => {
        const ids = new Set(snap.docs.map((d) => d.id));
        setVerifiedIds(ids);
      })
      .catch((e) => console.error('Firestore read error:', e))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(async (questionId: string, currentlyVerified: boolean) => {
    setSaving(questionId);
    try {
      const ref = doc(db, 'verified_questions', questionId);
      if (currentlyVerified) {
        await deleteDoc(ref);
        setVerifiedIds((prev) => { const s = new Set(prev); s.delete(questionId); return s; });
      } else {
        await setDoc(ref, { verified: true, updatedAt: Timestamp.now() });
        setVerifiedIds((prev) => new Set(prev).add(questionId));
      }
    } catch (e) {
      console.error('Firestore write error:', e);
      alert('保存に失敗しました。Firebase の設定を確認してください。');
    } finally {
      setSaving(null);
    }
  }, []);

  const countryNameMap = Object.fromEntries(countries.map((c) => [c.id, c.name]));
  const verifiedCount = verifiedIds.size;
  const totalCount = quizData.reduce((s, c) => s + c.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">問題管理</h2>
          <p className="text-sm text-gray-500 mt-1">
            検証済み: {verifiedCount} / {totalCount} 問
          </p>
          {/* TODO: Twitter認証を実装したら特定ユーザーのみアクセス可にする */}
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          {(['all', 'verified', 'unverified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'verified' ? '検証済み' : '未検証'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">読み込み中...</div>
        ) : (
          <div className="space-y-6">
            {quizData.map((countrySet) => {
              const questions = countrySet.questions.filter((q) => {
                if (filter === 'verified')   return verifiedIds.has(q.id);
                if (filter === 'unverified') return !verifiedIds.has(q.id);
                return true;
              });
              if (questions.length === 0) return null;

              return (
                <div key={countrySet.countryId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-base font-bold text-gray-800 mb-4">
                    {countryNameMap[countrySet.countryId] ?? countrySet.countryId}
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      ({countrySet.countryId})
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q) => {
                      const verified = verifiedIds.has(q.id);
                      const isSaving = saving === q.id;
                      return (
                        <div
                          key={q.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${
                            verified
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <button
                            onClick={() => toggle(q.id, verified)}
                            disabled={isSaving}
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              verified
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            } ${isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                          >
                            {verified && <span className="text-xs leading-none">✓</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-400">{q.id}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                q.genre === 'geography'    ? 'bg-blue-100 text-blue-700' :
                                q.genre === 'history'      ? 'bg-orange-100 text-orange-700' :
                                q.genre === 'culture'      ? 'bg-purple-100 text-purple-700' :
                                q.genre === 'food'         ? 'bg-yellow-100 text-yellow-700' :
                                q.genre === 'language'     ? 'bg-indigo-100 text-indigo-700' :
                                q.genre === 'economy'      ? 'bg-cyan-100 text-cyan-700' :
                                q.genre === 'politics'     ? 'bg-red-100 text-red-700' :
                                q.genre === 'technology'   ? 'bg-violet-100 text-violet-700' :
                                q.genre === 'entertainment'? 'bg-lime-100 text-lime-700' :
                                q.genre === 'arts'         ? 'bg-fuchsia-100 text-fuchsia-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {q.genre}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 leading-snug">{q.question}</p>
                            <p className="text-xs text-green-700 mt-0.5">
                              正解: {q.options[q.correctIndex]}
                            </p>
                            {q.explanation && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{q.explanation}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
