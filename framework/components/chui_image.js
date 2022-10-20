const {Animation} = require("../modules/chui_animations");
const sizeOf = require("image-size");

class Image {
    #chui_image = document.createElement('chui_image');
    constructor(options = {
        path: String(),
        base64: String(),
        width: String(),
        height: String(),
        openPopup: Boolean(),
        disableMargin: Boolean()
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_image",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "display": "flex"
                }
            },
            {
                name: "img",
                style: {
                    "border-radius": "var(--border_radius)"
                }
            },
            // IMAGE POPUP
            {
                name: "chui_image_popup",
                style: {
                    "display": "none",
                    "position": "fixed",
                    "z-index": "1000",
                    "left": "0",
                    "top": "0",
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "overflow": "auto",
                    "background-color": "var(--modal_overlay)",
                    "padding": "0px",
                    "border": "none",
                    "backdrop-filter": "saturate(150%) blur(15px)"
                }
            },
            {
                name: "image_popup_content",
                style: {
                    "margin": "auto",
                    "width": "max-content",
                    "height": "max-content",
                    "display": "block",
                }
            }
        ], 'chUiJS_Image');
        let image = document.createElement('img');
        image.style.width = '-webkit-fill-available';
        image.style.height = '-webkit-fill-available';
        if (options.disableMargin) this.#chui_image.style.margin = '0px';
        if (options.path !== undefined) image.setAttribute('src', `data:image/png;base64,${require('fs').readFileSync(options.path).toString("base64")}`)
        if (options.base64 !== undefined) image.setAttribute('src', `data:image/png;base64,${options.base64}`);
        if (options.width !== undefined) this.#chui_image.style.width = options.width;
        if (options.height !== undefined) this.#chui_image.style.height = options.height;
        this.#chui_image.appendChild(image);

        if (options.openPopup) {
            this.#chui_image.addEventListener("click", () => {
                let image = this.#chui_image;
                let popup;
                if (options.path !== undefined) {
                    let width = undefined; let height = undefined;
                    const dimensions = sizeOf(options.path);
                    if (dimensions.height > dimensions.width) {

                    }

                    console.log(dimensions.width, dimensions.height);
                    popup = new ImagePopup(new Image({ disableMargin: true, openPopup: false, path: options.path, width: "-webkit-fill-available", height: "-webkit-fill-available" }).set());
                    document.getElementById("app").appendChild(popup.set())
                }
                if (options.base64 !== undefined) {
                    let img = Buffer.from(options.base64, 'base64');
                    let dimensions = sizeOf(img);
                    console.log(dimensions.width, dimensions.height);
                    popup = new ImagePopup(new Image({ disableMargin: true, openPopup: false, base64: options.base64, width: "-webkit-fill-available", height: "-webkit-fill-available" }).set());
                    document.getElementById("app").appendChild(popup.set())
                }
                popup.open();
            })
        }
    }
    set() { return this.#chui_image; }
}

class ImagePopup {
    #id = require("randomstring").generate();
    #chui_image_popup = document.createElement(`chui_image_popup`);
    #image_popup_content = document.createElement('image_popup_content');
    constructor(image) {
        this.#chui_image_popup.id = this.#id
        window.addEventListener('click', (event) => {
            let elem = document.getElementById(this.#id);
            if (event.target === elem) new Animation(elem).fadeOut();
        })
        //ADDS
        this.#image_popup_content.appendChild(image);
        this.#chui_image_popup.appendChild(this.#image_popup_content);
    }
    open() {
        let dialog = document.getElementById(this.#id);
        new Animation(dialog).fadeIn();
        new Animation(dialog.firstChild).scaleIn();
    }
    close() {
        let dialog = document.getElementById(this.#id);
        new Animation(dialog.firstChild).scaleOut();
        new Animation(dialog).fadeOut();
    }
    set() {
        return this.#chui_image_popup;
    }
}

exports.Image = Image;