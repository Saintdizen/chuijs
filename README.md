# chuijs
### CHROME_SANDBOX FIX
```shell
cd node_modules/electron/dist && sudo chown root chrome-sandbox && sudo chmod 4755 chrome-sandbox
```
### Структура
#### exampleApp / app / views / main.js
```javascript
const { Page, Button, TextInput, Notification, Log } = require('chuijs');
class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Сказать привет!');
        this.setMain(false)

        let name = new TextInput({
            title: 'Введите ваше имя',
            placeholder: 'Введите ваше имя',
            required: false
        });
        let hello = new Button({
            title: "Сказать привет!",
            clickEvent: () => {
                if (name.getValue() !== "") {
                    new Notification({
                        title: `Привет, ${name.getValue()}!`, text: `Привет, ${name.getValue()}!`,
                        style: Notification.STYLE.SUCCESS, showTime: 5000
                    }).show();
                } else {
                    new Notification({
                        title: `Привет мир!`, text: `Привет мир!`,
                        style: Notification.STYLE.SUCCESS, showTime: 5000
                    }).show();
                }
            }
        })
        this.add(name, hello)
    }
}
exports.MainPage = MainPage
```
#### exampleApp / app / app.js
```javascript
/** RENDERER ПРОЦЕСС */
/** ИМПОРТЫ */
const { AppLayout, render, Log } = require('chuijs');
/** СТРАНИЦЫ */
const { MainPage } = require('../app/views/main');
class App extends AppLayout {
    constructor() {
        super();
        /** РОУТЫ */
        this.setRoute(new MainPage());
    }
}
render(() => new App()).catch(err => Log.error(err))
```
`render(callback)` возвращает `Promise`, который резолвится после `DOMContentLoaded` (или сразу, если документ уже загружен) результатом `callback` и реджектится его ошибкой.
#### exampleApp / main.js
```javascript
/** main.js */
const { Main, MenuItem, path, App } = require('chuijs');
const main = new Main({
    name: "exampleApp",
    // размеры окна задаются вложенным объектом sizes
    sizes: {
        width: 1366,
        height: 768,
        minWidth: 960,
        minHeight: 540
    },
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    // папка загрузок (по умолчанию App.downloadsPath())
    paths: {
        downloadPath: path.join(App.userDataPath(), "downloads")
    }
    /** icon: `${__dirname}/resources/icons/app/icon.png` */
});
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().help(`exampleApp`),
        new MenuItem().button('Консоль разработчика', () => main.toggleDevTools()),
        new MenuItem().separator(),
        new MenuItem().quit("Выход")
    ]
})
```

> `Main` — обычный класс, а не singleton: конструктор только сохраняет опции
> и настраивает `app.commandLine`. Окно создаётся в `start()` (внутри `app.whenReady()`),
> поэтому окно доступно через `main.getWindow()` только после старта.
#### Download Session в main.js
```javascript
const { App } = require('chuijs');
App.get().on('session-created', (session) => {
    session.on('will-download', (e, item, contents) => {
        // ...
    });
});
```
#### TelegramBot API
```javascript
const { TelegramBot } = require('chuijs');
let bot = new TelegramBot("token");
bot.setToken("token");

// Функции
async function run() {
    await bot.getMe();
    await bot.getUpdates();
    await bot.getChat("id");
    /* ... */
}
```
### Модули

Инфраструктура и утилиты из корня пакета: `const { Main, MenuItem, Log, path } = require('chuijs');`

#### `Main`
Создаёт окно, трей и управляет жизненным циклом приложения.

```javascript
const { Main, MenuItem, App } = require('chuijs');
const main = new Main({
    name: 'exampleApp',
    sizes: { width: 1366, height: 768, minWidth: 960, minHeight: 540 },
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    paths: { downloadPath: path.join(App.userDataPath(), 'downloads') }
});
main.start({ hideOnClose: false, tray: [new MenuItem().quit('Выход')] });
```

Опции конструктора: `name`, `sizes {width, height, minWidth, minHeight}`, `render`, `devTools`,
`webSecurity`, `resizable`, `paths {downloadPath}`, `icon`. Если `icon` не передан, `Main` сам
подставляет иконку приложения по умолчанию.
`start()` принимает `{hideOnClose, globalMenu, tray, extensions}` и создаёт окно внутри `app.whenReady()`.
API: `getWindow()`, `toggleDevTools()`, `stop()`, `restart()`, `enableAutoUpdateApp(interval)`,
`sendDownload(title, body)`, `sendDownloadUpdate(title, body)`, `sendDownloadComplete(title, body)`,
`sendDownloadError(title, body)`.

#### `App`
Обёртка над `app` Electron.

```javascript
const { App } = require('chuijs');
App.get();             // app
App.getSession();      // session
App.getWebContents();  // webContents
```

#### `App.*Path()`
Статические системные пути (все возвращают строку).

```javascript
const { App } = require('chuijs');
App.userDataPath();     // .../AppData/<name>
App.downloadsPath();
App.logsPath();
```

Полный список: `homePath()`, `appDataPath()`, `userDataPath()`, `sessionDataPath()`, `logsPath()`, `tempPath()`, `exePath()`, `modulePath()`, `desktopPath()`, `documentsPath()`, `downloadsPath()`, `musicPath()`, `picturesPath()`, `videosPath()`, `recentPath()`, `crashDumpsPath()`.

#### `Log`
Пишет в `userData/logs/app_<date>.log`.

```javascript
Log.info('сообщение');
Log.error(new Error('что-то пошло не так'));
```

Из renderer-процесса вызов уходит в main через `ipcRenderer.send("SEND_LOG_TEXT", ...)`.

#### `sleep`, `render`, `formatBytes`
Утилиты из `chui_functions`.

```javascript
await sleep(1000);                              // пауза, мс
render(() => new App()).catch(err => Log.error(err));  // точка входа renderer
formatBytes(1536);                              // "1.5 KiB"
```

`render(callback)` ждёт `DOMContentLoaded` и резолвится результатом `callback`.

#### Иконка приложения по умолчанию
`getDefaultIcon()` объявлена во внутреннем модуле `framework/modules/chui_functions` и
**наружу не реэкспортируется**: `require('chuijs').getDefaultIcon` — это `undefined`.
`Main` вызывает её сам, если опция `icon` не задана (на macOS результат дополнительно
прогоняется через `Main.#resizeIconTray()`). Свой путь задаётся опцией `icon`:

