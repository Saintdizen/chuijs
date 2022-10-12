let {Animation} = require('../modules/chui_animations');

class Spinner {
    #spiner = document.createElement('chui_spiner')
    #element_1 = document.createElement('spinner')
    #element_2 = document.createElement('spinner')
    #element_3 = document.createElement('spinner')
    #element_4 = document.createElement('spinner')
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
        this.#element_1.style.border = `${size.BORDER}px solid transparent`;
        this.#element_1.style.borderBottom = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_1.style.borderRight = `${size.BORDER}px solid var(--blue_prime_background)`;
        // element_2
        this.#element_2.style.width = `${elem_2_size}px`;
        this.#element_2.style.height = `${elem_2_size}px`;
        this.#element_2.style.border = `${size.BORDER}px solid transparent`;
        this.#element_2.style.borderBottom = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_2.style.borderRight = `${size.BORDER}px solid var(--blue_prime_background)`;
        // element_3
        this.#element_3.style.width = `${elem_3_size}px`;
        this.#element_3.style.height = `${elem_3_size}px`;
        this.#element_3.style.border = `${size.BORDER}px solid transparent`;
        this.#element_3.style.borderBottom = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_3.style.borderRight = `${size.BORDER}px solid var(--blue_prime_background)`;
        // element_4
        this.#element_4.style.width = `${elem_4_size}px`;
        this.#element_4.style.height = `${elem_4_size}px`;
        this.#element_4.style.border = `${size.BORDER}px solid transparent`;
        this.#element_4.style.borderBottom = `${size.BORDER}px solid var(--blue_prime_background)`;
        this.#element_4.style.borderRight = `${size.BORDER}px solid var(--blue_prime_background)`;
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
}

exports.Spinner = Spinner

class SpinnerSize {
    static SMALL = {
        SIZE: 60,
        TEST: 8,
        BORDER: 2
    };
    static DEFAULT = {
        SIZE: 90,
        TEST:  12,
        BORDER: 3
    };
    static BIG = {
        SIZE: 120,
        TEST:  16,
        BORDER: 4
    };
}

exports.SpinnerSize = SpinnerSize