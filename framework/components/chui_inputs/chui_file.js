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
    #title = String(undefined);
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        title: String(undefined),
        accept: new Array(undefined),
        required: Boolean(undefined),
        disableFocus: Boolean(false),
        multiple: Boolean(false),
        changeListener: () => undefined,
        focusListener: () => undefined,
        blurListener: () => undefined
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
                    "background": "transparent",
                    "border": "2px dashed var(--input_background)"
                }
            },
            {
                name: ".file_input_disabled",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "transition": "color 0.2s",
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
                    "box-shadow": "none",
                    "transition": "color 0.2s",
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
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "9px 14px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "0px var(--margin) 0px 0px",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                    "border": "none",
                    "transition": "all .2s cubic-bezier(0.28, 0.11, 0.32, 1)",
                    "font-family": "chui_Inter",
                    "letter-spacing": "0.33px",
                    "word-spacing": "0.33px",
                }
            },
            {
                name: "input[type=file]::file-selector-button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            }
        ], 'chui_fileInput');
        this.#input.type = 'file';
        this.#input.className = 'file_input';
        this.#input.id = this.#id;
        //Options
        if (options.changeListener !== undefined) { this.#input.addEventListener('change', options.changeListener); }
        if (options.focusListener !== undefined) { this.#input.addEventListener('focus', options.focusListener); }
        if (options.blurListener !== undefined) { this.#input.addEventListener('blur', options.blurListener); }
        if (options.required !== undefined) { this.#input.required = options.required; }
        if (options.disableFocus !== undefined) { this.#input.addEventListener("mousedown", () => { return false }) }
        if (options.accept) { this.#input.accept = options.accept.join(", "); }
        if (options.multiple) { this.#input.multiple = options.multiple; }
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
    getTitle() { return this.#title; }
    getFile(index = Number(0)) { return this.#input.files[index]; }
    getFiles() { return this.#input.files; }
    setDisabled(value = Boolean(undefined)) {
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
