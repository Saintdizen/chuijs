const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "Test Application",
    width: 1300,
    height: 900,
    render: `${__dirname}/app/app.js`,
    devTools: false
});
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${require("./package.json").version}`),
        new MenuItem().separator(),
        new MenuItem().button('Скрыть | Показать', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit("Выход"),
    ]
})
//main.enableAutoUpdateApp(1000);