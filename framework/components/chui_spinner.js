let {Animation} = require('../modules/chui_animations');

class Spinner {
    #spiner = document.createElement('chui_spiner')
    #element_1 = document.createElement('spinner')
    #element_2 = document.createElement('spinner')
    #element_3 = document.createElement('spinner')
    #element_4 = document.createElement('spinner')
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
                  "animation": `spinner 2.5s linear infinite`,
                  "display": "flex",
                  "justify-content": "center",
                  "align-items": "center"
                }
            }
        ], 'chUiJS_Spinner');
        this.#spiner.style.margin = margin;
        //
        let elem_1_size = size.SIZE
        let elem_2_size = elem_1_size - size.TEST
        let elem_3_size = elem_2_size - size.TEST
        let elem_4_size = elem_3_size - size.TEST
        //
        // element_1
        this.#element_1.style.width = `${elem_1_size}px`;
        this.#element_1.style.height = `${elem_1_size}px`;
        this.#element_1.style.borderTop = `${size.BORDER}px solid var(--spinner_blue_1)`;
        // element_2
        this.#element_2.style.width = `${elem_2_size}px`;
        this.#element_2.style.height = `${elem_2_size}px`;
        this.#element_2.style.borderTop = `${size.BORDER}px solid var(--spinner_blue_2)`;
        // element_3
        this.#element_3.style.width = `${elem_3_size}px`;
        this.#element_3.style.height = `${elem_3_size}px`;
        this.#element_3.style.borderTop = `${size.BORDER}px solid var(--spinner_blue_3)`;
        // element_4
        this.#element_4.style.width = `${elem_4_size}px`;
        this.#element_4.style.height = `${elem_4_size}px`;
        this.#element_4.style.borderTop = `${size.BORDER}px solid var(--spinner_blue_4)`;
        //ADDS
        this.#element_3.appendChild(this.#element_4);
        this.#element_2.appendChild(this.#element_3);
        this.#element_1.appendChild(this.#element_2);
        this.#spiner.appendChild(this.#element_1);
    }
    remove() {
        new Animation(this.#spiner).fadeOutAndRemove();
    }
    set() {
        return this.#spiner;
    }
    static SIZE = {
        SMALL: {
            SIZE: 48,
            TEST: 12,
            BORDER: 3
        },
        DEFAULT: {
            SIZE: 74,
            TEST:  16,
            BORDER: 4
        },
        BIG: {
            SIZE: 100,
            TEST:  20,
            BORDER: 5
        }
    }
}

exports.Spinner = Spinner