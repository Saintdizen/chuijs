class Animation {
    #element = undefined;
    constructor(element) {
        require('../chui_functions').setStyles(__dirname + "/styles.css", "chUiJS_Animations");
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