# chuijs
### Структура
#### exampleApp / app / views / main.js
```javascript
const { Page, Button, TextInput, Notification, NotificationStyle } = require('chuijs');
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
Themes (Dark|Light), Route, Page, ElectronTray, TelegramBot API
### Компоненты
AppLayout, DateInput, NumberInput, EmailInput, TextArea,
PasswordInput, FileInput, H1, H2, H3, H4, H5, H6, Label, 
Paragraph, Button, CheckBox, ComboBox, SelectBox, 
ContentBlock, Details, Dialogs, RadioButton, Table, 
ProgressBar, Toggle, Tabs, Notification, Badge, 
Image, Graphs (Bar, Pie), Icons, WebView, Spinner,
GroupRadio, Accordion, Pre, HtmlBlock, TreeView, SlideShow,
TextEditor, FieldSet, Popups (Alert, Confirm, Prompt)
### В разработке
ContextMenu, Forms