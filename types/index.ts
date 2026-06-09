export type QuizGenre =
  | 'geography'
  | 'history'
  | 'culture'
  | 'food'
  | 'language'
  | 'economy'
  | 'politics'
  | 'technology'
  | 'entertainment'
  | 'arts'
  | 'tourism'
  | 'person';

export interface QuizQuestion {
  id: string;
  genre: QuizGenre;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
  verified?: boolean;
}

export interface DailyScore {
  date: string;        // YYYY-MM-DD
  nickname: string;
  hintsUsed: number;   // 1–8: correct, 9: gave up
  correct: boolean;
  createdAt?: unknown; // Firestore Timestamp
}

export interface CountryQuizSet {
  countryId: string;
  questions: QuizQuestion[];
}

export type ClearStatus = 'unplayed' | 'in_progress' | 'cleared';

export interface CountryProgress {
  countryId: string;
  totalAttempts: number;
  correctAnswers: number;
  status: ClearStatus;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface UserProgress {
  countries: Record<string, CountryProgress>;
  badges: Badge[];
  lastUpdated: string;
  perfectSessions: number;
  totalSessions: number;
}

export interface Country {
  id: string;        // ISO A3 code (JPN, FRA, etc.)
  isoNumeric: string; // world-atlas topojson の id (392, 250, etc.)
  name: string;      // 日本語名
  nameEn: string;    // 英語名
  region: string;
}
