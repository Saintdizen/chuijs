const {Animation} = require("../modules/chui_animations");
const sizeOf = require("image-size");
const electron = require("electron");
const {Icon, Icons} = require("./chui_icons");

class Image {
    #chui_image = document.createElement('chui_image');
    #image = document.createElement('img');
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
                name: "popup_content_test",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                }
            },
            {
                name: "image_popup_content",
                style: {
                    "width": "max-content",
                    "height": "max-content",
                    "display": "block",
                }
            },
            {
                name: "image_popup_close",
                style: {
                    "color": "var(--text_color)",
                    "position": "absolute",
                    "top": "48px",
                    "right": "48px",
                    "width": "60px",
                    "height": "60px",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "image_popup_close:hover",
                style: {
                    "background-color": "var(--button_background)",
                }
            },
            {
                name: "image_popup_close:hover chui_icon",
                style: {
                    "color": "var(--button_text_color)",
                }
            }
        ], 'chUiJS_Image');
        if (options.disableMargin) this.#chui_image.style.margin = '0px';
        if (options.path !== undefined) this.#image.setAttribute('src', `data:image/png;base64,${require('fs').readFileSync(options.path).toString("base64")}`)
        if (options.base64 !== undefined) this.#image.setAttribute('src', `data:image/png;base64,${options.base64}`);
        if (options.width !== undefined) this.#chui_image.style.width = options.width;
        if (options.height !== undefined) this.#chui_image.style.height = options.height;
        if (options.width !== undefined) this.#image.style.width = options.width;
        if (options.height !== undefined) this.#image.style.height = options.height;
        this.#chui_image.appendChild(this.#image);

        if (options.openPopup) {
            this.#chui_image.addEventListener("click", () => {
                let popup;
                let widow_size = document.body.getBoundingClientRect();
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
                    let image_size; let imageSet; let img = Buffer.from(options.base64, 'base64'); let dimensions = sizeOf(img);
                    if (dimensions.height > widow_size.height) {
                        image_size = ["auto", `${widow_size.height}px`]
                    } else if (dimensions.width > widow_size.width) {
                        image_size = [`${widow_size.height}px`, "auto"]
                    } else {
                        image_size = ["auto", `auto`]
                    }
                    //
                    imageSet = new Image({ disableMargin: true, openPopup: false, base64: options.base64, width: image_size[0], height: image_size[1] });
                    popup = new ImagePopup(imageSet.set(), "max-content", "max-content");


                }
                document.getElementById("app").appendChild(popup.set())
                popup.open();
            })
        }
    }
    setWidth(value) {
        this.#chui_image.style.width = value;
        this.#chui_image.style.width = value;
    }
    setHeight(value) {
        this.#chui_image.style.height = value;
        this.#chui_image.style.width = value;
    }
    set() { return this.#chui_image; }
}

class ImagePopup {
    #id = require("randomstring").generate();
    #chui_image_popup = document.createElement(`chui_image_popup`);
    #popup_content = document.createElement('popup_content_test');
    #image_popup_content = document.createElement('image_popup_content');
    #close_popup = document.createElement("image_popup_close")
    constructor(image, width, height) {
        this.#chui_image_popup.id = this.#id
        //ADDS
        this.#image_popup_content.style.width = width
        this.#image_popup_content.style.height = height
        this.#image_popup_content.appendChild(image);

        this.#close_popup.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "30px", "").getHTML();
        this.#close_popup.addEventListener("click", () => this.close());

        this.#popup_content.appendChild(this.#image_popup_content)
        this.#popup_content.appendChild(this.#close_popup);
        this.#chui_image_popup.appendChild(this.#popup_content);
    }
    open() {
        let dialog = document.getElementById(this.#id);
        new Animation(dialog).fadeIn();
        new Animation(dialog.firstChild).scaleIn();
    }
    close() {
        let dialog = document.getElementById(this.#id);
        new Animation(dialog.firstChild).scaleOut();
        new Animation(dialog).fadeOutAndRemove();
    }
    set() {
        return this.#chui_image_popup;
    }
}

exports.Image = Image;