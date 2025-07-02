# H-BAT Web アプリ設計仕様書（更新版）

**最終更新**: 2024年12月
**変更内容**: BST生成パート（Production）を削除し、知覚パート（Perception）のみに変更

---

## 1. 概要

Harvard Beat Assessment Test (H-BAT) のうち以下の2課題をブラウザで実施できるWebアプリケーション：

- ✅ **聴力閾値テスト（Audiometry）**: 1000Hz, 2000Hz, 4000Hz
- ✅ **Beat Saliency Test（BST）知覚パート**: 2拍子/3拍子の知覚能力測定
- ❌ **BST生成パート**: 削除（タップ強度による再現テストは実装しない）

## 2. 画面フロー

```
[トップページ] → [基本情報入力] → [聴力閾値テスト] → [BST知覚テスト] → [結果表示]
```

### 2.1 画面仕様

| ID | ルート | 画面名 | 主要機能 | 推定時間 |
|----|--------|--------|----------|----------|
| A | `/` | トップページ | 研究概要、利用規約、診断開始 | 2分 |
| B | `/intro` | 基本情報入力 | 年齢・性別入力フォーム | 1分 |
| C | `/test/audiometry` | 聴力閾値テスト | 3周波数での閾値測定 | 3分 |
| D | `/test/bst` | BST知覚テスト | 2拍子/3拍子の判別 | 4分 |
| E | `/result` | 結果表示 | 閾値結果とグラフ表示 | 2分 |
| F | `/admin` | 管理ダッシュボード | データ集計・CSV出力 | - |

**合計テスト時間**: 約10分（従来の約13分から短縮）

## 3. データベーススキーマ

### 3.1 主要テーブル

```sql
-- テスト種別（生成パート削除）
create type test_kind as enum ('audiometry', 'bst_perception');

-- プロフィール
create table profiles (
  id uuid references auth.users primary key,
  age smallint not null,
  gender gender_type,
  created_at timestamptz default now()
);

-- テスト履歴
create table tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  kind test_kind not null,
  started_at timestamptz default now(),
  finished_at timestamptz
);

-- 聴力閾値結果
create table audiometry_results (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id),
  frequency_hz smallint check (frequency_hz in (1000, 2000, 4000)),
  threshold_db numeric(5, 2)
);

-- BST知覚結果
create table bst_results (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id),
  trial_number smallint,
  pattern_type text check (pattern_type in ('2beat', '3beat')),
  presented_pattern text check (presented_pattern in ('2beat', '3beat')),
  user_response text check (user_response in ('2beat', '3beat')),
  db_difference numeric(5, 2),
  is_correct boolean,
  reaction_time_ms integer
);

-- BST閾値（知覚のみ）
create table bst_thresholds (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id),
  perception_threshold_db numeric(5, 2),
  reversal_points jsonb
);
```

### 3.2 削除されたテーブル

- ❌ `bst_production_results`（生成パート結果）
- ❌ `bst_production_thresholds`（生成パート閾値）

## 4. 実装詳細

### 4.1 聴力閾値テスト（変更なし）

- **ステアケース法**: 2-down/1-up
- **初期音量**: 60 dB HL
- **ステップサイズ**: 5 dB → 2.5 dB（2回反転後）
- **終了条件**: 6回目の方向反転

### 4.2 BST知覚テスト（簡略化）

- **刺激**: 強拍・弱拍の振幅差による2拍子/3拍子
- **BPM**: 120（固定）
- **初期ΔdB**: 20 dB
- **ステアケース**: 正答2回で半減、誤答1回で倍増
- **終了条件**: 6回目の方向反転

### 4.3 削除された機能

- ❌ **タップ強度計測**: PointerEvent.pressure記録
- ❌ **自己相関解析**: Lag 2 vs Lag 3比較
- ❌ **生成閾値算出**: タップパターンからの閾値導出
- ❌ **知覚-生成乖離度**: D値計算

## 5. 技術スタック

### 5.1 フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **音声**: Tone.js + Web Audio API
- **フォーム**: React Hook Form + Zod
- **グラフ**: Chart.js + React Chart.js 2

### 5.2 バックエンド
- **データベース**: Supabase PostgreSQL
- **認証**: Supabase Auth
- **セキュリティ**: Row Level Security (RLS)
- **ファイル出力**: Papaparse (CSV)

### 5.3 開発・デプロイ
- **テスト**: Vitest + Playwright
- **CI/CD**: GitHub Actions
- **ホスティング**: Vercel
- **モニタリング**: Vercel Analytics

## 6. 開発スケジュール（更新版）

| 期間 | タスク | 工数 |
|------|--------|------|
| Day 1-3 | プロジェクト初期化、DB設計 | ✅ 完了 |
| Day 4-7 | 聴力閾値テスト実装 | 4日 |
| Day 8-10 | BST知覚テスト実装 | 3日（1日短縮） |
| Day 11-12 | 結果画面・UI調整 | 2日 |
| Day 13-14 | 管理画面・E2Eテスト | 2日 |

**総開発期間**: 14日（変更なし、但し余裕あり）

## 7. パフォーマンス要件

### 7.1 音声要件
- **サンプルレート**: 48 kHz固定
- **遅延**: ±20 ms以内
- **周波数精度**: ±1 Hz以内

### 7.2 UI要件
- **応答時間**: 100ms以内
- **ブラウザ対応**: Chrome, Safari, Firefox, Edge最新版
- **モバイル対応**: iOS Safari, Android Chrome

## 8. セキュリティ・倫理

### 8.1 データ保護
- **暗号化**: 保存時・転送時ともに暗号化
- **アクセス制御**: RLSによる個人データ保護
- **匿名化**: 90日後にID切断

### 8.2 研究倫理
- **同意取得**: オンライン同意書必須
- **データ利用**: 研究目的限定
- **承認番号**: SFC研究倫理審査委員会

## 9. API設計

### 9.1 主要エンドポイント

```typescript
// プロフィール作成
POST /api/profiles
{ age: number, gender?: string }

// テスト開始
POST /api/tests
{ kind: 'audiometry' | 'bst_perception' }

// 結果保存
POST /api/results/audiometry
{ test_id: string, frequency_hz: number, threshold_db: number }

POST /api/results/bst
{ test_id: string, trial_number: number, ... }

// 管理画面用（admin権限必要）
GET /api/admin/analytics
GET /api/admin/export?start_date&end_date
```

## 10. 今後の拡張予定

### 10.1 将来的に追加する可能性
- **BIT (Beat Interval Test)**: リズム間隔知覚
- **BFIT (Beat Finding and Interval Test)**: ビート検出
- **Music Tapping Test**: 音楽に合わせたタッピング

### 10.2 技術的拡張
- **WebMIDI対応**: 外部デバイス連携
- **遅延キャリブレーション**: デバイス固有遅延補正
- **Edge Functions**: サーバーサイド音声処理

---

## 変更履歴

| 日付 | 変更内容 | 影響範囲 |
|------|----------|----------|
| 2024-12-XX | BST生成パート削除 | データベース、UI、テスト時間 |

**この設計に基づいて実装を進めます。** 