const { Animation } = require('../../modules/chui_animations/animations');

class Dialog {
    #id = require("randomstring").generate();
    #dialog = document.createElement(`chui_dialog`);
    #content = document.createElement('dialog_content');
    #header = document.createElement('dialog_header');
    #body = document.createElement('dialog_body');
    #footer = document.createElement('dialog_footer');
    constructor(options = { width: String(), height: String(), closeOutSideClick: Boolean(), customBackground: String() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Dialogs');
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
        if (options.customBackground !== undefined) {
            this.#content.style.background = options.customBackground;
        }
        //ADDS
        this.#content.appendChild(this.#body)
        this.#dialog.appendChild(this.#content)
    }
    addToHeader(...components) {
        this.#content.insertBefore(this.#header, this.#body)
        for (let component of components) this.#header.appendChild(component.set());
    }
    addToBody(...components) {
        for (let component of components) this.#body.appendChild(component.set());
    }
    addToFooter(...components) {
        this.#content.appendChild(this.#footer)
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