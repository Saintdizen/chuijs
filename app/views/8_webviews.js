const {Page, WebView, TextInput, Button} = require('../../index');

class WebViewsPage extends Page {
    constructor() {
        super();
        this.setTitle('Веб бразуер');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()
        this.disablePadding()

        let web = new WebView("https://music.yandex.ru/");
        web.customScrollBar({
            enable: true,
            width: "6px",
            trackBackgroundColor: "inherit",
            thumbRadius: "6px",
            thumbColor: "#fcca00"
        });
        web.addFinishLoadEvent(() => console.log(this.getTitle()));

        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage