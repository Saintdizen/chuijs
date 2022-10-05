const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "test",
    width: 1366,
    height: 768,
    render: `${__dirname}/app/app.js`,
    devTools: false
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