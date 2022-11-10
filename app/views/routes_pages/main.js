const {Page, Button, Route, H} = require('../../../index');

let {PageRouteOne} = require("../routes_pages/page1");
let {PageRouteTwo} = require("../routes_pages/page2");
let {PageRouteThree} = require("../routes_pages/page3");

class MainPageRoute extends Page {
    constructor() {
        super();
        this.setTitle('Главная переходов');
        this.setMain(false)
        let h1 = new H(1, "Главная переходов")
        this.add(h1)

        let routeButton1 = new Button({
            title: "Переход на страницу 1",
            clickEvent: () => {
                new Route().go(new PageRouteOne(this))
            }
        })
        let routeButton2 = new Button({
            title: "Переход на страницу 2",
            clickEvent: () => {
                new Route().go(new PageRouteTwo(this))
            }
        })
        let routeButton3 = new Button({
            title: "Переход на страницу 3",
            clickEvent: () => {
                new Route().go(new PageRouteThree(this))
            }
        })

        this.add(routeButton1, routeButton2, routeButton3)
    }
}
exports.MainPageRoute = MainPageRoute