```javascript
new Main({ name: 'app', icon: `${__dirname}/resources/icon.png` });
```

#### `MenuItem`
Пункты меню трея и глобального меню (цепочка из 45 методов: `button`, `submenu`, `radio`,
`checkbox`, `help`, `quit`, `appMenu`, `fileMenu`, `editMenu`, `viewMenu`, `windowMenu` и др.).

```javascript
new MenuItem().help('exampleApp');
new MenuItem().button('Консоль разработчика', () => main.toggleDevTools());
new MenuItem().separator();
new MenuItem().submenu('Ещё', [new MenuItem().quit('Выход')]);
new MenuItem().quit('Выход');
```

#### `TelegramBot`
Обёртка над Telegram Bot HTTP API (26 методов).

```javascript
const bot = new TelegramBot('token');
bot.setToken('token');
await bot.getMe();
await bot.sendMessage({ chat_id: '123', text: 'привет' });
```

#### Реэкспорт Electron и зависимостей
Доступны прямо из пакета, без отдельного `require`:

```javascript
const { BrowserWindow, ipcMain, ipcRenderer, shell, path, fs, os, request,
        transliterate, systemPreferences, chooseFile, store, downloadSession } = require('chuijs');
```

`chooseFile` — это `dialog` из `@electron/remote/main`, `store` — готовый экземпляр `new Store()`.

#### Автоматическое обновление приложения
Только AppImage и NSIS.

```javascript
main.enableAutoUpdateApp(5000);
main.sendDownload('Обновление', 'Загрузка...');
main.sendDownloadComplete('Обновление', 'Готово');
main.sendDownloadError('Обновление', 'Ошибка');
```

#### Themes
Оформление зависит от системной темы (светлая/тёмная), переключателя в API нет.

### Компоненты

Все 57 классов-компонентов из `require('chuijs')` (таблица иконок `Icons`, константы `Styles` и
`AcceptTypes` описаны рядом отдельно). Любой компонент реализует `set()` — возвращает готовый
DOM-элемент, поэтому внутри `Page.add(...)`, `Card.add(...)`, `ContentBlock.add(...)` передаётся
сам объект, а в `Form.components` / `SlideShow.SLIDE` / `FieldSet.components` — тоже объекты.

#### Компоновка и навигация

##### `AppLayout`
Корневой layout: шапка, app-меню, панель уведомлений. От него наследуется класс приложения.

```javascript
class App extends AppLayout {
    constructor() {
        super();
        this.setRoute(new MainPage());
    }
}
```

API: `setRoute(page)`, `setWindowControlsLeft()`, `setSearchToAppMenu()`, `setAutoCloseRouteMenu()`,
`addToHeaderRight([])`, `removeToHeaderRight([])`, `addToHeaderLeft([])`, `addToHeaderLeftBeforeTitle([])`,
`disableAppMenu()`, `setScript(pathToJS, id)`.
Статические фабрики: `AppLayout.TABS({width, default, tabs})`, `AppLayout.BUTTON({title, icon, reverse, clickEvent})`,
`AppLayout.USER_PROFILE({username, image: {noImage, imageLink, imageBase64}, items})`,
`AppLayout.USER_PROFILE_ITEM({title, icon, clickEvent})`,
`AppLayout.DIALOG({title, icon, reverse, dialogOptions: {title, closeOutSideClick, style, components}})`.

##### `Route`
Переключатель страниц: `Route extends Events` (сам `Events` из пакета не экспортируется).
`go(page)` очищает центр окна, вставляет `page.render()` и рассылает событие
`route_event_<ИмяКласса>`. `Page` потомком `Route` не является — `new Route()` создаётся внутри
`Page.setBackButton()`.

```javascript
this.setRoute(new MainPage());     // AppLayout: регистрирует страницу в app-меню
new Route().go(new MainPage());    // переключить центр окна на страницу
```

##### `Page`
Страница-контейнер: то, что попадает в окно через `setRoute`.

```javascript
class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Главная');
        this.setMain(false);
        this.add(new Button({ title: 'Кнопка' }));
    }
}
```

API: `add(...components)`, `remove(...components)`, `setBackButton({title, icon, reverse, page})`,
`setMenuBar(menuBar)`, `getMenuBar()`, `addRouteEvent(self, event)`, `setIcon/setTitle/setMain`,
`getIcon/getTitle/getMain`, `setFullHeight()`, `setFullWidth()`, `disablePadding()`,
`getMediaStream({video, audio})`, `render()`.

##### `MenuBar`
Строка меню окна (пункты и выпадающие списки).

```javascript
const menuBar = new MenuBar({ test: true });
menuBar.addMenuItems(
    new Button({ icon: Icons.NAVIGATION.MENU, clickEvent: () => {} }),
    MenuBar.DROPDOWN({ title: 'Ещё', items: [new Button({ title: 'О программе' })] })
);
page.setMenuBar(menuBar);
```

Опции: `{test}`. API: `addMenuItems(...components)`.
Фабрика: `MenuBar.DROPDOWN({title, items})`.

##### `ContextMenu`
Контекстное меню для любого элемента.

```javascript
const menu = new ContextMenu({
    items: [
        ContextMenu.Item({ title: 'Открыть', icon: Icons.NAVIGATION.APPS, clickEvent: () => {} }),
        ContextMenu.Separator(),
        ContextMenu.SubMenu({ title: 'Ещё', items: [ContextMenu.Item({ title: 'Свойство' })] })
    ]
});
menu.attach(table);   // table — компонент или DOM-элемент
```

Опции: `{items: []}`. API: `attach(target)`, `detach(target)`, `show(x, y)`, `hide()`, `destroy()`.
Фабрики: `ContextMenu.Item({title, icon, shortcut, disabled, clickEvent})`, `ContextMenu.Separator()`,
`ContextMenu.SubMenu({title, icon, items})`.

##### `Styles`
Константы CSS-значений для опций `width`, `style` и объектов `styles`.

```javascript
new ContentBlock({ direction: Styles.DIRECTION.COLUMN, justify: Styles.JUSTIFY.SPACE_BEETWEEN });
Styles.SIZE.WEBKIT_FILL;   // "-webkit-fill-available"
```

