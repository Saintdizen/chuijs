/** main.js */
const { Main, ipcMain, MenuItem } = require('chuijs');
const main = new Main({
    name: "chuijs example app",
    width: 600,
    height: 780,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    menuBarVisible: true,
    /** Установка иконки */
    /** icon: `${__dirname}/resources/icons/app/icon.png` */
})
/** Получение данных из render процесса */
ipcMain.on('hi', (e, text) => {
    console.log(text)
})
/** Запуск приложения */
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().button('Показать \\ Скрыть', () => { main.hideAndShow() }),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit('Выход')
    ],
    menuBar: [
        new MenuItem().button('Показать \\ Скрыть', () => { main.hideAndShow() }),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit('Выход')
    ]
})