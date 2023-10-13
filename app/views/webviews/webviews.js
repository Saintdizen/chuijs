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
        web.insertCustomCSS(__dirname + '/test.css')
        //web.executeJavaScript("Mu.blocks.di.repo.player.play();")
        web.executeJavaScript("document.querySelector(\"body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.head-container > div > div > div.head-kids__left\").remove();")
        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage