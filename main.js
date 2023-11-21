const { Main, MenuItem, path, App} = require('./index');
let json = require("./package.json");
const main = new Main({
    name: `${json.name} (${json.version})`,
    width: 1280,
    height: 720,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: false,
    //icon: `${__dirname}/icon.png`
    paths: {
        downloadPath: path.join(App.userDataPath(), "downloads")
    }
});
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${json.version}`),
        new MenuItem().separator(),
        new MenuItem().button('Скрыть | Показать', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit("Выход"),
    ]
})
//main.enableAutoUpdateApp(1000, require("./update.json"));