Группы: `WORD_BREAK`, `TEXT_ALIGN`, `ALIGN`, `JUSTIFY` (в `.JUSTIFY` опечатка — `SPACE_BEETWEEN`,
в коде именно так), `DIRECTION`, `WRAP`, `SIZE`.

##### `Icon`
Отдельная иконка Material Symbols.

```javascript
new Icon(Icons.NAVIGATION.CLOSE, '16px', 'red');
el.innerHTML = new Icon(Icons.CONTENT.ADD, '20px').getHTML();
```

Сигнатура: `new Icon(name, size, color)`. API: `getHTML()`, `set()`.

##### `Icons`
Справочник имён иконок — 18 групп: `NAVIGATION`, `TOGGLE`, `SOCIAL`, `SEARCH`, `PLACES`,
`NOTIFICATION`, `MAPS`, `IMAGE`, `HOME`, `HARDWARE`, `FILE`, `EDITOR`, `DEVICE`, `CONTENT`,
`ALERT`, `AUDIO_VIDEO`, `COMMUNICATION`, `ACTIONS`.

```javascript
Icons.ACTIONS.HOME;
Icons.CONTENT.UNDO;
Icons.NAVIGATION.ARROW_BACK;
```

#### Поля ввода

##### `TextInput`
Однострочное текстовое поле.

```javascript
const input = new TextInput({
    name: 'name', title: 'Имя', placeholder: 'Введите имя', required: true
});
input.setValue('Пётр');
```

Опции: `name`, `title`, `placeholder`, `width`, `required`, `value`, `disableFocus`,
`inputListener`, `focusListener`, `blurListener`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `setErrorMessage()`,
`addInputListener()`, `addFocusListener()`, `addBlurListener()`, `set()`.

##### `TextArea`
Многострочное текстовое поле.

```javascript
const area = new TextArea({ name: 'text', title: 'Сообщение', width: '300px', required: true });
```

Опции: `name`, `title`, `placeholder`, `width`, `height`, `required`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `set()`.

##### `PasswordInput`
Поле пароля.

```javascript
const pass = new PasswordInput({ name: 'pass', title: 'Пароль', required: true });
pass.setErrorMessage('Слишком короткий пароль');
```

Опции: `name`, `title`, `placeholder`, `width`, `required`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `setErrorMessage()`, `set()`.

##### `EmailInput`
Поле e-mail.

```javascript
const email = new EmailInput({ name: 'email', title: 'E-mail', placeholder: 'mail@example.com' });
```

Опции: `name`, `title`, `placeholder`, `width`, `required`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `set()`.

##### `NumberInput`
Числовое поле.

```javascript
const count = new NumberInput({ name: 'count', title: 'Количество', width: '120px' });
count.setValue(3);
```

Опции: `name`, `title`, `required`, `width`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `set()`.

##### `DateInput`
Поле даты со встроенным календарём.

```javascript
const date = new DateInput({ name: 'date', title: 'Дата' });
date.getValue();   // строка из input
```

Опции: `name`, `title`, `required`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `setDisabled()`, `set()`.

##### `CheckBox`
Флажок.

```javascript
const box = new CheckBox({ name: 'agree', title: 'Согласен', changeListener: () => {} });
box.setValue(true);
```

Опции: `name`, `title`, `required`, `changeListener`.
API: `getName()`, `getTitle()`, `getValue()`, `setValue()`, `addChangeListener()`, `setDisabled()`, `set()`.

##### `Toggle`
Переключатель без подписи.

```javascript
const toggle = new Toggle();
toggle.setValue(true);
toggle.setMargin({ top: '8px', bottom: '8px' });
```

Конструктор без опций. API: `getValue()`, `setValue(boolean)`, `setId(id)`,
`setMargin({top, bottom, left, right})`, `addChangeListener(fn)`, `set()`.

##### `RadioButton`
Одна радиокнопка.

```javascript
const radio = new RadioButton({ name: 'mode', title: 'Вариант', value: 'a' });
```

Опции: `name`, `title`, `stringValue`, `value`, `required`, `width`.
API: `getName()`, `getValue()`, `setValue()`, `addChangeListener()`, `setDisabled()`, `set()`.

##### `RadioGroup`
Группа радиокнопок, собирается из массива опций.

```javascript
const group = new RadioGroup({ styles: { direction: Styles.DIRECTION.COLUMN } });
group.addOptions([{ name: 'a', value: 'Вариант A' }, { name: 'b', value: 'Вариант B' }]);
group.addChangeListener(() => {});
group.getValue();   // бросает исключение, если ничего не выбрано
```

Опции: `styles {direction, wrap, align, justify, width}`.
API: `addOptions([{name, value}])`, `addChangeListener(fn)`, `clear()`, `getValue()`, `set()`.

##### `Select`
Одиночный выпадающий список.

```javascript
const select = new Select({ name: 'city', title: 'Город', required: true });
select.addOptions({ title: 'Москва', value: 'msk' }, { title: 'Питер', value: 'spb' });
select.setDefaultOption({ value: 'msk' });
select.addValueChangeListener(() => {});
```

Опции: `name`, `title`, `placeholder`, `width`, `required`.
API: `addOption(title, value)`, `addOptions(...options)`, `setDefaultOption(object)`, `setDropdownHeight(height)`,
`addValueChangeListener(fn)`, `getName()`, `getValue()`, `setDisabled()`, `setBottonOpenVisible(visible)`
(имя метода с опечаткой — именно `Botton`), `set()`.

##### `ComboBox`
Список с поиском по вводу.

```javascript
const combo = new ComboBox({ name: 'item', title: 'Поиск', width: '300px', optionsLen: 5 });
combo.addOptions({ title: 'Пункт', value: '1' });
combo.addValueChangeListener(() => {});
combo.getValue();
```

Опции: `name`, `title`, `placeholder`, `width`, `required`, `optionsLen`.
API: `addOptions(...options)`, `addValueChangeListener(fn)`, `getName()`, `getValue()`, `setDisabled()`, `clear()`, `set()`.

##### `MultiComboBox`
Множественный выбор с секциями.

```javascript
const multi = new MultiComboBox({ name: 'tags', title: 'Теги', width: '300px' });
multi.addOptionsWithSections([{ title: 'Секция', options: [{ title: 'Пункт', value: '1' }] }]);
multi.getValue();   // массив выбранных значений
```

