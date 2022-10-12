let {Animation} = require('../modules/chui_animations');

class Spinner {
    #spiner = document.createElement('chui_spiner')
    #element_one = document.createElement('spinner_one')
    #element_two = document.createElement('spinner_two')
    #element_three = document.createElement('spinner_three')
    constructor(size = new SpinnerSize(), margin = String(undefined)) {
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
                name: "@keyframes spinner_1",
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
                name: "@keyframes spinner_2",
                anim: {
                  from: {
                      "transform": "rotate(360deg)",
                  },
                  to: {
                      "transform": "rotate(0deg)",
                  }
                }
            },
            {
                name: ".element_one",
                style: {
                  "border-radius": "50%",
                  "animation": `spinner_1 1.4s linear infinite`,
                  "display": "flex",
                  "justify-content": "center",
                  "align-items": "center"
                }
            },
            {
                name: ".element_two",
                style: {
                    "border-radius": "50%",
                    "animation": `spinner_2 .7s linear infinite`,
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center"
                }
            }
        ], 'chUiJS_Spinner');
        this.#spiner.style.margin = margin;
        // element_one
        this.#element_one.className = 'element_one';
        this.#element_one.style.width = `${size.SIZE_F_1}px`;
        this.#element_one.style.height = `${size.SIZE_F_1}px`;
        this.#element_one.style.border = `${size.BORDER}px solid transparent`;
        this.#element_one.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_one.style.borderLeft = `${size.BORDER}px solid var(--blue_prime_background)`;
        // element_two
        this.#element_two.className = 'element_two'
        this.#element_two.style.width = `${size.SIZE_F_2}px`;
        this.#element_two.style.height = `${size.SIZE_F_2}px`;
        this.#element_two.style.border = `${size.BORDER}px solid transparent`;
        this.#element_two.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_two.style.borderLeft = `${size.BORDER}px solid var(--blue_prime_background)`;
        //ADDS
        this.#element_one.appendChild(this.#element_two)
        this.#spiner.appendChild(this.#element_one)
    }
    remove() {
        new Animation(this.#spiner).fadeOutAndRemove();
    }
    set() {
        return this.#spiner;
    }
}

exports.Spinner = Spinner

class SpinnerSize {
    static V_SMALL = { SIZE_F_1:  30, SIZE_F_2:  22, BORDER: 2 };
    static SMALL = { SIZE_F_1:  50, SIZE_F_2:  41, BORDER: 2 };
    static DEFAULT = { SIZE_F_1:  70, SIZE_F_2:  58, BORDER: 3 };
    static BIG = { SIZE_F_1:  90, SIZE_F_2:  75, BORDER: 4 };
    static V_BIG = { SIZE_F_1:  110, SIZE_F_2:  95, BORDER: 4 };
}

exports.SpinnerSize = SpinnerSize