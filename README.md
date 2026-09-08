# chuijs

Компонентный фреймворк для Electron (v3.6.3).

## CHROME_SANDBOX FIX (Linux)

```shell
cd node_modules/electron/dist && sudo chown root chrome-sandbox && sudo chmod 4755 chrome-sandbox
```

## Структура

| Путь                    | Назначение                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| `index.js`              | Точка входа: `Main`, `AppLayout`, `Route`, `Page`, все компоненты, утилиты |
| `main.js`               | Main-процесс демо-приложения                                               |
| `app/`                  | Renderer демо-приложения (страницы-примеры)                                |
| `framework/components/` | Компоненты (inputs, buttons, media, ...)                                   |
| `framework/modules/`    | Модули (`Route`, `Page`, `chui_functions`, `chui_logger`, анимации)        |
| `framework/appLayout/`  | Каркас окна: header, меню, центр, уведомления                              |
| `framework/tray_bar/`   | `MenuItem`                                                                 |

## Использование

### exampleApp / app / views / main.js — страница

```javascript
const { Page, Button, TextInput, Notification } = require("chuijs");

class MainPage extends Page {
    constructor() {
        super();
        this.setTitle("Сказать привет!");
        this.setMain(true);

        let name = new TextInput({
            title: "Введите ваше имя",
            placeholder: "Введите ваше имя",
            required: false,
        });
        let hello = new Button({
            title: "Сказать привет!",
            clickEvent: () => {
                let text = name.getValue() !== "" ? `Привет, ${name.getValue()}!` : "Привет мир!";
                new Notification({
                    title: text,
                    text: text,
                    style: Notification.STYLE.SUCCESS,
                    showTime: 5000,
                }).show();
            },
        });
        this.add(name, hello);
    }
}
exports.MainPage = MainPage;
```

### exampleApp / app / app.js — renderer

```javascript
/** RENDERER ПРОЦЕСС */
const { AppLayout, render, Log } = require("chuijs");
const { MainPage } = require("../app/views/main");

class App extends AppLayout {
    constructor() {
        super();
        /** РОУТЫ */
        this.setRoute(new MainPage());
    }
}
render(() => new App()).catch((err) => Log.error(err));
```

### exampleApp / main.js — main-процесс

```javascript
const { Main, MenuItem } = require("chuijs");
const main = new Main({
    name: "exampleApp",
    sizes: { width: 1366, height: 768, minWidth: 960, minHeight: 540 },
    render: `${__dirname}/app/app.js`,
    devTools: true,
    /** icon: `${__dirname}/resources/icons/app/icon.png` */
});
main.start({
    tray: [
        new MenuItem().button("Консоль разработчика", () => main.toggleDevTools()),
        new MenuItem().separator(),
        new MenuItem().quit("Выход"),
    ],
});
```

#### Download Session в main.js

```javascript
const { App } = require("chuijs");
App.get().on("session-created", (session) => {
    session.on("will-download", (e, item, contents) => {
        // ...
    });
});
```

#### TelegramBot API

```javascript
const { TelegramBot } = require("chuijs");
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

## Модули

| Компонент                            | Версия | Описание                     |
| ------------------------------------ | ------ | ---------------------------- |
| Автоматическое обновление приложения | 1.0.0  | только AppImage, NSIS        |
| Route                                | 1.0.0  | переходы между страницами    |
| Page                                 | 1.0.0  | базовая страница             |
| ElectronTray (MenuItem)              | 1.0.0  | tray / global menu           |
| TelegramBot API                      | 1.0.0  | обёртка Telegram Bot API     |
| Log                                  | 1.0.0  | логирование в консоль и файл |

## Компоненты

| Компонент              | Версия | Компонент                       | Версия |
| ---------------------- | ------ | ------------------------------- | ------ |
| AppLayout              | 1.0.0  | ProgressBar                     | 1.0.0  |
| DateInput              | 1.0.0  | Toggle                          | 1.0.0  |
| NumberInput            | 1.0.0  | Tabs                            | 1.0.0  |
| EmailInput             | 1.0.0  | Notification                    | 1.0.0  |
| TextArea               | 1.0.0  | Badge                           | 1.0.0  |
| PasswordInput          | 1.0.0  | Image                           | 1.0.0  |
| FileInput              | 1.0.0  | Icons                           | 1.0.0  |
| H1, H2, H3, H4, H5, H6 | 1.0.0  | WebView                         | 1.0.0  |
| Label                  | 1.0.0  | Spinner                         | 1.0.0  |
| Paragraph              | 1.0.0  | GroupRadio / RadioGroup         | 1.0.0  |
| Button                 | 1.0.0  | Accordion                       | 1.0.0  |
| CheckBox               | 1.0.0  | Pre / CodeBlock                 | 1.0.0  |
| ComboBox               | 1.0.0  | HtmlBlock                       | 1.0.0  |
| MultiComboBox          | 1.0.0  | TreeView                        | 1.0.0  |
| ContextMenu            | 1.0.0  | Console                         | 1.0.0  |
| SelectBox              | 1.0.0  | SlideShow                       | 1.0.0  |
| ContentBlock           | 1.0.0  | TextEditor                      | 1.0.0  |
| Details                | 1.0.0  | FieldSet                        | 1.0.0  |
| Dialogs / Dialog       | 1.0.0  | Popups (Alert, Confirm, Prompt) | 1.0.0  |
| RadioButton            | 1.0.0  | Forms / Form                    | 1.0.0  |
| Table                  | 1.0.0  | Audio / Video                   | 1.0.0  |
| BarGraph / PieGraph    | 1.0.0  | UpdateNotification              | 1.0.0  |
| DownloadNotification   | 1.0.0  | DownloadProgressNotification    | 1.0.0  |

## Разработка

```shell
npm install
npm start       # запуск демо-приложения
npm run lint    # ESLint
npm run format  # Prettier (запись)
npm run format:check  # Prettier (проверка)
```

Демо всех компонентов собрано в `app/app.js`.
