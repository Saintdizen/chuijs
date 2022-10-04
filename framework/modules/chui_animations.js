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
                        "opacity": "0"
                    }
                }
            },
            {
                name: "@keyframes scale-in",
                anim: {
                    from: {
                        "opacity": "0",
                        "transform": "scale(0.5)"
                    },
                    to: {
                        "opacity": "1",
                        "transform": "scale(1)"
                    }
                }
            },
            {
                name: "@keyframes scale-out",
                anim: {
                    from: {
                        "opacity": "1",
                        "transform": "scale(1)"
                    },
                    to: {
                        "opacity": "0",
                        "transform": "scale(0.5)"
                    }
                }
            }
        ], 'chUiJS_Animations');
        if (element !== undefined) this.#element = element;
    }
    appearance() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            if (this.#element.tagName !== "TABLE") this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'appearance';
    }
    disappearance() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'disappearance';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    // SCALE
    scaleIn() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            if (this.#element.tagName !== "TABLE") this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'scale-in';
    }
    scaleOut() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'scale-out';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    // REMOVE
    scale_and_remove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'scale-out';
            this.#element.addEventListener('animationend', removeEvents2);
        }
    }
    disappearance_and_remove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'disappearance';
            this.#element.addEventListener('animationend', removeEvents2);
        }
    }
    //
    setElement(element) {
        this.#element = element;
    }
    removeStyles() {
        this.#element.removeAttribute("style")
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