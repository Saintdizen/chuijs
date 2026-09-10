---
title: "Шапка приложения (#header): структура и стиль"
---

# Шапка приложения (`<header id="header">`)

## Где живёт

- `framework/appLayout/default/chui_app_layout.js`: `id="header"` ставится **ровно один раз** — `:108` в конструкторе `Header` (`document.createElement("header")` `:102`); в DOM вешается в `AppLayout` `:382`.
- По id элемент никто не ищет: ни одного `getElementById("header")` в проекте (ищут только `header_toolbar`, `page_name` — `:37-38`, `:225-226`). Стили — **тег-селектор** `header` (`global_style.css:159`). id — публичный якорь для приклада и стендов.
- Дерево: `#header` (flex column, `align-items: start`, `justify-content: space-between`) → `#header_main` (drag) → `header_left_box` (`app_menu_button`, `page_name`), `header_right_box` (`header_button`, `notification_button`), `wc_box` (минимизировать, развернуть, закрыть) → `#header_toolbar` (сюда `Route.go` кладёт `page.getMenuBar()`, `:41-52`).

## Высота и жёсткие константы (главная ловушка)

- `#header_main` 45px + компактный `#header_toolbar` 35px = **80px**, если у страницы есть меню-бар; без него ≈ 47px. (До компакт-режима меню-бара было 51px и 96px.)
- Под это захардкожено: `center { padding-top: 47px }` (`global_style.css:187`) — привязано к `#header_main`, не менялось; `.header_padding { padding-top: 80px }` (`framework/modules/chui_page/styles.css`, с комментарием «45px (#header_main) + 35px (компактный меню-бар)»); `notification_panel { top: 46px }` (`:199`), `app_menu`/`notification_box` → `margin: calc(47px + …)` (`:221`, `:239`) — тоже к `#header_main`, не менялись. При смене высоты полосы править согласованно `.header_padding` + комментарий.
- `AppMenu` (`chui_app_layout.js:163,166`) и `NotificationBox` (`:325,328`) читают `header.set().style.height`, но inline-высоту никто не выставляет → на практике падают на CSS-константу 47px. Pre-existing: `app_menu`/`notification_box` имеют `z-index: 1000` против `999` у `header`, то есть при меню-баре ящик/меню заезжает под toolbar и рисуется поверх него.

## Компактный меню-бар (правки 10.09.2026)

`framework/components/chui_menu_bar/styles.css` — локальные переопределения на корне полосы `chui_menu_bar_main`:

- `--main_padding: 5px 10px`, `--test_padding: 5px` (общесистемные `8px 13px` / `8px` уменьшены **только** внутри полосы, глобальный `:root` не тронут). Токены нужны потому, что `Button` пишет `padding: var(--test_padding)` **инлайном** — стилями его не перебить.
- `padding: 3px`, `gap: 2px`, `align-items: center`.
- Новое правило `chui_menu_bar_main > chui_button, menu_bar_drop_down_main { margin: 0 }`: у `Button` был `margin: var(--margin)` = 6px, у `menu_bar_drop_down_main` — `margin: auto 6px` (давало 7px сверху/снизу).
- `menu_bar_drop_down_main`: удалён `margin: auto 6px`; `chui_menu_bar_button { margin: 2px }` → `margin: 0`.
- Тег `chui_menu_bar_button` **не создаётся нигде** (`menu_bar.js` делает только `menu_bar_drop_down_button`) — правило мёртвое, оставлено как есть.

Следствие: полоса 51px → 35px (её высоту задаёт иконочная кнопка 29px + `padding: 3px`), шапка 97px → 81px, `.header_padding` 96px → 80px.

## Стиль кнопок шапки (правки 10.09.2026)

- Ховер `header_button` / `notification_button` / `app_menu_button` — **нейтральная** `--element_background` (+ `:active` → `--element_background_hover`), `transition` на background-color/color; синий `--blue_prime_background` остался только у «открытых» состояний `.app_menu_button_active` / `.notification_button_active`. Удалены правила `header_button:hover header_button_title` и `…:hover chui_icon` (белый текст при ховере больше не нужен).
- Кнопки окна — macOS traffic lights: токены `--wc_close/--wc_minimize/--wc_maximize` в `main_theme_style.css:52-54` (light) и `:111-113` (dark, те же цвета), заливка в `global_style.css:569-599`; `border-radius: var(--radius_circle)`, `padding: 5px`, без `box-shadow` и без ховер-смены фона. Символ: `wc_close/maximize/minimize chui_icon { color: rgba(0,0,0,.55); opacity: 0 }` → `wc_box:hover … chui_icon { opacity: 1 }`. Есть `:focus-visible` у всех кнопок шапки.
- Из правила `header` удалён `background-blend-mode: overlay` (в плоском стиле лишний).

## Проверка

```bash
cd /home/dethmond/kodik_projects/chuijs
for T in light dark; do THEME=$T WAIT=9000 timeout 120 ./node_modules/.bin/electron --no-sandbox /tmp/menubar_probe.js; done
npm run lint   # 36 problems (16 errors, 20 warnings) — база
```

Стенд `/tmp/menubar_probe.js` (единственный живой из «шапочных»; `header_probe.js` и `maket_hero_check.js` в `/tmp` больше нет). env `ROOT` (по умолчанию текущий корень), `OUT_DIR` (`/tmp/menubar_out`), `WAIT` (9000), `THEME` (`light`/`dark`). Сам вызывает `new Main({...})` + `main.start({hideOnClose:false})`, затем дважды перебивает `nativeTheme.themeSource = THEME` (200мс и 1200мс — иначе `Main.start` вернёт "system"). Печатает `THEME` / `MENUBAR` / `DROPDOWN` / `ERRORS`, пишет `menubar_<THEME>.png` (1600×110) и `menubar_dd_<THEME>.png` (900×400 после клика по первому `menu_bar_drop_down_button`).

Ожидаемо (10.09.2026, обе темы): `header` 1598×81 (80 + 1px border), `#header_main` 45px, `#header_toolbar` 294×35 (y=46), `menu_bar_main` 294×35 `padding: 3px`, `dd_button` h 27 `padding: 5px 10px` ширины `[56,70,46,78]`, иконочная кнопка 29×29 `padding: 5px`, `centerPaddingTop "80px"`, `headerBottom 82` / `maketTop 87` / `firstContentTop 89`, `DROPDOWN {"open":"flex","buttonBottom":77,"ddTop":77,"ddH":122,"ddW":130}` (дропдаун прижат вплотную под кнопку, без обрезки), `ERRORS []`.

## Гочи

- `grep` по контексту дублирует строки (в выводе появляются лишние `}`) — сверять `read_file`.
- В `executeJavaScript` строка с `||` вне скобок ломает цепочку свойств → `An object could not be cloned`.
- Абсолютные пути в старых заметках (`/home/dethjob/kodik_project/chuijs`) устарели — рабочая копия `/home/dethmond/kodik_projects/chuijs`.
