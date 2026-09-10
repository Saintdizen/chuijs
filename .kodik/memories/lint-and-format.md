---
title: "Lint/format setup (chuijs)"
---

# Lint & format

- ESLint 10 flat config: `eslint.config.js` (CommonJS, `sourceType: "commonjs"`, node+browser globals, `eslint:recommended`). Rules kept from the old `.eslintrc.json`: `no-unused-vars` warn with `^_` ignore patterns, `no-constant-condition` with `checkLoops: false`. Legacy `.eslintrc.json` was removed (ignored by ESLint 10 anyway).
- Ignores: `node_modules/`, `package-lock.json`, `framework/modules/chui_fonts.js` (3.6 MB base64 blob — never lint/format/read it).
- Scripts: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check` (Prettier 3, config in `.prettierrc.json`, ignores in `.prettierignore`).
- Known state: `npm run lint` exits 1 with ~16 errors / 21 warnings, all pre-existing (dead private class members, `no-useless-escape`, `no-empty`, `no-useless-assignment`, `preserve-caught-error`). The codebase is not Prettier-formatted; do not run `prettier --write .` without asking.
- `package-lock.json` is gitignored/untracked.
- Verify imports after touching `index.js` barrels: regex `const\s*\{([^}]+)\}\s*=\s*require\((["'])(\.[^"']+)\2\)` then check `exports.<name>` exists in the target file.
