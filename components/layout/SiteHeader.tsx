'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',       label: '地図',  icon: '🌍' },
  { href: '/daily',  label: 'Daily', icon: '📅' },
  { href: '/admin',  label: 'Admin', icon: '🔧' },
];

interface SiteHeaderProps {
  right?: React.ReactNode;
}

export default function SiteHeader({ right }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
              World Quiz Mapper
            </h1>
            <p className="text-xs text-gray-400">世界地図を塗り潰す総合クイズゲーム</p>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* 右側スロット（ページ固有ボタンなど） */}
        {right && <div>{right}</div>}
      </div>
    </header>
  );
}
