import { Country } from '@/types';

export const countries: Country[] = [
  { id: 'JPN', isoNumeric: '392', name: '日本',           nameEn: 'Japan',          region: 'アジア' },
  { id: 'FRA', isoNumeric: '250', name: 'フランス',       nameEn: 'France',         region: 'ヨーロッパ' },
  { id: 'EGY', isoNumeric: '818', name: 'エジプト',       nameEn: 'Egypt',          region: 'アフリカ' },
  { id: 'BRA', isoNumeric: '76',  name: 'ブラジル',       nameEn: 'Brazil',         region: '南米' },
  { id: 'USA', isoNumeric: '840', name: 'アメリカ合衆国', nameEn: 'United States',  region: '北米' },
  { id: 'GBR', isoNumeric: '826', name: 'イギリス',       nameEn: 'United Kingdom', region: 'ヨーロッパ' },
  { id: 'DEU', isoNumeric: '276', name: 'ドイツ',         nameEn: 'Germany',        region: 'ヨーロッパ' },
  { id: 'CHN', isoNumeric: '156', name: '中国',           nameEn: 'China',          region: 'アジア' },
  { id: 'IND', isoNumeric: '356', name: 'インド',         nameEn: 'India',          region: 'アジア' },
  { id: 'KOR', isoNumeric: '410', name: '韓国',           nameEn: 'South Korea',    region: 'アジア' },
  { id: 'ITA', isoNumeric: '380', name: 'イタリア',       nameEn: 'Italy',          region: 'ヨーロッパ' },
  { id: 'AUS', isoNumeric: '36',  name: 'オーストラリア', nameEn: 'Australia',      region: 'オセアニア' },
];

// world-atlas の topojson id（数値）→ Country のマップ
export const numericToCountry: Record<string, Country> = Object.fromEntries(
  countries.map((c) => [c.isoNumeric, c])
);

export const idToCountry: Record<string, Country> = Object.fromEntries(
  countries.map((c) => [c.id, c])
);
