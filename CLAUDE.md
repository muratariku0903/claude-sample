# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a modern TODO application built with Next.js, TypeScript, and Tailwind CSS.

## Repository Information

- **GitHub Remote**: `git@github.com:muratariku0903/claude-sample.git`
- **Repository Type**: Public

## Claude Code Configuration

The repository includes `.claude/settings.local.json` with permissions configured for GitHub repository operations.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: localStorage

### File Structure
```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
└── components/
    └── TodoList.tsx    # Main TODO component
```

### Features
- Add, toggle, and delete TODO items
- Filter tasks (all, active, completed)
- Clear all completed tasks
- Data persistence using localStorage
- Responsive design with Tailwind CSS
- Dark mode support
- TypeScript for type safety

## Getting Started

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

### Deployment
This project is configured for deployment on Vercel.

## テストコード作成時の厳守事項

### 絶対に守ってください！

#### テストコードの品質

- テストは必ず実際の機能を検証すること
- `expect(true).toBe(true)` のような意味のないアサーションは絶対に書かない
- 各テストケースは具体的な入力と期待される出力を検証すること
- モックは必要最小限に留め、実際の動作に近い形でテストすること

#### ハードコーディングの禁止

- テストを通すためだけのハードコードは絶対に禁止

#### テスト実装の原則

- テストが失敗する状態から始めること（Red-Green-Refactor）
- 境界値、異常系、エラーケースも必ずテストすること
- カバレッジだけでなく、実際の品質を重視すること
- テストケース名は何をテストしているか明確に記述すること

#### 実装前の確認

- 機能の仕様を正しく理解してからテストを書くこと
- 不明な点があれば、仮の実装ではなく、ユーザーに確認すること

#### 本番コードの分離

- 本番コードに `if (testMode)` のような条件分岐を入れない
- テスト用の特別な値（マジックナンバー）を本番コードに埋め込まない
- 環境変数や設定ファイルを使用して、テスト環境と本番環境を適切に分離すること
