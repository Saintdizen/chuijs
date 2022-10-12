class Animation {
    #element = undefined;
    constructor(element) {
        require('./chui_functions').style_parse([
            {
                name: "@keyframes fade-in",
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
                name: "@keyframes fade-out",
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
                        "transform": "scale(0.63)"
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
                        "transform": "scale(0.63)"
                    }
                }
            },
            {
                name: "@keyframes slide-right-in",
                anim: {
                    from: {
                        "opacity": "0",
                        "transform": "translateX(100%)"
                    },
                    to: {
                        "opacity": "1",
                        "transform": "translateX(0)"
                    }
                }
            },
            {
                name: "@keyframes slide-right-out",
                anim: {
                    from: {
                        "opacity": "1",
                        "transform": "translateX(0)"
                    },
                    to: {
                        "opacity": "0",
                        "transform": "translateX(100%)"
                    }
                }
            },
            {
                name: "@keyframes slide-bottom-in",
                anim: {
                    from: {
                        "opacity": "0",
                        "transform": "translateY(100%)"
                    },
                    to: {
                        "opacity": "1",
                        "transform": "translateY(0)"
                    }
                }
            },
            {
                name: "@keyframes slide-bottom-out",
                anim: {
                    from: {
                        "opacity": "1",
                        "transform": "translateY(0)"
                    },
                    to: {
                        "opacity": "0",
                        "transform": "translateY(100%)"
                    }
                }
            }
        ], 'chUiJS_Animations');
        if (element !== undefined) this.#element = element;
    }
    fadeIn() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            if (this.#element.tagName !== "TABLE") this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'fade-in';
    }
    fadeOut() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'fade-out';
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
    // SLIDE RIGHT
    slideRightIn() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            if (this.#element.tagName !== "TABLE") this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'slide-right-in';
    }
    slideRightOut() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'slide-right-out';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    // SLIDE BOTTOM
    slideBottomIn() {
        if (window.getComputedStyle(this.#element, null).display === 'none') {
            if (this.#element.tagName !== "TABLE") this.#element.style.display = 'flex';
        }
        this.#element.style.animationName = 'slide-bottom-in';
    }
    slideBottomOut() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'slide-bottom-out';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    // REMOVE
    slideBottomOutAndRemove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'slide-bottom-out';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    slideRightOutAndRemove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'slide-right-out';
            this.#element.addEventListener('animationend', removeEvents);
        }
    }
    scaleOutAndRemove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'scale-out';
            this.#element.addEventListener('animationend', removeEvents2);
        }
    }
    fadeOutAndRemove() {
        if (this.#element.style.animationName) {
            this.#element.style.animationName = 'fade-out';
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