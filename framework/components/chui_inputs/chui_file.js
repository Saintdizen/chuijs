//version: 1.0.0

class AcceptTypes {
    //Изображения
    static ALL_IMAGE = "image/*"
    static PNG = "image/png"
    static GIF = "image/gif"
    static JPEG = "image/jpeg"
    //===========
    //Аудио
    static ALL_AUDIO = "audio/*"
    //===========
    //Видео
    static ALL_VIDEO = "video/*"
    //===========
}

exports.AcceptTypes = AcceptTypes

class FileInput {
    #chui_file_main = document.createElement('chui_file_main');
    #chui_file_input = document.createElement('chui_file_input');
    #id = require("randomstring").generate();
    #title = String();
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        name: String(), title: String(), accept: [],
        required: Boolean(), disableFocus: Boolean(), multiple: Boolean(),
        changeListener: () => {}, focusListener: () => {}, blurListener: () => {}
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_file_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "max-content",
                    "height": "max-content",
                    "margin": "var(--margin)"
                }
            },
            {
                name: "chui_file_main",
                style: {
                    "display": "block",
                    "width": "max-content",
                    "height": "max-content",
                    "margin": "0px",
                    "border-radius": "var(--border_radius)",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "border": "none",
                    "align-items": "center",
                    "position": "relative",
                }
            },
            {
                name: ".chui_file_main_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                }
            },
            {
                name: ".file_input_disabled",
                style: {
                    "cursor": "not-allowed",
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "color": "var(--text_color_disabled)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt",
                    "line-height":"1",
                }
            },
            {
                name: ".input_label_disabled",
                style: {
                    "cursor": "not-allowed",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color_disabled)"
                }
            },
            {
                name: ".file_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "border": "0",
                    "font-size": "12pt",
                    "line-height":"1",
                }
            },
            {
                name: ".input_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "input[type=file]::file-selector-button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "0px var(--margin) 0px 0px",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                    "transition": "all .22s",
                    "font-family": "chui_Inter",
                    "letter-spacing": "0.33px",
                    "word-spacing": "0.33px",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                }
            },
            {
                name: "input[type=file]::file-selector-button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "input[type=file]:disabled::file-selector-button",
                style: {
                    "cursor": "not-allowed",
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "2px dashed var(--border_main)",
                }
            },
            {
                name: "input[type=file]:disabled::file-selector-button:hover",
                style: {
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "2px dashed var(--border_main)"
                }
            },
        ], 'chUiJS_fileInput');
        this.#input.type = 'file';
        this.#input.className = 'file_input';
        this.#input.id = this.#id;

        //Options
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.changeListener !== undefined) this.#input.addEventListener('change', options.changeListener);
        if (options.focusListener !== undefined) this.#input.addEventListener('focus', options.focusListener);
        if (options.blurListener !== undefined) this.#input.addEventListener('blur', options.blurListener);
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.disableFocus !== undefined) this.#input.addEventListener("mousedown", () => { return false });
        if (options.accept) this.#input.accept = options.accept.join(", ");
        if (options.multiple) this.#input.multiple = options.multiple;
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.className = 'input_label';
            this.#label.setAttribute('for', this.#id);
            this.#chui_file_input.appendChild(this.#label);
        }
        this.#chui_file_main.appendChild(this.#input);
        this.#chui_file_input.appendChild(this.#chui_file_main);
    }
    addChangeListener(listener = () => {}) { this.#input.addEventListener('change', listener); }
    addFocusListener(listener = () => {}) { this.#input.addEventListener('focus', listener); }
    addBlurListener(listener = () => {}) { this.#input.addEventListener('blur', listener); }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getFile(index = Number()) { return this.#input.files[index]; }
    getFiles() { return this.#input.files; }
    setDisabled(value = Boolean()) {
        this.#input.disabled = value
        if (value) {
            this.#chui_file_main.classList.add("chui_file_main_disabled")
            this.#input.className = "file_input_disabled"
            this.#label.className = "input_label_disabled"
        } else {
            this.#chui_file_main.classList.remove("chui_file_main_disabled")
            this.#input.className = "file_input"
            this.#label.className = "input_label"
        }
    }
    set() { return this.#chui_file_input; }
}

exports.FileInput = FileInput
