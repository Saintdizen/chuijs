---
title: "MultiComboBox: чипы в строке (token-поле)"
---

# MultiComboBox — чипы в одну строку

`framework/components/chui_inputs/chui_multi_combo_box/` — выбранные значения идут подряд по строке с переносом при нехватке места; поле ввода — **последний элемент внутри `multicombobox_options`** (token-поле как в Apple Mail). Файлы: `multi_combo_box.js`, `styles.css`.

## Контракт разметки

- DOM: `chui_multicombobox` (flex column) → `multicombobox` (flex row) → `multicombobox_options` (`flex: 1 1 auto`, row, wrap, `min-width: 0`, `overflow: hidden`) → чипы `multicombobox_option_added_main` + **`input.multicombobox_input` последним**; далее `multicombo_button_open` (~43px) и `multicombobox_dropdown` (absolute).
- Вставка чипа — только `this.#MultiComboBox_options.insertBefore(test_main, this.#input)` (2 места: `addOptionsWithSections` и `addOptions`). `appendChild` вернёт баг «чипы под полем ввода».
- Клик по `multicombobox` открывает дропдаун при `closest('multicombobox_dropdown') === null && closest('multicombobox_option_added_main') === null` (не `parentNode === #MultiComboBox_second`: после переноса ввода клик по полю иначе перестаёт открывать).
- `clear()` обязан удалять только чипы: `[...childNodes].filter(n => n !== this.#input).forEach(n => n.remove())`. Старое `innerHTML = ""` уничтожало `#input` вместе со слушателями (поле ввода теперь внутри контейнера).
- `test_body.title` = текст чипа — способ прочитать обрезанный ellipsis-текст.

## CSS (ключевые значения)

`multicombobox_options { flex: 1 1 auto; flex-direction: row; flex-wrap: wrap; align-items: center; min-width: 0; overflow: hidden }`; ввод `flex: 1 1 40px; min-width: 40px`; чип `margin: 2px; min-width: 0; max-width: calc(100% - 6px)`; body `padding: 5px 6px; flex: 0 1 auto; min-width: 0; text-overflow: ellipsis; white-space: nowrap`; крестик `flex: 0 0 auto`.

Ширина добывается плотными отступами чипа, **не** ужатием стрелки/ввода. Замеры: поле 300px, `multicombobox_options` 255px, стрелка 43px. Пробованные тупики: `flex: 1 1 0; min-width: 0` у ввода (не помог), `grow90`/`cap50`/`nowrap` (обрезка текста).

## Проверка

```bash
cd /home/dethjob/kodik_project/chuijs
MCB_OUT=/tmp/mcb_row4.png timeout 180 ./node_modules/.bin/electron --no-sandbox /tmp/mcb_check.js
timeout 180 ./node_modules/.bin/electron --no-sandbox /tmp/mcb_maket_check.js
timeout 180 ./node_modules/.bin/electron --no-sandbox /tmp/maket_hero_check.js
```

- `/tmp/mcb_check.js` — 5 полей 300px (2 коротких, 4 коротких, длинное+короткое, пустое, выключенное) + `clearCheck`. Ожидание: у всех `rows 1` или `2` при `inlineSequence true` и `overflowsField false`; `clearCheck {inputAlive:true, chipsAfter:0, valueAfter:0, checkedAfter:0, rowAfter:true, dropdownOpened:true}`; `hostScrollWidth == hostClientWidth`; `ERRORS []`.
- `/tmp/mcb_maket_check.js` — MultiComboBox витрины (`0_maket.js`): `openByInputClick true`, `openByChipClick false`, `rows 1`, чипы 117/121px, `ERRORS []`.
- `/tmp/maket_hero_check.js` — регресс витрины: `HERO stats [27,56,68], legacy 0`, `CARDS {sections:27, wide:7, errors:[]}`, `OVERFLOW []`, `ERRORS []`.

`npm run lint` — 37 problems (16 errors, 21 warnings), базовый уровень.

## Не тронутые pre-existing баги компонента

Повторное навешивание `input`-слушателя в каждом `addOptions*`; вечный `window`-слушатель в конструкторе; `checkbox_input.id = opt.title` / `test_main.id = opt.title` (дубли при одинаковых title); `addOptionsWithSections` в ветке `else` удаляет только через `#removeOptionById`.
