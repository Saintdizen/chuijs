---
title: "Палитра Apple flat (chuijs)"
---

# Палитра Apple flat

`framework/appLayout/default/main_theme_style.css` — iOS/macOS «grouped»:
- `--main_background` — подложка страницы (`#f2f2f7` light / `#000000` dark);
- `--element_background_2` — карточки/контент (`#ffffff` / `#1c1c1e`);
- `--element_background` = `--button_background` — полупрозрачные systemFill `rgba(120,120,128,0.2)` light / `0.3` dark — читаются и на белой карточке, и на серой подложке;
- `--element_background_hover` — плотнее (`0.32` / `0.45`);
- `--modal_background` — материал модалок (`rgba(250,250,252,0.78)` light / `rgba(30,30,32,0.78)` dark);
- `--modal_scrim` — занавес под всплывающим слоем (`rgba(0,0,0,0.18)` light / `0.5` dark), добавлен 10.09.2026. Обязан **отличаться** от `--modal_background`: `--header_background` (`0.72`) и `--modal_background` (`0.78`) почти совпадают по цвету, и материал модалки на такой подложке не читается;
- хайрлайны — только через `--border_color` (НЕ через `--element_background_2`, это была регрессия: раньше это кольцо + ховер-заливка);
- blur/прозрачность — только у «материалов» над контентом (шапка, модалки, поповеры, меню, уведомления, `user_dropdown`, `app_menu`, `notification_box`, `chui_popup`);
- `--element_background_disabled_2` / `--element_background_2` оставлены для совместимости, но заливками/кольцами не используются.

Рамка окна: `html` + `body { margin: 1px }` в `global_style.css`. У `html` фон обязан быть **непрозрачным** (`background: var(--main_background)` + `box-shadow: inset 0 0 0 1px var(--border_color)`): если красить `html` прямо в `--border_color`, полупрозрачный хайрлайн композитится с белым базовым канвасом окна и в тёмной теме вокруг приложения появляется **белая рамка**.

Осознанные исключения (не «сливаются», а задумано): `div.maket_nav` (sticky-материал макета), бейджи `badge_warning/success`, `chui_card` на подложке (карточка обязана отличаться от фона лишь слабо).

## Popup = материал (10.09.2026)

`framework/components/chui_popups/styles.css` (101 строка; `popups.js` не менялся — DOM и классы уже были верными):
- `chui_popup` (занавес) → `background-color: var(--modal_scrim)`;
- `popup_content` → `--radius_md` (12px), `var(--modal_background)`, `var(--box_shadow_modal)`, `border: 1px solid var(--border_color)`, `backdrop-filter: var(--global_blur)` — ровно как `chui_dialog`;
- `popup_body` → `align-items: stretch` (было `center`): поле ввода в prompt заполняет карточку, центрирование текста остаётся через `text-align: center` у `popup_title`/`popup_message`; `popup_message` → `font-weight: 400` (было 500);
- три дублированных блока кнопок (`popup_button_ok/accept/cancel`) свёрнуты в один селектор-список как `.chui_button`: `var(--button_background)` + `1px solid var(--button_border_color)`, `padding: var(--main_padding)`, `margin: var(--margin)`, hover на `--button_background_hover`/`--button_border_color_hover` (**красный hover «Отмены» убран** — красный в фреймворке зарезервирован под кнопку закрытия окна), active → `--element_background_prime`.

## Проверка

```bash
cd /home/dethjob/kodik_project/chuijs
THEME=light WAIT=9000 timeout 120 ./node_modules/.bin/electron --no-sandbox /tmp/maket_bg_probe.js 2>&1 | grep -v -E "GetVSyncParameters|ERROR:|\[info\]"
for T in light dark; do THEME=$T WAIT=9000 timeout 150 ./node_modules/.bin/electron --no-sandbox /tmp/popup_probe.js 2>&1 | grep -v -E "GetVSyncParameters|ERROR:|\[info\]|libva|gbm|Fontconfig|MESA|dri"; done
```
Ожидаемо (актуально на 10.09.2026): light `BOXES 42 BLENDING(<1.15) 7` (canvas 1, input 1, maket_nav 1.05, badge_warning 1.1, chui_card 1.12 ×2, badge_success 1.14); dark `BOXES 42 BLENDING(<1.15) 3` (canvas 1, hero_stat 1.1, maket_nav 1.14).

`/tmp/popup_probe.js` — эталоны того же слоя z-index 1000 + медианный пиксельный замер по кромке карточки (`R.x ± 6`, строки от `R.y+8` до `R.y+R.h-8`; замер по центру карточки попадает в текст заголовка и врёт). Ожидаемо: `CLICK dialog/alert/confirm/prompt ok:BUTTON`, `content` идентичен `refDialog`, `btn*` идентичны `refButton` (кроме `padding 8px 13px` вместо `8px`), `ERRORS []`, кромочный контраст light `92/92/88`, dark `9/9/10` (alert/confirm/prompt).

**Тёмный кромочный контраст ~9 — это не артефакт, а физика палитры:** `0.78×30 + 0.22×20 ≈ 28` внутри против `20` снаружи, и то же самое даёт `chui_dialog` с теми же токенами. В light контраст 92 за счёт того, что занавес сильно гасит светлую страницу (`242 → 177`). `00_dialog` в пробе показывает `rect 0×0` — `document.querySelector('chui_dialog')` находит первый (закрытый) диалог витрины, поэтому пиксельный замер диалога недоступен; сравнение идёт по вычисленным стилям.

Периметр окна (скан всех пикселей кромки, `/tmp/ring_probe.js`, env `THEME`): light `209,209,214`, dark `41,41,41`, `RING_NEAR_WHITE 0 / 5000` — белых пикселей нет. Регресс: `/tmp/maket_hero_check.js`. `npm run lint` — 37 problems (16 errors, 21 warnings) — базовый уровень.

Правило макета: `app/views/maket.css` не переопределяет стили компонентов фреймворка.
