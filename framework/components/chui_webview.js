const { Animation } = require('../modules/chui_animations')
const { Spinner } = require('../components/chui_spinner')


// https://www.electronjs.org/ru/docs/latest/api/webview-tag
class WebView {
    #id = require("randomstring").generate()
    #main_block = document.createElement('chui_webview')
    #WebView = document.createElement('webview')
    #chui_load = document.createElement('chui_load')
    constructor(url = String()) {
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
        this.#WebView.addEventListener('did-start-loading', () => {
            this.#WebView.addEventListener('dom-ready', () => {
                this.#WebView.executeJavaScript(script, true).catch(r => console.log(r))
            });
        })
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
                this.#WebView.addEventListener('dom-ready', () => {
                    this.#WebView.insertCSS(`*::-webkit-scrollbar { width: ${options.width}; }
                    *::-webkit-scrollbar-track { background-color: ${options.trackBackgroundColor}; }
                    *::-webkit-scrollbar-thumb { border-radius: ${options.thumbRadius}; background: ${options.thumbColor}; }`).catch(r => console.log(r));
                });
            }
        })
    }
    insertCustomCSS(cssJson) {
        this.#WebView.addEventListener('dom-ready', () => {
            let parsed_json = JSON.parse(JSON.stringify(cssJson));
            let css_array_string = [];
            for (let i = 0; i < parsed_json.length; i++) {
                css_array_string.push(`${parsed_json[i].name} {`)
                JSON.parse(JSON.stringify(parsed_json[i].style), function(key, value) {
                    if (typeof value !== 'object') css_array_string.push(`${key}:${value};`)
                    return value;
                });
                css_array_string.push(`}\n`)
            }
            this.#WebView.insertCSS(css_array_string.join("").slice(0, -1)).catch(r => console.log(r));
        });
    }
    setUrl(url = String()) {
        this.#WebView.setAttribute('src', url)
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
    return rootUA.replace(/FXVERSION/g, 91 + Math.floor((Date.now() - 1628553600000) / (4.1 * 7 * 24 * 60 * 60 * 1000)));
};

exports.WebView = WebView