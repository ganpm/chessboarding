# Chessboarding

![React](https://img.shields.io/badge/React-19.2.6-22AACA?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.0-38B2AC?logo=tailwindcss&logoColor=38B2AC)
![Vite](https://img.shields.io/badge/Vite-8.0.13-646CFF?logo=vite&logoColor=646CFF)

Chessboarding is a browser chess app built with React + TypeScript.

## Table of Contents

- [Chessboarding](#chessboarding)
  - [Table of Contents](#table-of-contents)
  - [Current Features](#current-features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install dependencies](#install-dependencies)
    - [Start development server](#start-development-server)
  - [Available Scripts](#available-scripts)
  - [Known Limitations](#known-limitations)

## Current Features

- Fully initialized chessboard with piece sprites
- Turn-based move enforcement (white/black alternation)
- Click-to-move and drag-to-move move options
- Legal move highlighting
- Last-move highlighting
- Castling support (king/queen side)
- En passant support
- Promotion UI with selectable piece type
- Check and checkmate detection
- Move list display with algebraic notation
- Move list navigation

## Tech Stack

Frontend:

- TypeScript 6
- React 19
- Vite 8
- Tailwind CSS 4

Tooling:

- ESLint
- Vitest

Game:

- TypeScript 6

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Available Scripts

From the repository root:

- `npm run dev` - start Vite development server
- `npm run build` - run TypeScript build (`tsc -b`) and create production bundle
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint across the workspace
- `npm run test` - run unit tests with Vitest

## Known Limitations

- Move notation does not yet include full piece disambiguation (for cases like `Nbd2` vs `Nfd2`).
- Draw conditions such as threefold repetition, fifty-move rule, and insufficient material are not available.
- The move generation and move validation methods used are the naive implementations.
