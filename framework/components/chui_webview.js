const { Animation } = require('../modules/chui_animations')
const { Spinner, SpinnerSize } = require('../components/chui_spinner')

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
        ], 'chui_WebView');
        this.#WebView.setAttribute('id', this.#id)
        this.#WebView.setAttribute('useragent', getFirefoxUserAgent())
        this.#WebView.setAttribute('allowpopups', 'true')
        this.#WebView.setAttribute('src', url)
        this.#main_block.appendChild(this.#WebView)
        this.#main_block.appendChild(this.#chui_load)
        let spinner = new Spinner(SpinnerSize.BIG);
        const loadstart = () => {
          this.#chui_load.appendChild(spinner.set())
        }
        const loadstop = () => {
            new Animation(this.#WebView).appearance()
            spinner.remove()
        }
        this.#WebView.addEventListener('did-start-loading', loadstart)
        this.#WebView.addEventListener('did-stop-loading', loadstop)
    }
    execJS(script) {
        this.#WebView.executeJavaScript(script).then(r => console.log(r))
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