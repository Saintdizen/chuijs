const { Main, MenuItem, Log, App, path} = require('./index');
let json = require("./package.json");
const main = new Main({
    name: `${json.name} (${json.version})`,
    width: 1300,
    height: 900,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    //icon: `${__dirname}/icon.png`
});
main.start({
    hideOnClose: true,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${json.version}`),
        new MenuItem().separator(),
        new MenuItem().button('Скрыть | Показать', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit("Выход"),
    ]
})
Log.info("dsaas")
//main.enableAutoUpdateApp(1000, require("./update.json"));