'use client';

import { Country, ClearStatus } from '@/types';

const STATUS_STYLES: Record<ClearStatus, string> = {
  unplayed:    'bg-gray-100 border-gray-200 text-gray-600 hover:border-blue-300',
  in_progress: 'bg-blue-50 border-blue-300 text-blue-800 hover:border-blue-400',
  cleared:     'bg-green-50 border-green-400 text-green-800',
};

const STATUS_LABELS: Record<ClearStatus, string> = {
  unplayed:    '未挑戦',
  in_progress: '挑戦中',
  cleared:     '攻略済み ✓',
};

const STATUS_BADGE: Record<ClearStatus, string> = {
  unplayed:    'bg-gray-200 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-700',
  cleared:     'bg-green-100 text-green-700',
};

const REGION_ORDER = ['アジア', 'ヨーロッパ', '北米', '南米', 'アフリカ', '中東', 'オセアニア'];

interface CountryListProps {
  countries: Country[];
  getStatus: (id: string) => ClearStatus;
  onSelect: (country: Country) => void;
}

export default function CountryList({ countries, getStatus, onSelect }: CountryListProps) {
  const grouped = REGION_ORDER.reduce<Record<string, Country[]>>((acc, region) => {
    const inRegion = countries.filter((c) => c.region === region);
    if (inRegion.length > 0) acc[region] = inRegion;
    return acc;
  }, {});

  // 未定義リージョンをまとめて末尾に
  const knownRegions = new Set(REGION_ORDER);
  const others = countries.filter((c) => !knownRegions.has(c.region));
  if (others.length > 0) grouped['その他'] = others;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        クイズ対応国
      </h2>

      {Object.entries(grouped).map(([region, regionCountries]) => (
        <div key={region} className="mb-4 last:mb-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
            {region}
          </p>
          <div className="space-y-2">
            {regionCountries.map((country) => {
              const status = getStatus(country.id);
              return (
                <button
                  key={country.id}
                  onClick={() => onSelect(country)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${STATUS_STYLES[status]}`}
                >
                  <span className="font-semibold text-sm">{country.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 mt-4 text-center">
        地図上の国をクリックしてもクイズを開始できます
      </p>
    </div>
  );
}
