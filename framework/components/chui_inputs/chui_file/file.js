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
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_fileInput');
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
