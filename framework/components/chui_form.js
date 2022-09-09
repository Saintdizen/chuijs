class Form {
    #id = require("randomstring").generate();
    #chui_form_main = document.createElement("chui_form_main")
    #form = document.createElement("form")
    constructor(options = {
        action: String(undefined),
        method: String(undefined),
        components: [],
        submitEvent: () => {}
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: `chui_form_main`,
                style: {
                    "color": "var(--text_color)"
                }
            },
            {
                name: ".chui_form_submit_button",
                style: {
                    "border": "none",
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "8px 12px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "var(--margin)",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 0px 2px 0px",
                }
            },
            {
                name: ".chui_form_submit_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "var(--button_text_color) 0px 0px 2px 0px",
                }
            }
        ], 'chui_Forms');
        this.#chui_form_main.id = this.#id;
        this.#chui_form_main.appendChild(this.#form);

        // Установка компонентов в форму
        for (let component of options.components) this.#form.appendChild(component.set());
        // ===

        //Установка опций
        if (options.action) this.#form.action = options.action;
        if (options.method) this.#form.method = options.method;
        if (options.submitEvent !== undefined) this.#form.addEventListener("submit", options.submitEvent);
        // ===
    }
    addSubmitEvent(listener = () => {}) { this.#form.addEventListener("submit", listener); }
    set() { return this.#chui_form_main }
    static SubmitButton(title = String(undefined)) { return new SubmitButton(title); }
}

class SubmitButton {
    #submit = document.createElement("input")
    constructor(title = String(undefined)) {
        this.#submit.classList.add("chui_form_submit_button")
        this.#submit.type = 'submit';
        this.#submit.value = title;
    }
    set() { return this.#submit; }
}

exports.Form = Form