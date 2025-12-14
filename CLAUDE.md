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
