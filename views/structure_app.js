class StructureApp extends Page {
    constructor() {
        super();
        let main_block = new ContentBlock({
            flexDirection: ContentBlock.flexDirection.COLUMN,
            justifyContent: ContentBlock.justifyContent.CENTER,
            alignItems: ContentBlock.alignItems.CENTER
        });
        main_block.style().padding(true);
        main_block.style().margin(true);

        let structure_block = new ContentBlock({
            width: "max-content",
            height: "max-content"
        });
        let structure = new H(1, "exampleApp/");
        structure_block.add(structure);
        main_block.add(structure_block);

        let app_views_main_js_block = new ContentBlock({
            width: "max-content",
            height: "max-content",
            alignItems: ContentBlock.alignItems.CENTER,
            flexDirection: ContentBlock.flexDirection.COLUMN,
        });
        let app_views_main_js = new H(1, "app/views/main.js");
        let app_views_main_js_code = new CodeBlock(`const { Page, Button, TextInput, Notification, NotificationStyle } = require('chui-electron');
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
            new Notification(\`Привет, \${input_name.getValue()}!\`, NotificationStyle.SIMPLE).show();
        });
        this.add(input_name, hello);
    }
}
exports.MainPage = MainPage`);
        app_views_main_js_code.style().fontSize(18);
        app_views_main_js_block.add(app_views_main_js, app_views_main_js_code);
        main_block.add(app_views_main_js_block);

        let app_js_block = new ContentBlock({
            width: "max-content",
            height: "max-content",
            alignItems: ContentBlock.alignItems.CENTER,
            flexDirection: ContentBlock.flexDirection.COLUMN,
        });
        let app_js = new H(1, "app/app.js");
        let app_js_code = new CodeBlock(`/** RENDERER ПРОЦЕСС */
/** ИМПОРТЫ */
const { AppLayout, render, ipcRenderer } = require('chui-electron');
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
ipcRenderer.send('hi', 'Привет!')`);
        app_js_code.style().fontSize(18);
        app_js_block.add(app_js, app_js_code);
        main_block.add(app_js_block);

        let app_index_js_block = new ContentBlock({
            width: "max-content",
            height: "max-content",
            alignItems: ContentBlock.alignItems.CENTER,
            flexDirection: ContentBlock.flexDirection.COLUMN,
        });
        let app_index_js = new H(1, "main.js");
        let app_index_js_code = new CodeBlock(`/** main.js */
const { Main, ipcMain, MenuItem } = require('chui-electron');
const main = new Main({
    name: "exampleApp",
    width: 600,
    height: 780,
    render: \`\${__dirname}/app/app.js\`,
    devTools: false,
    menuBarVisible: true,
    /** Установка иконки */
    /** icon: \`\${__dirname}/resources/icons/app/icon.png\` */
})
/** Получение данных из render процесса */
ipcMain.on('hi', (e, text) => {
    console.log(text)
})
/** Запуск приложения */
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().button('Показать \\\\ Скрыть', () => { main.hideAndShow() }),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit('Выход')
    ],
    menuBar: [
        new MenuItem().button('Показать \\\\ Скрыть', () => { main.hideAndShow() }),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit('Выход')
    ]
})`);
        app_index_js_code.style().fontSize(18);
        app_index_js_block.add(app_index_js, app_index_js_code);
        main_block.add(app_index_js_block);

        this.add(main_block);
    }
}