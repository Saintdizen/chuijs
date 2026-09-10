---
title: "Lint/format setup (chuijs)"
---

# Lint & format

- ESLint 10 flat config: `eslint.config.js` (CommonJS, `sourceType: "commonjs"`, node+browser globals, `eslint:recommended`). Rules kept from the old `.eslintrc.json`: `no-unused-vars` warn with `^_` ignore patterns, `no-constant-condition` with `checkLoops: false`. Legacy `.eslintrc.json` was removed (ignored by ESLint 10 anyway).
- Ignores: `node_modules/`, `package-lock.json`, `framework/modules/chui_fonts.js` (3.6 MB base64 blob — never lint/format/read it).
- Scripts: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check` (Prettier 3, config in `.prettierrc.json`, ignores in `.prettierignore`).
- Known state (10.09.2026, после `npm install`): `npm run lint` exits 1 with **36 problems (16 errors, 20 warnings)**, all pre-existing (dead private class members, `no-empty`, `no-useless-assignment`, `preserve-caught-error`, unused `e`/`store`/`CheckBox`). `npm run format:check` exits 1 — не отформатировано Prettier, «Code style issues found in 119 files»; не запускать `prettier --write .` без спроса.
- **Актуальная рабочая копия: `/home/dethmond/kodik_projects/chuijs`** (прежние заметки ссылались на `/home/dethjob/kodik_project/chuijs` — это старая копия, пути в командах править).
- devDependencies (`@eslint/js@10.0.1`, `eslint@10.10.0`, `globals@17.12.0`, `prettier@3.9.6`) объявлены в `package.json` и **установлены** (10.09.2026, 18:49). Если `npm run lint` падает на `Error: Cannot find module '@eslint/js'` — значит `npm install` не выполнялся (или шёл с `--omit=dev`/`--production`, как при упаковке Electron-приложения); лечится обычным `npm install`. Без зависимостей замена проверки синтаксиса: `node --check <file>`.
- `package-lock.json` is gitignored/untracked (`.gitignore`: `node_modules/`, `package-lock.json`, `push.sh`, `.idea`, `.vscode`) — на чистом клоне devDeps ставятся только из `package.json`, так что обычный `npm install` обязателен.
- Verify imports after touching `index.js` barrels: regex `const\s*\{([^}]+)\}\s*=\s*require\((["'])(\.[^"']+)\2\)` then check `exports.<name>` exists in the target file.
