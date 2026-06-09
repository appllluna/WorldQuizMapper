# World Quiz Mapper — TODO / 作業ログ

## ✅ 完了した作業

### コア機能
- [x] クイズジャンルを5→12カテゴリに拡張
      (geography / history / culture / food / language / economy /
       politics / technology / entertainment / arts / tourism / person)
- [x] 挑戦中（青）と攻略済み（緑）の色を色相で差別化
- [x] 攻略済み判定バグ修正（累積ではなく1セッションで3/5以上が条件）
- [x] React infinite loop 修正（useCallback の deps を [] に、setProgress を関数形式に）

### 問題データ（8カ国 × 約20問）
- [x] 日本（JPN）— 25問
- [x] フランス（FRA）— 24問
- [x] エジプト（EGY）— 22問
- [x] ブラジル（BRA）— 23問
- [x] アメリカ（USA）— 21問
- [x] イギリス（GBR）— 17問
- [x] ドイツ（DEU）— 20問
- [x] 中国（CHN）— 20問
- [x] インド（IND）— 22問（2回目追加）
- [x] 韓国（KOR）— 22問（2回目追加）
- [x] イタリア（ITA）— 22問（2回目追加）
- [x] オーストラリア（AUS）— 22問（2回目追加）
- [x] BRA / AUS の ISO numeric コード修正（'076'→'76'、'036'→'36'）

### バッジシステム（計16個）
- [x] 進捗系：最初の一歩 / 世界の旅人(5カ国) / 世界の10%(20カ国) / 世界の4分の1(50カ国)
- [x] グループ系：EU制覇 / G7チャレンジャー / BRICS探索者
- [x] 地域系：アジアの覇者 / ヨーロッパ制覇 / アフリカ探検家 / アメリカ大陸制覇 / オセアニア制覇
- [x] 実績系：完璧主義者(1回全問正解) / 三冠達成(3回全問正解) / 精確無比(正解率80%以上) / クイズベテラン(30セッション)
- [x] totalSessions トラッキング追加（UserProgress 型に追加）

### Admin ページ
- [x] 問題の検証済みフラグ管理（Firestore: verified_questions コレクション）
- [x] フィルター（すべて / 検証済み / 未検証）
- [x] `ssr: false` エラー修正（'use client' + dynamic 廃止）

### Daily クイズ（完全リニューアル）
- [x] フォーマット変更：10問クイズ → 8ヒント国当てクイズ
- [x] ヒントを1個ずつ開く UI（ヒント1=難しい、ヒント8=簡単）
- [x] ランキング：ヒント使用数が少ない順（タイム不問）
- [x] 正解のみ Firestore に送信（ギブアップはローカル保存のみ）
- [x] 30日分のパズルデータ作成（data/dailyPuzzles.ts）
      2026-06-01 〜 2026-06-30（12カ国ローテーション）
- [x] 表記ゆれ対応（「アメリカ」「米国」「アメリカ合衆国」など全部正解）
- [x] DailyLeaderboard：ヒント数表示に更新

### Firebase / デプロイ
- [x] Firebase プロジェクト作成（WorldQuizMapper）
- [x] .env.local セットアップ（.env.local.example からコピー）
- [x] Firestore データベース作成（asia-northeast1）
- [x] Firestore セキュリティルール設定（daily_scores / verified_questions）
- [x] daily_scores ルールを新スキーマ（hintsUsed / correct）に更新
- [x] .gitignore で .env.local が除外済みであることを確認

---

## 🔲 未完了・今後の作業

### デプロイ（優先度：高）
- [ ] GitHub リポジトリに push（`git add -A && git commit -m "..."` → push）
- [ ] Vercel プロジェクト作成・GitHub 連携
- [ ] Vercel の Environment Variables に Firebase 設定 6 個を登録
- [ ] 本番 URL での動作確認（Daily クイズ・地図・Admin）

### Admin ページのセキュリティ（優先度：高）
- [ ] Firestore ルールで verified_questions の write を認証済みユーザーのみに制限
- [ ] Twitter（X）認証の実装
      → Firebase Authentication で Twitter プロバイダを有効化
      → 特定の Twitter UID のみ write 許可するルールに変更
      → Admin ページに「Xでログイン」ボタン追加

### Daily クイズ（優先度：中）
- [ ] 7月以降のパズルデータ追加（data/dailyPuzzles.ts に追記）
      → 現在は 2026-06-01〜06-30 の30日分のみ
- [ ] パズルがない日のフォールバック処理（現在は「準備中」表示）

### コンテンツ拡充（優先度：中）
- [ ] 新規国の追加（候補：スペイン / メキシコ / ロシア / 南アフリカ / カナダ / インドネシア）
      → G7・BRICS バッジ完成のため ITA・CAN・RUS・IND・ZAF が有力
- [ ] 既存国の問題を 2問→3問/ジャンル に増やす（GBR / USA が手薄）

### UI / SEO（優先度：低）
- [ ] OGP タグ追加（SNS シェア時のプレビュー画像・説明文）
- [ ] favicon 変更（地球儀・旗系の絵文字アイコン）
- [ ] 進捗リセットボタンを UI に露出（現在 resetProgress() は実装済みだが非表示）

---

## 📁 主要ファイル一覧

| ファイル | 役割 |
|---|---|
| `app/page.tsx` | トップページ（地図 + サイドバー） |
| `app/daily/page.tsx` | Daily クイズページ |
| `app/admin/page.tsx` | Admin ページ |
| `components/map/WorldMap.tsx` | react-simple-maps 地図コンポーネント |
| `components/daily/DailyQuizClient.tsx` | Daily クイズ UI（8ヒント国当て） |
| `components/daily/DailyLeaderboard.tsx` | Daily ランキング表示 |
| `components/ui/BadgeList.tsx` | バッジ一覧表示 |
| `components/layout/SiteHeader.tsx` | 共通ヘッダー |
| `data/countries.ts` | 国リスト（12カ国）+ ISO numeric コード |
| `data/quizData.ts` | 全クイズ問題データ（12カ国 × 約20問） |
| `data/dailyPuzzles.ts` | Daily パズルデータ（30日分） + checkAnswer() |
| `hooks/useProgress.ts` | 進捗・バッジ管理（localStorage） |
| `hooks/useQuiz.ts` | クイズセッション管理 |
| `hooks/useDaily.ts` | Daily クイズロジック（Firebase連携） |
| `lib/firebase.ts` | Firebase 初期化 |
| `types/index.ts` | 全型定義 |

---

## 🔧 現在の技術スタック

- **Framework**: Next.js 16.2.7 (App Router)
- **Styling**: Tailwind CSS
- **Map**: react-simple-maps + world-atlas
- **Database**: Firebase Firestore（Daily スコア・問題検証フラグ）
- **Deploy**: Vercel（予定）
- **Auth**: 未実装（Twitter 認証を将来導入予定）
