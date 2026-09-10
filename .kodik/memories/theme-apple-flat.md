---
title: "Палитра Apple flat (chuijs)"
---

# Палитра Apple flat

`framework/appLayout/default/main_theme_style.css` — iOS/macOS «grouped»:
- `--main_background` — подложка страницы (`#f2f2f7` light / `#000000` dark);
- `--element_background_2` — карточки/контент (`#ffffff` / `#1c1c1e`);
- `--element_background` = `--button_background` — полупрозрачные systemFill `rgba(120,120,128,0.2)` light / `0.3` dark — читаются и на белой карточке, и на серой подложке;
- `--element_background_hover` — плотнее (`0.32` / `0.45`);
- хайрлайны — только через `--border_color` (НЕ через `--element_background_2`, это была регрессия: раньше это кольцо + ховер-заливка);
- blur/прозрачность — только у «материалов» над контентом (шапка, модалки, поповеры, меню, уведомления, `user_dropdown`, `app_menu`, `notification_box`);
- `--element_background_disabled_2` / `--element_background_2` оставлены для совместимости, но заливками/кольцами не используются.

Рамка окна: `html` + `body { margin: 1px }` в `global_style.css`. У `html` фон обязан быть **непрозрачным** (`background: var(--main_background)` + `box-shadow: inset 0 0 0 1px var(--border_color)`): если красить `html` прямо в `--border_color`, полупрозрачный хайрлайн композитится с белым базовым канвасом окна и в тёмной теме вокруг приложения появляется **белая рамка**.

Осознанные исключения (не «сливаются», а задумано): `div.maket_nav` (sticky-материал макета), бейджи `badge_warning/success`, `chui_card` на подложке (карточка обязана отличаться от фона лишь слабо).

## Проверка

```bash
cd /home/dethjob/kodik_project/chuijs
THEME=light WAIT=9000 timeout 120 ./node_modules/.bin/electron --no-sandbox /tmp/maket_bg_probe.js 2>&1 | grep -v -E "GetVSyncParameters|ERROR:|\[info\]"
```
Ожидаемо (актуально на 10.09.2026): light `BOXES 42 BLENDING(<1.15) 7` (canvas 1, input 1, maket_nav 1.05, badge_warning 1.1, chui_card 1.12 ×2, badge_success 1.14); dark `BOXES 42 BLENDING(<1.15) 3` (canvas 1, hero_stat 1.1, maket_nav 1.14).

Периметр окна (скан всех пикселей кромки, `/tmp/ring_probe.js`, env `THEME`): light `209,209,214`, dark `41,41,41`, `RING_NEAR_WHITE 0 / 5000` — белых пикселей нет. Регресс: `/tmp/maket_hero_check.js`. `npm run lint` — 37 problems (16 errors, 21 warnings) — базовый уровень.

Правило макета: `app/views/maket.css` не переопределяет стили компонентов фреймворка.
