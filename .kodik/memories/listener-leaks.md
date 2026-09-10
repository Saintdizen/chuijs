---
title: "Утечки слушателей (chuijs)"
---

# Утечки слушателей

Системная проблема: в `framework/` ~204 `addEventListener` против ~15 `removeEventListener`; `removeListener`/`.off` не используются нигде, `ipcMain.on`/`ipcRenderer.on` (12 шт.) не снимаются.

## Уже исправлено (паттерн: именованное приватное поле-стрелка + снятие в close)

- `chui_modal/modal.js` — `#resizeEvent` снимается в `close()` (раньше анонимный `resize` в `open()` копился).
- `chui_menu_bar/menu_bar.js` — `window` click-слушатель вешается в `#open()` и снимается в `#close()` (раньше жил от конструктора).
- `chui_inputs/chui_combo_box/combo_box.js` — `#window_click_event` вешается при открытии дропдауна, снимается в обработчике (раньше анонимный навсегда в конструкторе).

## Осталось (тот же паттерн применим)

- `chui_inputs/chui_select_box/select_box.js` и `chui_multi_combo_box/multi_combo_box.js` — постоянный `window`-слушатель + дублирующийся `input`-слушатель при каждом `addOptions*`.
- `chui_app_layout.js:389-405` — 8 `ipcRenderer.on`, вложенных друг в друга; `:95` — накопительный `chui_resizable_false`.
- `index.js:325,333,374` — `ipcMain.on` без `off`.
- `chui_inputs/chui_date/date.js:62-66` — `window` click без снятия.

## Проверка

Поведенческий тест на заглушках DOM, сравнивающий число window-слушателей до/после: `ROOT=<корень> node /tmp/leak_test.js` (заглушки: `El`, `win._l` — Map с дедупликацией по типу+функции, `document.getElementById` ищет по `.id`). Даёт 3/16 PASS на старом коде и 16/16 на исправленном.
