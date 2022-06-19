const {Icon, ICONS} = require('./chui_icons');

class TextEditor {
    #chui_text_editor = document.createElement('chui_text_editor');
    #editor_controls = document.createElement('editor_controls');
    #text_input = document.createElement('text_input');
    constructor(width, height) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor",
                style: {
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "box-shadow": "var(--shadow_one) 0px 0px 2px 0px",
                    "display": "flex",
                    "flex-direction": "column"
                }
            },
            {
                name: "editor_controls",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "40px",
                    "margin-bottom": "14px"
                }
            },
            {
                name: "text_input",
                style: {
                    "width": "-webkit-fill-available",
                    "font-size": "17px",
                    "padding": "0px 14px 14px 14px",
                    "height": "calc(100% - 40px)",
                    "overflow": "overlay"
                }
            }
        ], 'TextEditor');
        this.#chui_text_editor.style.width = width;
        this.#chui_text_editor.style.height = height;
        let test = document.createElement('test');
        test.innerHTML = new Icon(ICONS.EDITOR.FORMAT_BOLD).getHTML();
        this.#editor_controls.appendChild(test);
        this.#text_input.contentEditable = 'true';
        this.#chui_text_editor.appendChild(this.#editor_controls);
        this.#chui_text_editor.appendChild(this.#text_input);
    }
    set() {
        return this.#chui_text_editor;
    }
}

exports.TextEditor = TextEditor;