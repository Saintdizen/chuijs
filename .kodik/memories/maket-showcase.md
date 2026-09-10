---
title: "Витрина компонентов (app/views/0_maket.js)"
---

# Витрина компонентов chUiJS

Файлы: `app/views/0_maket.js` (~1290 строк, класс `Maket`, `exports.Maket`) + `app/views/maket.css` (`setStyles(__dirname + "/maket.css", "chUiJS_Maket")`). Покрывает все 56 UI-компонентов из `module.exports` в `index.js` (кроме `AcceptTypes` — это константа). Всего 27 разделов (`27 РАЗДЕЛОВ` / `56 КОМПОНЕНТОВ` / `68 ИКОНОК` в шапке, `ICON_NAMES.length` = 68).

## Структура

- Корень макета — свой класс `MaketBox` (обычный `<div>`): у `Page#page` приватный `#page` без className, к нему класс не повесить, а `ContentBlock` рендерит `<contentblock>`.
- `#catalogue()` — 27 разделов (`id`, `icon`, `title`, `desc`, `keywords`, `wide`, `render`); `wide` → `.maket_card_wide` (span 2, всего 7 таких).
- Хелперы: `div`, `wrap`, `mount`, `row`, `col`, `note`.
- Карточка раздела (`#card(section)`) — это компонент `Card` (`framework/components/chui_card`), id элемента = `maket_${section.id}` (у разделов «Card»/«Hero» — `maket_card`/`maket_hero`), тело — `card.getBody()`; `section.render(body)` обёрнут в try/catch → ошибка выводится в `.maket_error` + `Log.error`, раздел не теряется.
- Шапка страницы (`#hero()`) — компонент `Hero` (`framework/components/chui_hero`), первый ребёнок `.maket`; данные берутся из `#sections.length`, `COMPONENT_NAMES.length`, `ICON_NAMES.length`.
- Демо-разделы: `card` → `#cardDemo(body)`, `hero` → `#heroDemo(body)` (оба через `col`/`row` внутри тела карточки). Метод называется `#cardDemo`, а не `#cards`: в классе уже есть приватное поле `#cards`.
- Фильтр: `#filter(query)` переключает класс `maket_hidden` по `card.dataset.search`.

## Компоненты, рождённые из макета

### Card (`framework/components/chui_card/card.js` + `styles.css`, id стилей `chUiJS_Card`)
Теги `chui_card`, `card_head`, `card_icon`, `card_titles`, `card_title`, `card_description`, `card_body` — намеренно нестандартные, чтобы не пересекаться с CSS фреймворка (`p { width: max-content }` в `chui_paragraph`). Опции: `{id, title, description, icon, width, height, style, components}`; API: `getId/setId`, `getTitle/setTitle`, `getDescription/setDescription`, `getBody`, `setIcon`, `setWidth/setHeight/setStyle`, `add(...)`, `clear()`, `set()`. Шапка создаётся лениво и вставляется через `prepend`. `text-align: left` обязателен (страница лежит в `<center>`). Правило для абзаца: `chui_card card_body > p { align-self: stretch; width: -webkit-fill-available; }`.

### Hero (`framework/components/chui_hero/hero.js` + `styles.css`, id стилей `chUiJS_Hero`)
Теги `chui_hero`, `hero_head`, `hero_badge`, `hero_titles`, `hero_title`, `hero_description`, `hero_stats`, `hero_stat`, `hero_stat_value`, `hero_stat_label`. Опции: `{id, title, description, icon, stats: [{value, label}], style, width, height}`; API: `getId/setId`, `getTitle/setTitle`, `getDescription/setDescription`, `setIcon`, `setWidth/setHeight/setStyle`, `addStat(value, label)`, `clearStats()`, `set()`. Шапка и `hero_stats` создаются лениво (шапка через `prepend`). Иконка в бейдже рисуется `new Icon(icon, "28px")` (инлайн-размер сильнее CSS). `width: -webkit-fill-available` в самом компоненте — поэтому в flex-контейнерах с `align-items: flex-start` (тело карточки) шапка всё равно растягивается.

## Гочи вёрстки (проверено)

- **`AppLayout` кладёт страницу в HTML-элемент `<center>`** (`framework/appLayout/default/chui_app_layout.js:53,241` — `center.classList.add("header_padding", "test_scroll_track")`), поэтому `text-align: center` наследуется во всю страницу. В `.maket` и в компонентах нужен явный `text-align: left`.
- **Скроллится не `route_views`, а `center.header_padding`**. Для программной прокрутки/скриншотов использовать `document.querySelector('center.header_padding')`.
- **`Animation.fadeIn()` ставит `display: flex` любому элементу** (кроме `TABLE`), поэтому дети `card_body` с `align-items: flex-start` уходят в `max-content`. `Paragraph` — это `<p>` с `width: max-content`; лечится правилом в `chui_card/styles.css`.
- `.maket_row` задаёт `width: -webkit-fill-available` — внутри flex-wrap карточки могут растягиваться.
- `Spinner` даёт ложное «переполнение» по `scrollWidth` (~20-40 px). Визуально не проявляется.
- `chui_webview` имеет `height: 100%`, поэтому WebView нужна обёртка `.maket_frame` с фиксированной высотой (`260px`).
- Таблицу и графики оборачивать в `.maket_scroll_x` / `.maket_row`: `table { width: inherit }`, а canvas графика имеет `width: max-content`.

## Проверка

```bash
cd /home/dethjob/kodik_project/chuijs
timeout 90 ./node_modules/.bin/electron --no-sandbox /tmp/maket_hero_check.js
SHOT_OUT=/tmp/maket_final.png SHOT_WAIT=10000 timeout 90 ./node_modules/.bin/electron --no-sandbox /tmp/capture_app.js
```

Стенды (в `/tmp`, при необходимости воссоздать):
- `/tmp/maket_hero_check.js` — актуальный: `chui_hero` в шапке (порядок, состав, значения статистики), отсутствие legacy-классов `.maket_hero/.maket_stats/.maket_stat`, демо-секция `#maket_hero`, переполнение, фильтр по «шапка», скриншоты в `/tmp/maket_hero_out/`.
- `/tmp/capture_app.js` — один скриншот 1600×900; env `SHOT_OUT`, `SHOT_WAIT`, `SHOT_SCROLL`, `SHOT_FULL`.
- `/tmp/maket_shots.js` — серия скриншотов по секциям в `SHOT_DIR` + сбор ошибок консоли.
- `/tmp/maket_verify.js` — устарел (селектор `.maket_card`, классы `.maket_stat*`).
- `/tmp/maket_diag.js` — поиск скроллящихся элементов и `.maket_error`.

Ожидаемый вывод `maket_hero_check.js`: `HERO {found:true, order:0, head:"есть", icon:"есть", stats:[27 РАЗДЕЛОВ, 56 КОМПОНЕНТОВ, 68 ИКОНОК], legacy:0}`, `CARDS {sections:27, wide:7, errors:[], heroes:3, chips:27}`, `DEMO [full(2 stats), plain(0)]`, `OVERFLOW []`, `ERRORS []`.

Обязателен `--no-sandbox`. `main.js` не используется, стенд сам вызывает `main.start(...)`. Базовый уровень `npm run lint` — 37 problems (16 errors, 21 warnings).

## Гочи инструментов

- `grep` с контекстом дублировал строки (артефакт) — при подозрении на дубли проверять файл через `read_file`.
- `executeJavaScript`: строка с `||` вне скобок ломает цепочку `.scrollHeight` → `Error: An object could not be cloned.` Оборачивать в `(...)`.
