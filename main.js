const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "test",
    width: 1366,
    height: 768,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    menuBarVisible: false
});

main.start({
    hideOnClose: false,
    menuBar: [
        new MenuItem().forceReload("Перезагрузить"),
        new MenuItem().toggleDevTools("Консоль")
    ],
    tray: [
        new MenuItem().button('Показать \ Скрыть', () => main.hideAndShow()),
        new MenuItem().separator(),
        new MenuItem().toggleDevTools('Консоль разработчика'),
        new MenuItem().separator(),
        new MenuItem().quit("Выход")
    ]
})