Опции: `name`, `title`, `placeholder`, `width`, `required`, `optionsLen`.
API: `addOptions(...options)`, `addOptionsWithSections([{title, options}])`, `clearDropdown()`,
`addValueChangeListener(fn)`, `getName()`, `getValue()`, `setDisabled()`, `clear()`, `set()`.

##### `FileInput`
Выбор файлов с диска.

```javascript
const file = new FileInput({
    name: 'file', title: 'Изображение', accept: [AcceptTypes.ALL_IMAGE],
    multiple: false, changeListener: () => {}
});
file.getFiles();
```

Опции: `name`, `title`, `accept`, `required`, `disableFocus`, `multiple`, `changeListener`, `focusListener`, `blurListener`.
API: `getFile(index)`, `getFiles()`, `getName()`, `getTitle()`, `setDisabled()`, `addChangeListener()`,
`addFocusListener()`, `addBlurListener()`, `set()`.

##### `AcceptTypes`
Константа MIME-типов для опции `accept` у `FileInput` (не компонент, а набор строк).

```javascript
AcceptTypes.ALL_IMAGE;   // 'image/*'
AcceptTypes.PNG;         // 'image/png'
AcceptTypes.GIF;         // 'image/gif'
AcceptTypes.JPEG;        // 'image/jpeg'
AcceptTypes.ALL_AUDIO;   // 'audio/*'
AcceptTypes.ALL_VIDEO;   // 'video/*'
```

##### `Form`
HTML-форма с отправкой и перехватом `submit`.

```javascript
const form = new Form({
    method: Form.METHOD.POST,
    components: [
        new TextInput({ name: 'name', title: 'Имя', required: true }),
        Form.SubmitButton('Отправить')
    ],
    submitEvent: (e) => {
        e.preventDefault();
        new Notification({ title: 'Form', text: 'Отправлено', showTime: 3000 }).show();
    }
});
```

Опции: `action`, `method`, `components`, `submitEvent`.
API: `set()`, статики `Form.SubmitButton(title)` и `Form.METHOD.{GET, POST}`.

##### `FieldSet`
Группа полей с легендой.

```javascript
const set = new FieldSet({
    id: 'f1', name: 'group', title: 'Данные',
    style: { direction: Styles.DIRECTION.COLUMN, width: Styles.SIZE.WEBKIT_FILL },
    components: [new TextInput({ name: 'name', title: 'Имя' })]
});
set.add(new Button({ title: 'Готово' }));
```

Опции: `id`, `name`, `title`, `style {width, height, direction, wrap, align, justify}`, `components`.
API: `getId()`, `getLegend()`, `setLegend(text)`, `add(...components)`, `set()`.

#### Отображение

##### `Button`
Кнопка с текстом и/или иконкой.

```javascript
const button = new Button({ title: 'Нажать', icon: Icons.CONTENT.ADD, clickEvent: () => {} });
button.setDisabled(true);
```

Опции: `reverse`, `title`, `icon`, `clickEvent`.
API: `getText()`, `setText()`, `addClickListener()`, `setDisabled(boolean)`, `set()`.

> `disabled` в конструкторе не читается — состояние задаётся только через `setDisabled(true)`.

##### `H`
Заголовок `H1`…`H6`.

```javascript
new H(1, 'Заголовок');
new H(3, 'Подзаголовок').setText('Другой текст');
```

Сигнатура: `new H(num, text)`. API: `setText()`, `set()`.

##### `Label`
Подпись с обычным или markdown-текстом.

```javascript
const label = new Label({ text: 'Подпись', fontSize: '14px' });
const md = new Label({ markdownText: '**Жирный** текст' });
```

Опции: `id`, `text`, `markdownText` (взаимоисключающие), `textAlign`, `wordBreak`, `width`, `fontSize`.
API: `getId()`, `getText()`, `getMarkdownText()`, `setId()`, `setText()`, `setMarkdownText()`, `set()`.

##### `Paragraph`
Абзац текста.

```javascript
new Paragraph('Текст абзаца');
```

Сигнатура: `new Paragraph(text)`. API: `setText()`, `set()`.

##### `Badge`
Небольшой цветной бейдж.

```javascript
new Badge({ text: 'ERROR', style: Badge.STYLE.ERROR });
new Badge({ markdownText: '**OK**', style: Badge.STYLE.SUCCESS });
```

Опции: `id`, `text`, `markdownText`, `style`.
API: `getId()`, `getText()`, `getMarkdownText()`, `setId()`, `setText()`, `setMarkdownText()`, `setStyle()`, `set()`.
Константа: `Badge.STYLE.{ERROR, SUCCESS, WARNING}`.

##### `Spinner`
Индикатор загрузки.

```javascript
const spinner = new Spinner(Spinner.SIZE.DEFAULT, 'auto');
spinner.remove();
```

Сигнатура: `new Spinner(size, margin)`. API: `remove()`, `set()`.
Константа: `Spinner.SIZE.{V_SMALL, SMALL, DEFAULT, BIG, V_BIG}`, у `V_SMALL` — `{SIZE: 30, BORDER: 3}`.

##### `ProgressBar`
Полоса прогресса с подписями.

```javascript
const progress = new ProgressBar({ max: 100 });
progress.setValue(40);
progress.setProgressText('40%');
```

Опции: `{max}`.
API: `setMax()`, `setWidth()`, `setValue()`, `setProgressText()`, `setProgressCountText()`, `set()`.

##### `ContentBlock`
Flex-контейнер для произвольной компоновки.

```javascript
const block = new ContentBlock({
    direction: Styles.DIRECTION.COLUMN, align: Styles.ALIGN.START, justify: Styles.JUSTIFY.START
});
block.add(new Paragraph('Строка'), new Button({ title: 'Кнопка' }));
```

Опции: `display`, `direction`, `wrap`, `align`, `justify`, `disableMarginChild`.
API: `add(...components)`, `remove(...components)`, `clear()`, `disableMarginChild()`, `setAutoOverflow()`,
`setContentEditable()`, `setWidth()`, `setHeight()`, `setPadding()`, `set()`.

##### `Card`
Карточка с шапкой (иконка, заголовок, описание) и телом. Внутри витрины `app/views/0_maket.js`.

```javascript
const card = new Card({ id: 'c1', title: 'Заголовок', description: 'Пояснение', icon: Icons.CONTENT.ADD });
card.add(new Paragraph('Содержимое'));
card.getBody();   // <card_body>
```

