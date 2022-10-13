let {Animation} = require('../modules/chui_animations');

class Spinner {
    #spinner_main = document.createElement('chui_spiner')
    #spinner = document.createElement('spinner')
    constructor(size = Spinner.SIZE, margin = String(undefined)) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_spiner",
                style: {
                  "width": `max-content`,
                  "height": `max-content`,
                  "display": "flex"
                }
            },
            {
                name: "@keyframes spinner",
                anim: {
                  from: {
                      "transform": "rotate(0deg)"
                  },
                  to: {
                      "transform": "rotate(360deg)"
                  }
                }
            },
            {
                name: "spinner",
                style: {
                  "border-radius": "50%",
                  "animation": `spinner 1.25s linear infinite`,
                  "display": "flex",
                  "justify-content": "center",
                  "align-items": "center"
                }
            }
        ], 'chUiJS_Spinner');
        this.#spinner_main.style.margin = margin;
        //
        this.#spinner.style.width = `${size.SIZE}px`;
        this.#spinner.style.height = `${size.SIZE}px`;
        this.#spinner.style.border = `${size.BORDER}px solid var(--spinner_blue_trans)`;
        this.#spinner.style.borderTop = `${size.BORDER}px solid var(--spinner_blue)`;
        //ADDS
        this.#spinner_main.appendChild(this.#spinner);
    }
    remove() {
        new Animation(this.#spinner_main).fadeOutAndRemove();
    }
    set() {
        return this.#spinner_main;
    }
    static SIZE = {
        V_SMALL: { SIZE: 20, BORDER: 4 },
        SMALL: { SIZE: 40, BORDER: 6 },
        DEFAULT: { SIZE: 60, BORDER: 8 },
        BIG: { SIZE: 80, BORDER: 10 },
        V_BIG: { SIZE: 100, BORDER: 12 }
    }
}

exports.Spinner = Spinner