const { Animation } = require('../modules/chui_animations');

class Dialog {
    #id = require("randomstring").generate();
    #dialog = document.createElement(`chui_dialog`);
    #content = document.createElement('dialog_content');
    #header = document.createElement('dialog_header');
    #body = document.createElement('dialog_body');
    #footer = document.createElement('dialog_footer');
    constructor(options = {
        width: String(undefined),
        height: String(undefined),
        closeOutSideClick: Boolean(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_dialog",
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
                    "border": "none"
                }
            },
            {
                name: "dialog_content",
                style: {
                    "margin": "59px auto",
                    "width": "max-content",
                    "height": "max-content",
                    "display": "flex",
                    "flex-direction": "column",
                    "padding": "7px",
                    "border-radius": "var(--border_radius)",
                    //"box-shadow": "var(--shadow_one) 0px 2.5px 7.5px, var(--shadow_two) 0px 5px 10px",
                    "border": "2px solid var(--modal_border)",
                    "color": "var(--text_color)",
                    "background": "var(--modal_background)"
                }
            },
            {
                name: "dialog_header",
                style: {
                    "display": "flex",
                    "padding-bottom": "6px",
                    //"border-bottom" : "1px solid var(--shadow_three)"
                }
            },
            {
                name: "dialog_body",
                style: {
                    //"padding": "6px 0px",
                    "display": "flex",
                    "height": "-webkit-fill-available",
                    "width": "-webkit-fill-available",
                    "overflow": "auto"
                }
            },
            {
                name: "dialog_footer",
                style: {
                    "display": "flex",
                    "padding-top": "6px",
                    //"border-top" : "1px solid var(--shadow_three)"
                }
            }
        ], 'chUiJS_Dialogs');
        this.#dialog.id = this.#id
        this.#content.style.width = options.width;
        this.#content.style.height = options.height;
        if (options.closeOutSideClick) {
            window.addEventListener('click', (event) => {
                let elem = document.getElementById(this.#id);
                if (event.target === elem) {
                    new Animation(elem).fadeOut();
                }
            })
        }        
        //ADDS
        this.#content.appendChild(this.#header)
        this.#content.appendChild(this.#body)
        this.#content.appendChild(this.#footer)
        this.#dialog.appendChild(this.#content)
    }
    addToHeader(...components) {
        for (let component of components) this.#header.appendChild(component.set());
    }
    addToBody(...components) {
        for (let component of components) this.#body.appendChild(component.set());
    }
    addToFooter(...components) {
        for (let component of components) this.#footer.appendChild(component.set());
    }
    removeFromHeader(...components) {
        for (let component of components) new Animation(component.set()).fadeOutAndRemove();
    }
    removeFromBody(...components) {
        for (let component of components) new Animation(component.set()).fadeOutAndRemove();
    }
    removeFromFooter(...components) {
        for (let component of components) new Animation(component.set()).fadeOutAndRemove();
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
        return this.#dialog;
    }
}

exports.Dialog = Dialog