Опции: `id`, `title`, `description`, `icon`, `width`, `height`, `style`, `components`.
API: `getId()`, `getTitle()`, `getDescription()`, `getBody()`, `setId()`, `setTitle()`, `setDescription()`,
`setIcon()`, `setWidth()`, `setHeight()`, `setStyle()`, `add(...components)`, `clear()`, `set()`.

##### `Hero`
Шапка страницы с иконкой, текстом и статистикой.

```javascript
new Hero({
    title: 'chUiJS', description: 'Витрина компонентов', icon: Icons.HOME.SENSOR_DOOR,
    stats: [{ value: '56', label: 'КОМПОНЕНТОВ' }]
});
```

Опции: `id`, `title`, `description`, `icon`, `stats: [{value, label}]`, `style`, `width`, `height`.
API: `getId()`, `getTitle()`, `getDescription()`, `setId()`, `setTitle()`, `setDescription()`, `setIcon()`,
`setWidth()`, `setHeight()`, `setStyle()`, `addStat(value, label)`, `clearStats()`, `set()`.

##### `Details`
Раскрывающийся блок.

```javascript
const details = new Details({ title: 'Подробнее', width: Styles.SIZE.WEBKIT_FILL });
details.add(new Paragraph('Скрытый текст'));
```

Опции: `title`, `contenteditable`, `direction`, `wrap`, `align`, `justify`, `width`.
API: `add(...components)`, `set()`.

##### `Accordion`
Аккордеон из секций; на вход идёт **массив**, а не объект.

```javascript
new Accordion([{ b_text: 'Раздел 1', p_text: 'Текст раздела 1' }]);
```

##### `CodeBlock`
Блок с предформатированным текстом (команды, код).

```javascript
new CodeBlock('npm run start', { width: Styles.SIZE.MAX_CONTENT });
```

Сигнатура: `new CodeBlock(text, options {textAlign, wordBreak, width})`. API: `setText()`, `set()`.

##### `HtmlBlock`
Произвольный HTML внутри layout.

```javascript
const html = new HtmlBlock(Styles.SIZE.WEBKIT_FILL);
html.setHtml('<b>жирный</b> и <i>курсив</i>');
```

Сигнатура: `new HtmlBlock(width)`. API: `setHtml(html)`, `set()`.

##### `Table`
Таблица по массиву объектов (ключи объекта — колонки).

```javascript
class Car { constructor(car, model, size) { this.car = car; this.model = model; this.size = size; } }
const table = new Table({ data: [new Car('Acura', 'NSX', 10)], sorted: true });
table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, 'model', 'n');
table.setContextMenu(menu);
```

Опции: `data`, `customName`, `userSelect`, `sorted`, `columnsWidth`.
API: `setData()`, `getData()`, `refresh(data)`, `getColumn(col)`, `setContextMenu(ctx)`,
`setFilterByProperty(type, property, filterValue)`, `setFilterByMultiProperty(type, properties, filterValue)`,
`removeFilterByProperty(property, filterValue)`, `set()`.
Константа: `Table.FILTER_TYPE.{CLEAR_MATCH, PARTIAL_MATCH}`.

##### `TreeView`
Дерево из кнопок и раскрывающихся узлов.

```javascript
new TreeView({
    width: Styles.SIZE.WEBKIT_FILL,
    components: [
        TreeView.Button({ title: 'Кнопка', listener: () => {} }),
        TreeView.ExpandButton({ title: 'Папка', subButtons: [], components: [new Paragraph('Внутри')] })
    ]
});
```

Опции: `width`, `components`.
Фабрики: `TreeView.Button({title, listener})`, `TreeView.ExpandButton({title, subButtons, components})`.

##### `Tabs` и `Tab`
Вкладки: `Tab` создаётся отдельно, `Tabs` собирает их в панель.

```javascript
const first = new Tab('Вкладка 1');
first.addContent(new TextInput({ title: 'Поле 1', width: '300px' }));
new Tabs({ default: 0, width: Styles.SIZE.WEBKIT_FILL, tabs: [first, new Tab('Вкладка 2')] });
```

`Tab(title)`: `addContent(...contents)`, `getTab()`, `getContent()`, `set()`.
`Tabs({width, default, tabs})`: `set()`.

##### `BarGraph`
Столбчатая диаграмма (клик по столбцу показывает `Notification`).

```javascript
new BarGraph({ data: { 'Пн': 4, 'Вт': 7 }, colors: ['#0a84ff'] });
```

##### `PieGraph`
Круговая или кольцевая диаграмма.

```javascript
new PieGraph({ data: { 'Да': 30, 'Нет': 70 }, colors: ['#34c759', '#ff3b30'], legend: true, doughnutHoleSize: 0.5 });
```

#### Окна, уведомления, медиа

##### `Dialog`
Модальное окно с шапкой, телом и подвалом.

```javascript
const dialog = new Dialog({ width: '420px', height: '260px', closeOutSideClick: true });
dialog.addToHeader(new Paragraph('Заголовок'));
dialog.addToBody(new Paragraph('Содержимое'));
dialog.addToFooter(new Button({ title: 'Понятно', clickEvent: () => dialog.close() }));
dialog.open();
```

Опции: `width` (по умолчанию `max-content`), `height`, `closeOutSideClick`.
API: `addToHeader()`, `addToBody()`, `addToFooter()`, `removeFromHeader()`, `removeFromBody()`,
`removeFromFooter()`, `open()`, `openAndClose()`, `close()`, свойство `isOpen`, `set()`.

##### `Popup`
Готовые системные попапы: `alert`, `confirm`, `prompt`.

```javascript
const popup = new Popup();
popup.alert({ title: 'Внимание', message: 'Текст' });
const ok = await popup.confirm({ title: 'Удалить?', message: 'Действие необратимо' });
const data = await popup.prompt({ title: 'Ввод', message: 'Заполните поля',
    inputs: { text: { placeholder: 'Логин', errorMessage: 'Обязательное поле' },
              password: { placeholder: 'Пароль' } } });
```

`alert` ничего не возвращает, `confirm` → `Promise<boolean>`,
`prompt` → `Promise<{text?, password?}>`. Классы `PopupAlert`, `PopupConfirm`, `PopupPrompt` наружу не экспортируются.

