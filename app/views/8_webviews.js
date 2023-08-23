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
        web.insertCustomCSS([
            {
                name: ".theme-white .deco-player-controls",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                }
            },
            {
                name: ".theme-black .deco-player-controls",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                }
            },
            {
                name: ".theme-white .deco-pane",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                }
            },
            {
                name: ".theme-black .deco-pane",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                }
            },
            {
                name: ".theme-white .deco-popup-menu, .theme-white .deco-pane-popup",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                }
            },            {
                name: ".theme-black .deco-popup-menu, .theme-black .deco-pane-popup",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                    "border-radius": "10px"
                }
            },
            //
            {
                name: "figure, img, .entity-cover.deco-entity-image-placeholder.track-cover.entity-cover_size_Large, .d-cover__wrapper.playlist-cover__wrapper",
                style: {
                    "border-radius": "10px"
                }
            },
            {
                name: ".rup__animation",
                style: {
                    "display": "none"
                }
            }
        ])
        web.addFinishLoadEvent(() => console.log(this.getTitle()));

        this.add(web)
    }
}

exports.WebViewsPage = WebViewsPage