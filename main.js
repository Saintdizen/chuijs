const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "Test Application",
    width: 1600,
    height: 600,
    render: `${__dirname}/app/app.js`,
    devTools: false
});
main.start({
    tray: [
        new MenuItem().button('Скрыть | Показать', () => main.hideAndShow()),
        new MenuItem().separator(),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().separator(),
        new MenuItem().quit("Выход")
    ]
})
main.enableAutoUpdateApp(1000);

