let {Animation} = require('../../modules/chui_animations/animations');

class Spinner {
    #spinner_main = document.createElement('chui_spiner')
    #spinner = document.createElement('spinner')
    #spinner_2 = document.createElement('spinner')
    #spinner_3 = document.createElement('spinner')
    constructor(size = Spinner.SIZE, margin = String()) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Spinner');
        this.#spinner_main.style.margin = margin;
        //
        let size_1 = size.SIZE;
        this.#spinner.style.width = `${size_1}px`;
        this.#spinner.style.height = `${size_1}px`;
        this.#spinner.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`;
        //
        let size_2 = size_1 - size.BORDER * 2;
        this.#spinner_2.style.width = `${size_2}px`;
        this.#spinner_2.style.height = `${size_2}px`;
        this.#spinner_2.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`;
        //
        let size_3 = size_2 - size.BORDER * 2;
        this.#spinner_3.style.width = `${size_3}px`;
        this.#spinner_3.style.height = `${size_3}px`;
        this.#spinner_3.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`;
        //ADDS
        this.#spinner_2.appendChild(this.#spinner_3)
        this.#spinner.appendChild(this.#spinner_2)
        this.#spinner_main.appendChild(this.#spinner);
    }
    remove() {
        new Animation(this.#spinner_main).fadeOutAndRemove();
    }
    set() {
        return this.#spinner_main;
    }
    static SIZE = {
        V_SMALL: { SIZE: 30, BORDER: 3 },
        SMALL: { SIZE: 45, BORDER: 3 },
        DEFAULT: { SIZE: 60, BORDER: 4 },
        BIG: { SIZE: 75, BORDER: 5 },
        V_BIG: { SIZE: 90, BORDER: 5 }
    }
}

exports.Spinner = Spinner