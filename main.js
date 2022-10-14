const { Main, MenuItem } = require('./index');
const main = new Main({
    name: "test",
    width: 1600,
    height: 800,
    render: `${__dirname}/app/app.js`,
    devTools: true
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