##### `Notification`
Тост в панели уведомлений.

```javascript
new Notification({
    title: 'Готово', text: 'Файл сохранён',
    style: Notification.STYLE.SUCCESS, showTime: 5000
}).show(true);   // true — продублировать системным уведомлением
```

Опции: `title` **или** `markdownTitle`, `text` **или** `markdownText`, `style`, `showTime`.
API: `show(showOnSystem)`. Константа: `Notification.STYLE.{ERROR, SUCCESS, WARNING}`.

##### `UpdateNotification`
Уведомление о процессе обновления со спиннером.

```javascript
const update = new UpdateNotification({ title: 'Обновление', text: 'Скачивание', spinner: true });
update.show(true);
update.hide();
```

Опции: `{title, text, spinner}`. API: `show(showOnSystem)`, `hide()`.

##### `DownloadNotification`
Уведомление о загрузке файла.

```javascript
const download = new DownloadNotification({ title: 'Файл', text: 'Загрузка...', type: 'image' });
download.show();
download.update('Файл', 'Почти готово');
download.done();   // или download.error();
```

Опции: `{title, text, type}`. API: `show()`, `update(title, text)`, `done()`, `error()`.

##### `DownloadProgressNotification`
Уведомление о загрузке с прогрессом.

```javascript
const progress = new DownloadProgressNotification({ title: 'Файл', text: 'Загрузка...', type: 'image' });
progress.show();
progress.update('Файл', 'Половина', 50, 100);   // title, text, value, max
progress.done();
```

Опции: `{title, text, type}` — `max` задаётся не в конструкторе, а в `update(title, text, value, max)`.
API: `show()`, `update(title, text, value, max)`, `done()`, `error()`.

##### `Calendar`
Сетка месяца (месяц нумеруется с 1).

```javascript
const calendar = new Calendar(2026, 9);
calendar.getCalendar();
```

Сигнатура: `new Calendar(year, month)`. API: `getCalendar()`, `getDateNow()`, `getMonthName()`,
`getDayName()`, `getDate()`, `getMonth()`, `getYear()`. Метода `set()` нет — это не компонент-элемент.

##### `SlideShow`
Слайдер; слайды описываются фабрикой `SLIDE`.

```javascript
new SlideShow({
    width: Styles.SIZE.WEBKIT_FILL, height: '260px',
    autoplay: { status: true, interval: 4000 },
    slides: [SlideShow.SLIDE({
        size: { width: Styles.SIZE.WEBKIT_FILL, height: Styles.SIZE.WEBKIT_FILL },
        style: { align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER },
        components: [new H(3, 'Слайд 1'), new Paragraph('Текст')]
    })]
});
```

Опции: `width`, `height`, `autoplay {status, interval}`, `slides`.
Фабрика: `SlideShow.SLIDE({size: {width, height}, style: {direction, wrap, align, justify}, components: [...]})`
(класс `Slide` не экспортируется).

> Подпись `SLIDE` обещает `{width, height}`, но `Slide` читает `options.size.width` и
> `options.style.*`: вызов `SlideShow.SLIDE({components: [...]})` без `size` и `style` падает
> с `TypeError`. Передавайте оба объекта, как в примере выше.

##### `TextEditor`
WYSIWYG-редактор с панелью форматирования.

```javascript
const editor = new TextEditor('100%', {
    title: 'Описание',
    controls: { BOLD: true, ITALIC: true, INSERT_LINK: true }
});
editor.setValueAsHTML('<b>текст</b>');
```

Сигнатура: `new TextEditor(height, options {title, controls})`.
Ключи `controls` (20): `UNDO_REDO`, `BLOCK_FORMAT`, `FONT_SIZE`, `REMOVE_FORMAT`, `BOLD`, `ITALIC`,
`STRIKE_THROUGH`, `UNDERLINE`, `SUPERSCRIPT`, `SUBSCRIPT`, `JUSTIFY_LEFT`, `JUSTIFY_CENTER`,
`JUSTIFY_RIGHT`, `JUSTIFY_FULL`, `LISTS`, `CONTENT_CONTROLS`, `INSERT_LINK`, `INSERT_TABLE`,
`INSERT_IMAGE`, `LINE_BREAK`. Панель форматирования собирается классом `TextEditorPanel`,
который наружу не экспортируется.
API: `getValueAsHTML()`, `setValueAsHTML()`, `getValueAsText()`, `setValueAsText()`, `addInputListener()`, `set()`.

##### `Image`
Изображение из файла, base64 или по HTTP.

```javascript
new Image({ path: `${__dirname}/icon.png`, width: '64px', openPopup: true });
```

Опции: `path`, `base64`, `httpPath`, `width`, `height`, `openPopup`, `disableMargin`.
API: `setWidth()`, `setHeight()`, `set()`.

##### `Audio`
Аудиоплеер с плейлистом и эквалайзером.

```javascript
const player = new Audio({ autoplay: false, pin: Audio.PIN.TOP, playlist: true, width: '400px' });
player.setPlayList([{ title: 'Трек', artist: 'Исполнитель', mimetype: 'audio/mpeg' }]);
player.setActive(0);
player.play();
player.openFolder('/music');
player.restoreFX();
```

Опции: `autoplay`, `pin`, `playlist`, `width`, `height`.
API: `play()`, `next()`, `prev()`, `openFolder(path)`, `setPlayList(list)`, `setActive(index)`, `restoreFX()`, `set()`.
Константы: `Audio.PIN.{TOP, BOTTOM}` и `Audio.MIMETYPES` (`AU_SND`, `LINEAR_PCM`, `MID_RMI`, `MP3`,
`MP4`, `AIF_AIFC_AIFF`, `M3U`, `RA_RAM`, `OGG`, `VORBIS`, `WAV`; у `LINEAR_PCM` значение
`'auido/L24'` — опечатка уже в коде).

##### `Video`
Видеоплеер; умеет проигрывать `MediaStream` (например, веб-камеру).

```javascript
const video = new Video({ autoplay: false, width: Styles.SIZE.WEBKIT_FILL, height: 'auto' });
video.setStream(stream);          // MediaStream из Page.getMediaStream({video: true})
video.setPlayList([{ title: 'Видео', mimetype: Video.MIMETYPES.MP4, videoPath: '/video.mp4' }]);
```

