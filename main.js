const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "test",
    width: 1600,
    height: 900,
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