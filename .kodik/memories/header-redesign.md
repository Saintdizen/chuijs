---
title: "Шапка приложения (#header): структура и стиль"
---

# Шапка приложения (`<header id="header">`)

## Где живёт

- `framework/appLayout/default/chui_app_layout.js`: `id="header"` ставится **ровно один раз** — `:108` в конструкторе `Header` (`document.createElement("header")` `:102`); в DOM вешается в `AppLayout` `:382`.
- По id элемент никто не ищет: ни одного `getElementById("header")` в проекте (ищут только `header_toolbar`, `page_name` — `:37-38`, `:225-226`). Стили — **тег-селектор** `header` (`global_style.css:159`). id — публичный якорь для приклада и стендов.
- Дерево: `#header` (flex column, `align-items: start`, `justify-content: space-between`) → `#header_main` (drag) → `header_left_box` (`app_menu_button`, `page_name`), `header_right_box` (`header_button`, `notification_button`), `wc_box` (минимизировать, развернуть, закрыть) → `#header_toolbar` (сюда `Route.go` кладёт `page.getMenuBar()`, `:41-52`).

## Высота и жёсткие константы (главная ловушка)

- `#header_main` 45px + `#header_toolbar` 51px = **96px**, если у страницы есть меню-бар; без него ≈ 47px.
- Под это захардкожено: `center { padding-top: 47px }` (`global_style.css:187`), `.header_padding { padding-top: 96px }` (`framework/modules/chui_page/styles.css:8-9`), `notification_panel { top: 46px }` (`:199`), `app_menu`/`notification_box` → `margin: calc(47px + …)` (`:221`, `:239`). При смене высоты править согласованно.
- `AppMenu` (`chui_app_layout.js:163,166`) и `NotificationBox` (`:325,328`) читают `header.set().style.height`, но inline-высоту никто не выставляет → на практике падают на CSS-константу 47px. Pre-existing: `app_menu`/`notification_box` имеют `z-index: 1000` против `999` у `header`, то есть при меню-баре ящик/меню заезжает под toolbar и рисуется поверх него.

## Стиль (правки 10.09.2026, uncommitted)

- Ховер `header_button` / `notification_button` / `app_menu_button` — **нейтральная** `--element_background` (+ `:active` → `--element_background_hover`), `transition` на background-color/color; синий `--blue_prime_background` остался только у «открытых» состояний `.app_menu_button_active` / `.notification_button_active`. Удалены правила `header_button:hover header_button_title` и `…:hover chui_icon` (белый текст при ховере больше не нужен).
- Кнопки окна — macOS traffic lights: токены `--wc_close/--wc_minimize/--wc_maximize` в `main_theme_style.css:52-54` (light) и `:111-113` (dark, те же цвета), заливка в `global_style.css:569-599`; `border-radius: var(--radius_circle)`, `padding: 5px`, без `box-shadow` и без ховер-смены фона. Символ: `wc_close/maximize/minimize chui_icon { color: rgba(0,0,0,.55); opacity: 0 }` → `wc_box:hover … chui_icon { opacity: 1 }`. Есть `:focus-visible` у всех кнопок шапки.
- Из правила `header` удалён `background-blend-mode: overlay` (в плоском стиле лишний).

## Проверка

```bash
cd /home/dethjob/kodik_project/chuijs
for T in light dark; do THEME=$T WAIT=9000 timeout 180 ./node_modules/.bin/electron --no-sandbox /tmp/header_probe.js; done
timeout 180 ./node_modules/.bin/electron --no-sandbox /tmp/maket_hero_check.js
npm run lint   # 37 problems (16 errors, 21 warnings) — база
```

Стенд `/tmp/header_probe.js` (env `THEME`, `HEADER_DIR`=/tmp/header_out, `WAIT`): `HEADER` (геометрия+computed для `#header`, `#header_main`, `#header_toolbar`, `header_left_box`, `header_right_box`, `wc_box`, `app_menu_button`, `page_name`, `notification_button`, `header_button`), `DOTS` (кнопки окна + пиксель по центру), `BITMAP {f}` (devicePixelRatio, честно из `window.innerWidth`), `HOVER`, `DOT_ICONS` (opacity символа до/после наведения на `wc_box`), `ERRORS`; пишет `header_<THEME>.png` (кроп 1600×72) и `header_full_<THEME>.png`.

Ожидаемо (10.09.2026, обе темы, `f: 1`): `#header` 1598×97 / height 96px / radius `0 0 10 10`; `wc_box` {1491,5,102,38} padding `0px 3px`, margin `0px 6px`; точки 26×26 при y=11, `padding: 5px`, `border-radius: 50%`, `box-shadow: none`, фон = цвет точки, пиксель совпадает точно — `wc_close rgb(255,95,87)`, `wc_maximize rgb(40,200,64)`, `wc_minimize rgb(254,188,46)`; HOVER нейтральный (`rgba(120,120,128,0.2)` light / `0.3` dark), у `wc_close` фон не меняется; `DOT_ICONS before 0 → after 1` у всех трёх; `ERRORS []`. Прочее неизменно: `#header_main` 45px, `#header_toolbar` 374×51, `app_menu_button` 33×33 (padding 8, margin 6), `page_name` 190×33, `notification_button` 33×33, `header_button` 91×33 (padding `8px 13px`).

## Гочи

- `grep` по контексту дублирует строки (в выводе появляются лишние `}`) — сверять `read_file`.
- В `executeJavaScript` строка с `||` вне скобок ломает цепочку свойств → `An object could not be cloned`.
- Старый баг стенда исправлен: `const f = size.width / data[...].style ? … : 1` всегда давала 1 и `innerWidthOf` был заглушкой — теперь `f = size.width / window.innerWidth`.
