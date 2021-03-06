class ProgressBar {
    #id = require("randomstring").generate();
    #ProgressBar = document.createElement(`progress`);
    #main = document.createElement("progress_block");
    #progress_count = document.createElement('progress_count');
    #progress_text = document.createElement('progress_text');
    constructor(max = Number(undefined)) {
        require('../modules/chui_functions').style_parse([
            {
                name: "progress_block",
                style: {
                    "width": "max-content",
                    "height": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "progress",
                style: {
                    "border-radius": "50px",
                    "text-align": "start",
                    "margin": "var(--margin)",
                    "width": "-webkit-fill-available",
                    "height": "15px"
                }
            },
            {
                name: "progress::-webkit-progress-bar",
                style: {
                    "transition": "background .2s",
                    "background": "var(--input_background)",
                    "border-radius": "50px",
                    "border": "none",
                }
            },
            {
                name: "progress::-webkit-progress-value",
                style: {
                    "background": "var(--blue_prime_background)",
                    "border-radius": "50px",
                }
            }
        ], 'ProgressBar');
        this.#ProgressBar.max = max;
        this.#ProgressBar.id = this.#id;
        this.#progress_count.setAttribute('for', this.#id);
        this.#progress_text.setAttribute('for', this.#id);
        this.#progress_text.style.width = '-webkit-fill-available';
        this.#progress_text.style.display = 'block';
        this.#progress_text.style.margin = '0px 10px';
        this.#progress_text.style.textAlign = 'initial';
        this.#main.appendChild(this.#progress_count)
        this.#main.appendChild(this.#ProgressBar)
        this.#main.appendChild(this.#progress_text)
    }
    setWidth(width = String(undefined)) {
        this.#main.style.width = width;
    }
    setValue(value = Number(undefined)) {
        this.#ProgressBar.value = value;
        this.#progress_count.innerText = `${value}%`;
    }
    setProgressText(text = String(undefined)) {
        this.#progress_text.innerText = text;
    }
    set() {
        return this.#main;
    }
}

exports.ProgressBar = ProgressBar