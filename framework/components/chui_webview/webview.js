const { Animation } = require('../../modules/chui_animations/animations')
const { Spinner } = require('../chui_spinner/spinner')
const fs = require("fs");


// https://www.electronjs.org/ru/docs/latest/api/webview-tag
class WebView {
    #id = require("randomstring").generate()
    #main_block = document.createElement('chui_webview')
    #WebView = document.createElement('webview')
    #chui_load = document.createElement('chui_load')
    constructor(url = String()) {
        require('../../modules/chui_functions').setStyles(__dirname + '/styles.css', 'chUiJS_WebView');
        this.#WebView.setAttribute('id', this.#id)
        this.#WebView.setAttribute('src', url)
        this.#WebView.setAttribute('nodeintegration', 'true');
        this.#WebView.setAttribute('nodeintegrationinsubframes', 'true');
        this.#WebView.setAttribute('plugins', 'true')
        this.#WebView.setAttribute('useragent', getFirefoxUserAgent())
        this.#WebView.setAttribute('disablewebsecurity', 'true')
        this.#WebView.setAttribute('allowpopups', 'true')
        this.#WebView.setAttribute("webpreferences", "allowRunningInsecureContent, javascript=yes")

        let spinner = new Spinner(Spinner.SIZE.BIG);
        this.#chui_load.appendChild(spinner.set());
        this.#main_block.appendChild(this.#WebView)

        const loadStart = () => {
            this.#main_block.appendChild(this.#chui_load)
        }
        const loadStop = () => {
            new Animation(this.#WebView).fadeIn();
            this.#main_block.removeChild(this.#chui_load)
        }
        this.#WebView.addEventListener('did-start-loading', loadStart)
        this.#WebView.addEventListener('did-stop-loading', loadStop)
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
    insertCustomCSS(pathToCSSFile) {
        this.#WebView.addEventListener('dom-ready', () => {
            let data = fs.readFileSync(pathToCSSFile, 'utf8');
            this.#WebView.insertCSS(String(data)).catch(r => console.log(r));
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