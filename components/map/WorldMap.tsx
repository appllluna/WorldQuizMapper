'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ClearStatus } from '@/types';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const STATUS_FILL: Record<ClearStatus, string> = {
  unplayed:    '#E5E7EB',
  in_progress: '#93C5FD', // blue-300
  cleared:     '#4ADE80', // green-400
};

interface WorldMapProps {
  getStatusByNumeric: (isoNumeric: string) => ClearStatus;
  hasQuizByNumeric: (isoNumeric: string) => boolean;
  onCountryClick: (isoNumeric: string) => void;
}

export default function WorldMap({
  getStatusByNumeric,
  hasQuizByNumeric,
  onCountryClick,
}: WorldMapProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#C8E6F5] border border-gray-200 shadow-inner">
      <ComposableMap
        projectionConfig={{ scale: 150, center: [0, 10] }}
        style={{ width: '100%', height: 'auto' }}
      >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId = String(geo.id);
                const hasData = hasQuizByNumeric(numId);
                const status = getStatusByNumeric(numId);
                const fill = hasData ? STATUS_FILL[status] : '#D1D5DB';

                return (
                  <g
                    key={geo.rsmKey}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      if (hasData) onCountryClick(numId);
                    }}
                  >
                  <Geography
                    geography={geo}
                    onClick={() => hasData && onCountryClick(numId)}
                    style={{
                      default: {
                        fill,
                        stroke: '#9CA3AF',
                        strokeWidth: 0.4,
                        outline: 'none',
                      },
                      hover: {
                        fill: hasData
                          ? (status === 'cleared' ? '#22C55E' : '#60A5FA')
                          : '#D1D5DB',
                        stroke: '#6B7280',
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: hasData ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: '#16A34A',
                        outline: 'none',
                      },
                    }}
                  />
                  </g>
                );
              })
            }
          </Geographies>
      </ComposableMap>

      {/* 凡例 */}
      <div className="flex gap-4 px-4 py-2 bg-white/80 text-xs text-gray-600 flex-wrap">
        {[
          { color: '#E5E7EB', label: '未挑戦' },
          { color: '#93C5FD', label: '挑戦中' },
          { color: '#4ADE80', label: '攻略済み' },
          { color: '#D1D5DB', label: 'データなし' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm border border-gray-300"
              style={{ backgroundColor: color }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
