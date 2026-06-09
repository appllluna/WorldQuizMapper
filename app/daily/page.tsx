'use client';

import SiteHeader from '@/components/layout/SiteHeader';
import DailyQuizClient from '@/components/daily/DailyQuizClient';

export default function DailyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <DailyQuizClient />
    </div>
  );
}
