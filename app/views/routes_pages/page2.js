const {Page, H, Icons} = require('../../../index');

class PageRouteTwo extends Page {
    constructor(page) {
        super();
        this.setTitle('Страница 2');
        this.setMain(false)
        this.setBackButton({ title: "Назад", icon: Icons.NAVIGATION.ARROW_BACK, reverse: true, page: page })
        let h1 = new H(1, "Страница 2")
        this.add(h1)
    }
}
exports.PageRouteTwo = PageRouteTwo