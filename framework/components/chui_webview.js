const { Animation } = require('../modules/chui_animations')
const { Spinner } = require('../components/chui_spinner')


// https://www.electronjs.org/ru/docs/latest/api/webview-tag
class WebView {
    #id = require("randomstring").generate()
    #main_block = document.createElement('chui_webview')
    #WebView = document.createElement('webview')
    #chui_load = document.createElement('chui_load')
    constructor(url) {
          require('../modules/chui_functions').style_parse([
            {
                name: "chui_webview",
                style: {
                    "position": "relative",
                    "width": "-webkit-fill-available",
                    "height": "100%"
                }
            },
            {
              name: "chui_load",
              style: {
                  "display": "flex",
                  "width": "-webkit-fill-available",
                  "height": "100%",
                  "position": "absolute",
                  "top": "0px",
                  "left": "0px",
                  "justify-content": "center",
                  "align-items": "center",
                  "z-index": "0"
              }
          },
          {
            name: "webview",
            style: {
                "height": "100%",
                "width": "-webkit-fill-available",
                "display": "none",
                "z-index": "1"
            }
          },
          {
            name: "webview.hide",
            style: {
                "visibility": "hidden"
            }
          }
        ], 'chUiJS_WebView');
        this.#WebView.setAttribute('id', this.#id)
        this.#WebView.setAttribute('useragent', getFirefoxUserAgent())
        this.#WebView.setAttribute('allowpopups', 'true')
        this.#WebView.setAttribute('src', url)
        this.#main_block.appendChild(this.#WebView)
        this.#main_block.appendChild(this.#chui_load)
        let spinner = new Spinner(Spinner.SIZE.BIG);
        const loadStart = () => {
            this.#chui_load.appendChild(spinner.set());
        }
        const loadStop = () => {
            spinner.remove();
            new Animation(this.#WebView).fadeIn();
        }
        this.#WebView.addEventListener('did-start-loading', loadStart)
        this.#WebView.addEventListener('did-stop-loading', loadStop)
    }
    execJS(script) {
        this.#WebView.executeJavaScript(script).then(r => console.log(r))
    }
    addStartLoadEvent(listener = () => {}) {
        this.#WebView.addEventListener('did-start-loading', listener)
    }
    addStopLoadEvent(listener = () => {}) {
        this.#WebView.addEventListener('did-stop-loading', listener)
    }
    addFinishLoadEvent(listener = () => {}) {
        this.#WebView.addEventListener('did-finish-load', listener)
    }
    customScrollBar(options = {
        enable: Boolean(false),
        width: String("6px"),
        trackBackgroundColor: String("inherit"),
        thumbRadius: String("6px"),
        thumbColor: String("inherit")
    }) {
        this.#WebView.addEventListener('did-start-loading', () => {
            if (options.enable) {
                let webview = document.getElementById(this.#id);
                webview.addEventListener('dom-ready', function () {
                    webview.insertCSS(`*::-webkit-scrollbar { width: ${options.width}; }
                    *::-webkit-scrollbar-track { background-color: ${options.trackBackgroundColor}; }
                    *::-webkit-scrollbar-thumb { border-radius: ${options.thumbRadius}; background: ${options.thumbColor}; }`);
                });
            }
        })
    }
    set() {
        return this.#main_block
    }
}

const getFirefoxUserAgent = () => {
    const rootUAs = {
      mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
      windows: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
      linux: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
    };
    let rootUA;
    if (process.platform === 'win32') {
      rootUA = rootUAs.windows;
    } else if (process.platform === 'darwin') {
      rootUA = rootUAs.mac;
    } else {
      rootUA = rootUAs.linux;
    }
    const fxVersion = 91 + Math.floor((Date.now() - 1628553600000) / (4.1 * 7 * 24 * 60 * 60 * 1000));
    return rootUA.replace(/FXVERSION/g, fxVersion);
};

exports.WebView = WebView