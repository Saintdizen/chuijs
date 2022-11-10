const {Page, H, Icons} = require('../../../index');

class PageRouteThree extends Page {
    constructor(page) {
        super();
        this.setTitle('Страница 3');
        this.setMain(false)
        this.setBackButton({ title: "Назад", icon: Icons.NAVIGATION.ARROW_BACK, reverse: true, page: page })
        let h1 = new H(1, "Страница 3")
        this.add(h1)
    }
}
exports.PageRouteThree = PageRouteThree