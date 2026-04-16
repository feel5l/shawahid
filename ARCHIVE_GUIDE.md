# ARCHIVE GUIDE

## Purpose
This document explains how the clean archive is created for this project without deleting or modifying source files.

The goal is to keep the project deployable and maintainable while removing heavy local/generated artifacts from the copied archive.

## Project Snapshot
Main folders in this repository:
- `client/`: React + Vite frontend.
- `server/`: Express backend.
- `shared/`: shared schema/types between frontend and backend.
- `scripts/`: maintenance and utility scripts.
- `docs/`: architecture/database/API documentation.
- `migrations/`: database migration SQL files.
- `netlify/`: Netlify serverless functions.

Main runtime and config files:
- `package.json`
- `netlify.toml`
- `vite.config.ts`
- `tsconfig.json`
- `drizzle.config.ts`
- `.env.example`

## Exclusion Policy Used
Approved exclusions for archive copy:

1. Dependencies
- `node_modules/`

2. Build output
- `dist/`

3. VCS metadata
- `.git/`

4. Local tool state/cache
- `.local/`
- `.netlify/`

5. Local secrets
- `.env`

Additional generic cache/temp exclusions in script:
- `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`, `.venv/`, `venv/`, `.next/`, `.nuxt/`, `coverage/`, `build/`, `out/`
- temp/log file suffixes like `.log`, `.tmp`, `.bak`

## Why Netlify Deploy Readiness Is Preserved
The archive keeps all required Netlify deployment assets:
- `netlify.toml` is included.
- `netlify/functions/` is included.

Only `.netlify/` is excluded because it is local CLI/state data and not needed for deployment.

## Commands (from package scripts)
Install dependencies:
```bash
npm install
```

Run development mode:
```bash
npm run dev
```

Type check:
```bash
npm run check
```

Run tests:
```bash
npm run test
```

Push schema changes:
```bash
npm run db:push
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Smart Backup Script
Script file:
- `smart_backup.py`

Default destination base (as requested):
- `C:\Users\Tonjo\OneDrive\Desktop\new zaid`

Run with defaults:
```bash
python smart_backup.py
```

Preview only (no files copied):
```bash
python smart_backup.py --dry-run
```

Custom destination:
```bash
python smart_backup.py --dest "D:\Backups"
```

Custom backup folder name:
```bash
python smart_backup.py --name "zaydbinthabit_clean"
```

## Practical Next Recommendation
Add one E2E pipeline test that verifies the critical flow end-to-end:
1. Teacher signs in.
2. Teacher updates/submits a criterion.
3. Principal reviews and approves.
4. Dashboard percentages update as expected.

This will protect the most important workflow against regressions after future UI/API changes.
