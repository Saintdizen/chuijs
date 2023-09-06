const { Main, MenuItem } = require('./index');
let json = require("./package.json");
const main = new Main({
    name: `${json.name} (${json.version})`,
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