Опции: `autoplay`, `width`, `height`.
API: `setStream(stream)`, `setPlayList(list)`, `getPlayList()`, `set()`.
Константа: `Video.MIMETYPES.{MP4, WEBM, M4V, QUICK_TIME}`.

##### `WebView`
Встроенный тег `webview` со своим preload и партишеном.

```javascript
const web = new WebView('https://example.com', false);
web.setPartition('persist:app');
web.setPreload(`${__dirname}/preload.js`);
web.insertCustomRes({ cssPath: `${__dirname}/inject.css`, jsPath: `${__dirname}/inject.js` });
web.addFinishLoadEvent(() => {});
```

Сигнатура: `new WebView(url, dev)`. API: `setUrl()`, `setPartition()`, `setPreload()`,
`addStartLoadEvent()`, `addStopLoadEvent()`, `addFinishLoadEvent()`, `insertCustomRes({cssPath, jsPath})`,
`executeJavaScript(code)`, `send(channel, ...args)`, `getWebContentsId()`, `set()`.

##### `Console`
Встроенная консоль для вывода текста.

```javascript
const console_ = new Console({ width: '100%', height: '240px' });
console_.addText('$ npm run start');
```

Опции: `{width, height}`. API: `addText(text)`, `set()`.

##### `CustomElement`
Обёртка над произвольным DOM-элементом.

```javascript
const el = new CustomElement({ tag: 'div', id: 'my-block', className: 'css_class', pathToCSS: `${__dirname}/style.css` });
el.innerHTML('<b>HTML</b>');
```

Опции: `tag`, `id`, `className`, `pathToCSS` (`tag` и `id` обязательны — иначе исключение).
API: `innerText()`, `innerHTML()`, `addEventListener(type, listener)`, `set()`.

#### Константы и статические фабрики

Кроме компонентов из `require('chuijs')` достаются константы и фабрики:

- **Размеры и раскладка** — `Styles.WORD_BREAK.*`, `Styles.TEXT_ALIGN.*`, `Styles.ALIGN.*`,
  `Styles.JUSTIFY.*`, `Styles.DIRECTION.*`, `Styles.WRAP.*`, `Styles.SIZE.*`.
- **Стили уведомлений и бейджей** — `Notification.STYLE.{ERROR, SUCCESS, WARNING}`,
  `Badge.STYLE.{ERROR, SUCCESS, WARNING}`.
- **Размеры спиннера** — `Spinner.SIZE.{V_SMALL, SMALL, DEFAULT, BIG, V_BIG}`.
- **Фильтры таблицы** — `Table.FILTER_TYPE.{CLEAR_MATCH, PARTIAL_MATCH}`.
- **Метод формы** — `Form.METHOD.{GET, POST}`.
- **Типы файлов** — `AcceptTypes.{ALL_IMAGE, PNG, GIF, JPEG, ALL_AUDIO, ALL_VIDEO}`.
- **Медиа** — `Audio.PIN.{TOP, BOTTOM}`, `Audio.MIMETYPES`, `Video.MIMETYPES.{MP4, WEBM, M4V, QUICK_TIME}`.
- **Элементы шапки** — `AppLayout.TABS({width, default, tabs})`, `AppLayout.BUTTON({title, icon, reverse, clickEvent})`,
  `AppLayout.USER_PROFILE({username, image, items})`, `AppLayout.USER_PROFILE_ITEM({title, icon, clickEvent})`,
  `AppLayout.DIALOG({title, icon, reverse, dialogOptions})`.
- **Меню, дерево, слайды** — `MenuBar.DROPDOWN({title, items})`, `ContextMenu.Item/Separator/SubMenu`,
  `TreeView.Button({title, listener})`, `TreeView.ExpandButton({title, subButtons, components})`,
  `Form.SubmitButton(title)`, `SlideShow.SLIDE({size, style, components})`.

> Не экспортируются из пакета (доступны только через фабрики): `Slide`, `SubmitButton`,
> `TextEditorPanel`, `Commands`, а также классы popup-окон (`PopupAlert`, `PopupConfirm`, `PopupPrompt`).
> Из `chui_functions` наружу не отдаются `getDate()`, `style_parse(json, component)`,
> `markdownToHtml(text)`, `htmlToMarkdown(html)`, `shouldOpenDropdownUp(dropdown, anchor)`,
> `setStyles(pathToCSS, component)` — они доступны только внутри фреймворка.

#### Сценарии целиком

```javascript
/** AppLayout + Page + шапка */
const { AppLayout, Page, Icon, Icons, Button, TextInput, Notification, MenuBar, render, Log } = require('chuijs');

class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Главная');
        this.setIcon(Icons.ACTIONS.HOME);
        this.setMain(true);           // домашний роут
        this.setFullWidth();          // растянуть по ширине окна
        const menuBar = new MenuBar({ test: true });
        menuBar.addMenuItems(
            new Button({ icon: Icons.NAVIGATION.MENU, clickEvent: () => {} }),
            MenuBar.DROPDOWN({ title: 'Ещё', items: [new Button({ title: 'О программе' })] })
        );
        this.setMenuBar(menuBar);
        const name = new TextInput({ title: 'Имя', placeholder: 'Имя' });
        this.add(name, new Button({ title: 'Поздороваться', clickEvent: () =>
            new Notification({ title: 'Привет!', text: name.getValue(), style: Notification.STYLE.SUCCESS, showTime: 4000 }).show()
        }));
    }
}

class App extends AppLayout {
    constructor() {
        super();
        this.setRoute(new MainPage());
        this.addToHeaderLeft([AppLayout.BUTTON({ title: 'Назад', icon: Icons.NAVIGATION.ARROW_BACK, reverse: true, clickEvent: () => {} })]);
        this.addToHeaderRight([AppLayout.USER_PROFILE({
            username: 'user',
            items: [AppLayout.USER_PROFILE_ITEM({ title: 'Настройки', clickEvent: () => {} })]
        })]);
    }
}
render(() => new App()).catch(err => Log.error(err));
```

```javascript
/** Page.setBackButton + переключение роутов */
const page = new MainPage();
page.setBackButton({ title: 'Назад', icon: Icons.NAVIGATION.ARROW_BACK, reverse: true, page: new SecondPage() });
```

