# chuijs
**Данный фреймворк будет позволять описывать страницы приложения только в виде JavaScript кода**
### Структура
#### exampleApp / app / views / main.js
```javascript
const { Page, Button, TextInput, Notification, NotificationStyle } = require('chuijs');
class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Сказать привет!');
        this.setMain(true);
        let input_name = new TextInput({
            title: 'Введите ваше имя',
            placeholder: 'Введите ваше имя',
            required: false
        });
        let hello = new Button('Сказать привет!', () => {
            new Notification(`Привет, ${input_name.getValue()}!`, NotificationStyle.SIMPLE).show();
        });
        this.add(input_name, hello);
    }
}
exports.MainPage = MainPage
```
#### exampleApp / app / app.js
```javascript
/** RENDERER ПРОЦЕСС */
/** ИМПОРТЫ */
const { AppLayout, render, ipcRenderer } = require('chuijs');
/** СТРАНИЦЫ */
const { MainPage } = require('../app/views/main');
class App extends AppLayout {
    constructor() {
        super();
        //this.setDarkMode();
        /** РОУТЫ */
        this.setRoute(new MainPage());
    }
}
render(() => new App()).catch(err => console.log(err))
/** ipcRenderer */
ipcRenderer.send('hi', 'Привет!')
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
### Модули
**Themes (Dark|Light), Route, Page, ElectronTray, ElectronMenuBar**
### Компоненты
**AppLayout, DateInput, NumberInput, EmailInput, TextArea,
PasswordInput, FileInput, H1, H2, H3, H4, H5, H6, Label, 
Paragraph, Button, CheckBox, ComboBox, SelectBox, 
ContentBlock, Details, Dialogs, RadioButton, Table, 
ProgressBar, Toggle, Tabs, Notification, Badge, 
Image, Graphs (Bar, Pie), Icons, WebView, Spinner,
GroupRadio, Accordion, Pre, HtmlBlock, TreeView, SlideShow, TextEditor**
### В разработке
**ContextMenu, Forms**