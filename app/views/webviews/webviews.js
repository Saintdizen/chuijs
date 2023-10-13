const {Page, WebView} = require('../../../index');

class WebViewsPage extends Page {
    constructor() {
        super();
        this.setTitle('Веб бразуер');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()
        this.disablePadding()

        let web = new WebView("https://music.yandex.ru/");
        //web.insertCustomCSS(__dirname + '/test.css')
        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage