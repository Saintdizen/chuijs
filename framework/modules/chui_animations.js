class Animation {
    #element = undefined;
    constructor(element) {
        require('./chui_functions').style_parse([
            {
                name: "@keyframes appearance",
                anim: {
                    from: {
                        "display": "flex",
                        "opacity": "0"
                    },
                    to: {
                        "opacity": "1"
                    }
                }
            },
            {
                name: "@keyframes disappearance",
                anim: {
                    from: {
                        "opacity": "1"
                    },
                    to: {
                        "opacity": "0",
                    }
                }
            }
        ], 'Animations');
        this.#element = element;
    }
    appearance() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'appearance';
    }
    disappearance() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'disappearance';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    disappearance_and_remove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'disappearance';
            this.#element.addEventListener('animationend', removeEvents2);
        }
    }
}

const removeEvents2 = (event) => {
    event.target.remove()
    event.target.removeEventListener('animationend', removeEvents2);
}

const removeEvents = (event) => {
    event.target.style.removeProperty('animation-name');
    event.target.style.removeProperty('display');
    event.target.removeEventListener('animationend', removeEvents);
}

exports.Animation = Animation