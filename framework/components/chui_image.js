const {Animation} = require("../modules/chui_animations");
const sizeOf = require("image-size");
const electron = require("electron");

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
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                }
            }
        ], 'chUiJS_Image');
        let image = document.createElement('img');
        image.style.width = options.width //'-webkit-fill-available';
        image.style.height = options.height // '-webkit-fill-available';
        if (options.disableMargin) this.#chui_image.style.margin = '0px';
        if (options.path !== undefined) image.setAttribute('src', `data:image/png;base64,${require('fs').readFileSync(options.path).toString("base64")}`)
        if (options.base64 !== undefined) image.setAttribute('src', `data:image/png;base64,${options.base64}`);
        if (options.width !== undefined) this.#chui_image.style.width = options.width;
        if (options.height !== undefined) this.#chui_image.style.height = options.height;
        this.#chui_image.appendChild(image);

        if (options.openPopup) {
            this.#chui_image.addEventListener("click", () => {
                let popup;
                const widow_size = document.body.getBoundingClientRect();
                if (options.path !== undefined) {
                    //
                    let imageSet;
                    const dimensions = sizeOf(options.path);
                    if (dimensions.height > dimensions.width) {
                        imageSet = new Image({ disableMargin: true, openPopup: false, path: options.path, width: "auto", height: "-webkit-fill-available" });
                        popup = new ImagePopup(imageSet.set(), "auto", "-webkit-fill-available");
                    } else {
                        imageSet = new Image({ disableMargin: true, openPopup: false, path: options.path, width: "auto", height: "auto" });
                        popup = new ImagePopup(imageSet.set(), "auto", "-webkit-fill-available");
                    }
                }
                if (options.base64 !== undefined) {
                    let image_size; let popup_size; let imageSet; let img = Buffer.from(options.base64, 'base64'); let dimensions = sizeOf(img);

                    if (widow_size.width < dimensions.width) {
                        image_size = ["-webkit-fill-available", "auto"];
                    } else if (widow_size.height < dimensions.height) {
                        image_size = ["auto", "-webkit-fill-available"];
                    } else if (widow_size.width > dimensions.width) {
                        image_size = [`auto`, ""];
                    } else {
                        image_size = [`-webkit-fill-available`, "-webkit-fill-available"];
                    }
                    popup_size = ["93%", "93%"];

                    //
                    imageSet = new Image({ disableMargin: true, openPopup: false, base64: options.base64, width: image_size[0], height: image_size[1] });
                    popup = new ImagePopup(imageSet.set(), popup_size[0], popup_size[1]);
                }
                document.getElementById("app").appendChild(popup.set())
                popup.open();
            })
        }
    }
    setWidth(value) {
        this.#chui_image.style.width = value;
    }
    setHeight(value) {
        this.#chui_image.style.height = value;
    }
    set() { return this.#chui_image; }
}

class ImagePopup {
    #id = require("randomstring").generate();
    #chui_image_popup = document.createElement(`chui_image_popup`);
    #image_popup_content = document.createElement('image_popup_content');
    constructor(image, width, height) {
        this.#chui_image_popup.id = this.#id
        window.addEventListener('click', (event) => {
            let elem = document.getElementById(this.#id);
            if (event.target === elem) new Animation(elem).fadeOut();
        })
        //ADDS
        this.#image_popup_content.style.width = width
        this.#image_popup_content.style.height = height
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