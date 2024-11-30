const { Animation } = require('../../modules/chui_animations/animations');

class Dialog {
    #id = require("randomstring").generate();
    #dialog = document.createElement(`chui_dialog`);
    #header = document.createElement('dialog_header');
    #body = document.createElement('dialog_body');
    #footer = document.createElement('dialog_footer');
    //
    #width = undefined;
    #height = undefined;
    constructor(options = { width: String(), height: String(), closeOutSideClick: Boolean(), transparentBack: String() }) {

        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Dialogs');
        this.#dialog.id = this.#id

        if (options.width === undefined) {
            this.#width = "max-content";
            this.#dialog.style.width = "max-content";
        } else {
            this.#width = options.width
            this.#dialog.style.width = options.width;
        }
        if (options.height === undefined) {
            this.#height = "max-content";
            this.#dialog.style.height = "max-content";
        } else {
            this.#height = options.height
            this.#dialog.style.height = options.height;
        }

        if (options.closeOutSideClick) {
            window.addEventListener('click', (event) => {
                let elem = document.getElementById(this.#id);
                if (event.target === elem) {
                    new Animation(elem).fadeOut();
                }
            })
        }
        if (options.transparentBack) {
            this.#dialog.style.background = "var(--ap_main_background)";
        }
        //ADDS
        this.#dialog.appendChild(this.#body)
    }
    addToHeader(...components) {
        this.#dialog.insertBefore(this.#header, this.#body)
        for (let component of components) this.#header.appendChild(component.set());
    }
    addToBody(...components) {
        for (let component of components) this.#body.appendChild(component.set());
    }
    addToFooter(...components) {
        this.#dialog.appendChild(this.#footer)
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
        const dialog = document.getElementById(this.#id);
        window.addEventListener("resize", (event) => {
            const width = parseInt(event.currentTarget.getComputedStyle(dialog).width) + "px"
            dialog.style.left = `calc(100% / 2 - ${width} / 2)`;
            // Высота
            const height = parseInt(event.currentTarget.getComputedStyle(dialog).height) + "px"
            dialog.style.top = `calc(100% / 2 - ${height} / 2)`;
        })
        new Animation(dialog).fadeIn();
        this.#setCenter(dialog)
    }
    close() {
        const dialog = document.getElementById(this.#id);
        new Animation(dialog).fadeOut();
    }
    set() {
        return this.#dialog;
    }
    #setCenter(element) {
        // Ширина
        const width = parseInt(window.getComputedStyle(element).width) + "px"
        element.style.left = `calc(100% / 2 - ${width} / 2)`;
        // Высота
        const height = parseInt(window.getComputedStyle(element).height) + "px"
        element.style.top = `calc(100% / 2 - ${height} / 2)`;
    }
}

exports.Dialog = Dialog