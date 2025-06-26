const {Animation} = require('../../modules/chui_animations/animations');

class Dialog {
    #id = require("randomstring").generate();
    #dialog = document.createElement(`chui_dialog`);
    #header = document.createElement('dialog_header');
    #body = document.createElement('dialog_body');
    #footer = document.createElement('dialog_footer');
    //
    #width = undefined;
    #height = undefined;
    isOpen = false;

    constructor(options = {
        width: String(),
        height: String(),
        closeOutSideClick: false
    }) {

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
            this.#dialog.addEventListener("animationend", (evt) => {
                if (evt.animationName === "fade-in") window.addEventListener('click', this.#closeOutsideEvent)
            })
        }
        //ADDS
        this.#dialog.appendChild(this.#body)
    }

    #closeOutsideEvent = (event) => {
        const dialog = document.getElementById(this.#id);
        if (!dialog.contains(event.target)) {
            window.removeEventListener("click", this.#closeOutsideEvent)
            this.close()
        }
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
        this.isOpen = true
        const dialog = document.getElementById(this.#id);
        // if (this.#width === "-webkit-fill-available" && this.#height === "-webkit-fill-available") {
        //     dialog.style.top = "0"
        //     dialog.style.left = "0"
        //     new Animation(dialog).fadeIn();
        // } else {
        //     window.addEventListener("resize", (event) => this.#setCenter(dialog, event.currentTarget))
        //     new Animation(dialog).fadeIn();
        //     this.#setCenter(dialog, window)
        // }

        window.addEventListener("resize", (event) => this.#setCenter(dialog, event.currentTarget))
        new Animation(dialog).fadeIn();
        this.#setCenter(dialog, window)
    }

    openAndClose() {
        if (!this.isOpen) {
            this.open()
        } else {
            this.close()
        }
    }

    close() {
        window.removeEventListener("click", this.#closeOutsideEvent)
        this.isOpen = false
        const dialog = document.getElementById(this.#id);
        new Animation(dialog).fadeOut();
    }

    set() {
        return this.#dialog;
    }

    #setCenter(element, window) {
        // Ширина
        const width = parseInt(window.getComputedStyle(element).width) + "px"
        if (element.style.width === "-webkit-fill-available") {
            element.style.left = "0"
        } else {
            element.style.left = `calc(100% / 2 - ${width} / 2)`;
        }
        // Высота
        const height = parseInt(window.getComputedStyle(element).height) + "px"
        if (element.style.height === "-webkit-fill-available") {
            element.style.top = "0"
        } else {
            element.style.top = `calc(100% / 2 - ${height} / 2)`;
        }
    }
}

exports.Dialog = Dialog