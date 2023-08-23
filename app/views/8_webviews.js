const {Page, WebView} = require('../../index');

class WebViewsPage extends Page {
    constructor() {
        super();
        this.setTitle('Веб бразуер');
        this.setMain(true)
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
        web.insertCustomCSS('.player-controls.deco-player-controls { backdrop-filter: blur(16px); background-color: #22222250 !important; }')
        web.addFinishLoadEvent(() => console.log(this.getTitle()));

        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage