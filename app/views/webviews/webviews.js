const {Page, WebView} = require('../../../index');

class WebViewsPage extends Page {
    constructor() {
        super();
        this.setTitle('Веб бразуер');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()
        this.disablePadding()

        let web = new WebView("https://music.yandex.ru/", false);
        web.insertCustomRes({
            cssPath: __dirname + '/test.css',
            jsPath: __dirname + '/test.js'
        })

        web.addFinishLoadEvent(async () => {
            await web.send("test", "Xyu")
        })

        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage