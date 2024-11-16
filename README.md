# chuijs
### CHROME_SANDBOX FIX
```shell
cd node_modules/electron/dist && sudo chown root chrome-sandbox && sudo chmod 4755 chrome-sandbox
```
### Структура
#### exampleApp / app / views / main.js
```javascript
const { Page, Button, TextInput, Notification } = require('chuijs');
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
const { AppLayout, render } = require('chuijs');
/** СТРАНИЦЫ */
const { MainPage } = require('../app/views/main');
class App extends AppLayout {
    constructor() {
        super();
        /** РОУТЫ */
        this.setRoute(new MainPage());
    }
}
render(() => new App()).catch(err => console.log(err))
```
#### exampleApp / main.js
```javascript
/** main.js */
const { Main, MenuItem } = require('chuijs');
const main = new Main({
    name: "exampleApp",
    width: 1366,
    height: 768,
    render: `${__dirname}/app/app.js`,
    devTools: true
    /** icon: `${__dirname}/resources/icons/app/icon.png` */
});
main.start({
    tray: [
        new MenuItem().button('Показать \ Скрыть', () => main.hideAndShow()),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit("Выход")
    ]
})
```
#### Donwload Session в main.js
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
| Компонент                            | Версия | Описание              |
|--------------------------------------|--------|-----------------------|
| Автоматическое обновление приложения | 1.0.0  | только AppImage, NSIS |
| Themes                               | 1.0.0  | Зависит от системы    |
| Route                                | 1.0.0  |                       |
| Page                                 | 1.0.0  |                       |
| ElectronTray                         | 1.0.0  |                       |
| TelegramBot API                      | 1.0.0  |                       |

### Компоненты
| Компонент                       | Версия | Описание |
|---------------------------------|--------|----------|
| AppLayout                       | 1.0.0  |          |
| DateInput                       | 1.0.0  |          |
| NumberInput                     | 1.0.0  |          |
| EmailInput                      | 1.0.0  |          |
| TextArea                        | 1.0.0  |          |
| PasswordInput                   | 1.0.0  |          |
| FileInput                       | 1.0.0  |          |
| H1, H2, H3, H4, H5, H6          | 1.0.0  |          |
| Label                           | 1.0.0  |          |
| Paragraph                       | 1.0.0  |          |
| Button                          | 1.0.0  |          |
| CheckBox                        | 1.0.0  |          |
| ComboBox                        | 1.0.0  |          |
| SelectBox                       | 1.0.0  |          |
| ContentBlock                    | 1.0.0  |          |
| Details                         | 1.0.0  |          |
| Dialogs                         | 1.0.0  |          |
| RadioButton                     | 1.0.0  |          |
| Table                           | 1.0.0  |          |
| ProgressBar                     | 1.0.0  |          |
| Toggle                          | 1.0.0  |          |
| Tabs                            | 1.0.0  |          |
| Notification                    | 1.0.0  |          |
| Badge                           | 1.0.0  |          |
| Image                           | 1.0.0  |          |
| Icons                           | 1.0.0  |          |
| WebView                         | 1.0.0  |          |
| Spinner                         | 1.0.0  |          |
| GroupRadio                      | 1.0.0  |          |
| Accordion                       | 1.0.0  |          |
| Pre                             | 1.0.0  |          |
| HtmlBlock                       | 1.0.0  |          |
| TreeView                        | 1.0.0  |          |
| SlideShow                       | 1.0.0  |          |
| TextEditor                      | 1.0.0  |          |
| FieldSet                        | 1.0.0  |          |
| Popups (Alert, Confirm, Prompt) | 1.0.0  |          |
| Forms                           | 1.0.0  |          |

### В разработке
| Компонент               | Версия | Описание |
|-------------------------|--------|----------|
| VideoPlayer             | dev    | -        |
| AudioPlayer             | dev    | -        |
| Graphs (Bar, Pie)       | dev    | -        |
| Дочерние BrowserWindows | dev    | -        |