```javascript
/** Select, ComboBox, MultiComboBox, RadioGroup, Form */
const select = new Select({ title: 'Select' });
select.addOptions({ title: 'Пункт 1', value: '1' }, { title: 'Пункт 2', value: '2' });

const combo = new ComboBox({ title: 'ComboBox', width: '300px' });
combo.addOptions({ title: 'Пункт', value: '1' });

const multi = new MultiComboBox({ title: 'MultiComboBox', width: '300px' });
multi.addOptionsWithSections([{ title: 'Секция', options: [{ title: 'Пункт', value: '1' }] }]);

const group = new RadioGroup({ styles: { direction: Styles.DIRECTION.COLUMN } });
group.addOptions([{ name: 'a', value: 'Вариант A' }, { name: 'b', value: 'Вариант B' }]);

try { group.getValue(); } catch (e) { Log.error(e); }   // бросит, если ничего не выбрано

const form = new Form({
    method: Form.METHOD.POST,
    components: [
        new TextInput({ name: 'name', title: 'Имя', required: true }),
        new TextArea({ name: 'text', title: 'Сообщение', width: '300px', required: true }),
        Form.SubmitButton('Отправить')
    ],
    submitEvent: (e) => { e.preventDefault(); new Notification({ title: 'Form', text: 'Отправлено', showTime: 3000 }).show(); }
});
```

```javascript
/** Table, TreeView, Tabs, ContextMenu */
class Car { constructor(car, model, size) { this.car = car; this.model = model; this.size = size; } }

const table = new Table({ data: [new Car('Acura', 'NSX', 10), new Car('Ford', 'SHELBY', 34)], sorted: true });
table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, 'model', 'n');

const tree = new TreeView({
    width: Styles.SIZE.WEBKIT_FILL,
    components: [TreeView.ExpandButton({ title: 'Папка', subButtons: [], components: [new Paragraph('Внутри')] })]
});

const first = new Tab('Вкладка 1');
first.addContent(new TextInput({ title: 'Поле 1', width: '300px' }));
const tabs = new Tabs({ default: 0, width: Styles.SIZE.WEBKIT_FILL, tabs: [first, new Tab('Вкладка 2')] });

const menu = new ContextMenu({
    items: [
        ContextMenu.Item({ title: 'Открыть', icon: Icons.NAVIGATION.APPS, clickEvent: () => {} }),
        ContextMenu.Separator(),
        ContextMenu.SubMenu({ title: 'Ещё', items: [ContextMenu.Item({ title: 'Свойство', clickEvent: () => {} })] })
    ]
});
menu.attach(table);
```

```javascript
/** Dialog + Popup */
const dialog = new Dialog({ width: '420px', height: '260px', closeOutSideClick: true });
dialog.addToHeader(new Paragraph('Dialog — модальное окно'));
dialog.addToBody(new Paragraph('Содержимое задаётся через addToBody().'));
dialog.addToFooter(new Button({ title: 'Понятно', clickEvent: () => dialog.close() }));
dialog.open();

const popup = new Popup();
popup.alert({ title: 'Внимание', message: 'Текст сообщения' });
const ok = await popup.confirm({ title: 'Удалить?', message: 'Действие необратимо', okText: 'Удалить', cancelText: 'Отмена' });
const data = await popup.prompt({ title: 'Ввод', message: 'Заполните поля', inputs: { text: { placeholder: 'Логин', errorMessage: 'Обязательное поле' }, password: { placeholder: 'Пароль' } } });
```

```javascript
/** TextEditor, SlideShow, графики, календарь */
const editor = new TextEditor('100%', { title: 'TextEditor', controls: { BOLD: true, ITALIC: true, INSERT_LINK: true } });

const slideshow = new SlideShow({
    width: Styles.SIZE.WEBKIT_FILL, height: '260px',
    autoplay: { status: true, interval: 4000 },
    slides: [SlideShow.SLIDE({
        size: { width: Styles.SIZE.WEBKIT_FILL, height: Styles.SIZE.WEBKIT_FILL },
        style: { align: Styles.ALIGN.CENTER },
        components: [new H(3, 'Слайд 1'), new Paragraph('Текст')]
    })]
});

const bar = new BarGraph({ data: { 'Пн': 4, 'Вт': 7 }, colors: ['#0a84ff', '#34c759'] });
const pie = new PieGraph({ data: { 'Да': 30, 'Нет': 70 }, colors: ['#34c759', '#ff3b30'], legend: true, doughnutHoleSize: 0.5 });

const calendar = new Calendar(new Date().getFullYear(), new Date().getMonth() + 1);
const weeks = calendar.getCalendar();
```

## Модель безопасности renderer

Текущая конфигурация рассчитана на доверенный код приложения (всё, что грузится в окно,
пишется вами), а не на загрузку сторонних страниц. Что включено сейчас:

- `process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = "true"` — глобально глушит предупреждения Electron о небезопасной конфигурации (`index.js`).
- В `webPreferences` окна (`Main`): `nodeIntegration: true`, `contextIsolation: false`,
  `nodeIntegrationInSubFrames: true`, `webviewTag: true`, `enableRemoteModule: true`.
- `preload` не является мостом: в него передаётся ваш renderer-энтрипоинт (`options.render`),
  то есть код страницы исполняется с полным доступом к Node.js.
- `@electron/remote` инициализируется и включается для главного окна — renderer может
  напрямую обращаться к модулям main-процесса.
- При `webSecurity: false` заголовки `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`
  и `X-Frame-Options` перезаписываются на `*` в `onBeforeSendHeaders` / `onHeadersReceived`.
- Обработчик разрешений сессии автоматически одобряет только `media` (микрофон/камера),
  все остальные разрешения отклоняются.

Если приложение будет открывать внешний или недоверенный контент, безопасную схему нужно собрать так:

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` (где возможно) — вместо `@electron/remote`.
- Отдельный preload-скрипт с `contextBridge.exposeInMainWorld(...)` и узким списком методов;
  обмен с main-процессом через `ipcRenderer.invoke` / `ipcMain.handle` вместо `remote`.
- `webviewTag` — только если он реально используется; иначе `false`.
- `webSecurity` держать `true`, а внешние запросы проксировать через main-процесс,
  вместо перезаписи CORS-заголовков.
- Ограничивать `loadURL`/`BrowserWindow`-навигацию через `will-navigate` и `setWindowOpenHandler`.

### В разработке

- Дочерние `BrowserWindow` — отдельные окна приложения пока не поддерживаются.
