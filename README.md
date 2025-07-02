# H-BAT Web Application

Harvard Beat Assessment Test (H-BAT) のオンライン実装版です。聴力閾値テスト（Audiometry）とBeat Saliency Test（BST）をブラウザで実施できます。

## 🚀 機能

- **聴力閾値テスト**: 1000Hz, 2000Hz, 4000Hzの純音での閾値測定
- **Beat Saliency Test**: 2拍子/3拍子の知覚能力の測定
- **レスポンシブ対応**: デスクトップ・モバイル両対応
- **管理ダッシュボード**: 研究者向けデータ集計・CSV出力機能

## 🛠 技術スタック

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Audio**: Tone.js, Web Audio API
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, React Chart.js 2
- **Forms**: React Hook Form, Zod
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

## 📋 必要要件

- Node.js 18.0.0以上
- npm または yarn
- Supabaseアカウント

## 🔧 セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/yourusername/h-bat-web.git
   cd h-bat-web
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   ```bash
   cp env.example .env.local
   ```
   
   `.env.local`を編集してSupabaseの設定を追加:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Supabaseの設定**
   - [Supabase](https://supabase.com)でプロジェクトを作成
   - `supabase/migrations/`内のSQLファイルを実行してテーブルを作成
   - Row Level Security (RLS) を有効化

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   http://localhost:3000 でアクセス可能になります。

## 🧪 テスト

- **単体テスト**: `npm run test`
- **テスト（監視モード）**: `npm run test:watch`
- **E2Eテスト**: `npm run test:e2e`
- **Lint**: `npm run lint`

## 📱 使用方法

### 参加者向け

1. トップページで利用規約に同意
2. 基本情報（年齢、性別）を入力
3. 聴力閾値テストを実施（約3分）
4. Beat Saliency Test（知覚テスト）を実施（約4分）
5. 結果を確認

### 研究者向け

1. `/admin`にアクセス
2. Supabase Authでログイン（管理者権限必要）
3. ダッシュボードでデータ確認
4. CSV形式でデータエクスポート

## 🚀 デプロイ

### Vercel

1. [Vercel](https://vercel.com)アカウントでGitHubリポジトリと連携
2. 環境変数を設定
3. 自動デプロイが開始されます

### 環境変数（本番環境）

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📊 開発スケジュール

| 期間 | タスク |
|------|--------|
| Day 1-3 | プロジェクト初期化、DB設計 |
| Day 4-7 | 聴力閾値テスト実装 |
| Day 8-10 | Beat Saliency Test（知覚のみ）実装 |
| Day 12-14 | 管理画面、E2Eテスト |

## 🔒 セキュリティ・倫理

- 個人情報は研究目的でのみ使用
- GDPR/個人情報保護法に準拠
- 90日後にデータの匿名化を実施
- SFC研究倫理審査委員会承認済み

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトは研究目的で作成されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 📞 お問い合わせ

プロジェクトに関する質問は [Issues](https://github.com/yourusername/h-bat-web/issues) からお問い合わせください。
