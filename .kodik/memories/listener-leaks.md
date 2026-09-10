---
title: "Утечки слушателей (chuijs)"
---

# Утечки слушателей

Системная проблема: в `framework/` 204 `addEventListener` против 28 `removeEventListener`; `ipcMain.on`/`ipcRenderer.on` не снимаются.

Ключ: утекают только слушатели на внешнем корне (`window`/`document`), который держит компонент. Слушатели на собственных элементах компонента (`#input` focus/blur/input, опции) умирают вместе с элементом — **но только если сам узел не переиспользуется**. Если узел долгоживущий (`#content` в `Tabs`, `panel` в `TreeView`), слушатель внутри повторяемого действия накапливается.

## Паттерн фикса

Именованное приватное поле-стрелка `#window_click_event = (event) => {...}` + приватный `#closeDropdown()`:
- `window.addEventListener('click', this.#window_click_event)` — только в ветке открытия дропдауна;
- `window.removeEventListener('click', this.#window_click_event)` — в `#closeDropdown()`, туда же fadeOut (и, где было, сброс открытого состояния).

Поля-стрелки можно объявлять ниже конструктора: инициализаторы полей выполняются до тела конструктора (так уже в `combo_box.js`).

## Исправлено (10.09.2026)

- `chui_modal/modal.js` — `#resizeEvent` снимается в `close()`.
- `chui_menu_bar/menu_bar.js` — window click вешается в `#open()`, снимается в `#close()`.
- `chui_inputs/chui_combo_box/combo_box.js` — `#window_click_event`.
- `chui_inputs/chui_select_box/select_box.js` — `#window_click_event` + `#closeDropdown()` (снять слушатель, `#setOpenState(false)`, fadeOut).
- `chui_inputs/chui_multi_combo_box/multi_combo_box.js` — `#window_click_event`; фильтр ввода вынесен в `#filter_sections_event`/`#filter_options_event` и вешается remove-then-add (раньше каждый `addOptions*` добавлял ещё один `input`-обработчик, фильтр срабатывал N раз).
- `chui_inputs/chui_date/date.js` — `#window_click_event` + `#closeDropdown()`; клик по дню календаря тоже закрывает через `#closeDropdown()` (раньше fadeOut без снятия слушателя).
- `chui_text_editor/text_editor_panel.js` (`TextEditorSelects`) — тот же паттерн.
- `chui_app_layout.js` `UserProfile` — тот же паттерн (ветка «уже открыт» в click по кнопке тоже идёт через `#closeDropdown()`).
- `chui_app_layout.js` `WindowControls.set()` — поле `#resizable_listener_bound` гасит повторный `ipcRenderer.on("chui_resizable_false")` (`set()` зовётся из конструктора `Header` и из `addWC`).
- `index.js` `enableAutoUpdateApp` — `ipcMain.removeAllListeners("updateInstallConfirm")` перед повторной регистрацией.

### Приклад на переиспользуемых узлах (10.09.2026, продолжение)

- `chui_tabs/chui_tabs.js` — `#content` переиспользуется при каждом переключении вкладки: анонимный `animationend` в обработчике клика и в `#setDefault` → именованное поле `#animationend_event` + remove-then-add.
- `chui_tree_view/tree_view.js` — панель переиспользуется при каждом разворачивании: анонимный `transitionend` внутри `setTimeout` → `transitionEndEvent` (действует через `event.currentTarget`, поэтому не зависит от shadowing `panel`) + remove-then-add.
- `chui_modal/modal.js` фикс НЕ требовался: `window.addEventListener("resize", this.#resizeEvent)` и `#closeOutsideEvent` навешиваются с одной и той же ссылкой на функцию — DOM дедуплицирует одинаковые (тип+функция+capture), накопления нет.

После фикса все 8 `window.addEventListener('click', ...)` в `framework/` находятся только в ветках открытия дропдауна.

## Осталось (осознанно не трогали)

- `chui_app_layout.js:389-405` — 8 вложенных `ipcRenderer.on` в конструкторе `AppLayout`: регистрируются один раз на жизнь приложения, накопления нет; для снятия нужен destroy-путь, которого у `AppLayout` нет.
- `index.js` — `ipcMain.on("show_system_notification")` внутри `whenReady` (один раз) и `ipcMain.on("SEND_LOG_TEXT")` в конструкторе `Main` (один раз): синглтоны, не утечка.
- `autoUpdater.on('update-downloaded')` в `enableAutoUpdateApp` — копится при повторном вызове, но `removeAllListeners` для него рискован (внутренности electron-updater).

## Проверка

```bash
cd /home/dethmond/kodik_projects/chuijs
timeout 120 ./node_modules/.bin/electron --no-sandbox /tmp/leak_fix_check.js
npm run lint   # 36 problems (16 errors, 20 warnings) — база
```

`/tmp/leak_fix_check.js` (10.09.2026): в рендерере подменяет `EventTarget.prototype.addEventListener`/`removeEventListener`, считает net по паре (элемент, тип). Строит `Tabs` (2 вкладки) и переключает их 20 раз, затем `TreeView.ExpandButton` и 10 раз сворачивает/разворачивает. Ожидание: `tabsAfter {add:21, remove:21, net:1}`, `treeAfter {add:5, remove:5, net:1}`, `tabsText:"a1"`, `tabsCount:2`, `treeMaxHeight:""`, `siblingOk:true`, `pageErrors:[]`. До фикса те же сценарии давали `{net:21, remove:0}` и `{net:5, remove:0}`.

Старые стенды `/tmp/leak_check.js`, `/tmp/leak_test.js`, `/tmp/scan_app.js`, `/tmp/maket_hero_check.js`, `/tmp/ws_check*.js` в `/tmp` больше не существуют — не полагаться на них, при необходимости воссоздавать.
