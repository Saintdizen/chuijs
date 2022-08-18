const {Icon, Icons} = require("./chui_icons");
const {Animation} = require("../modules/chui_animations");

class Slideshow {
    #default_slide = 0;
    #chui_slides_main = document.createElement('chui_slides_main');
    #chui_next_slide = document.createElement('chui_next_slide');
    #chui_prev_slide = document.createElement('chui_prev_slide');
    constructor(options = {
        width: String(undefined),
        height: String(undefined),
        autoplay: Boolean(false),
        interval: Number(10),
        slides: []
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_slides_main",
                style: {
                    "position": "relative",
                    "margin": "var(--margin)",
                    "width": `${options.width}`,
                    "height": `${options.height}`,
                    "border": "2px solid var(--input_background)",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "chui_slide",
                style: {
                    "display": "none",
                    "align-items": "center",
                    "justify-content": "center",
                    "color": "var(--text_color)",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: ".active_slide",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_next_slide, chui_prev_slide",
                style: {
                    "cursor": "pointer",
                    "position": "absolute",
                    "top": "0",
                    "width": "auto",
                    "color": "var(--button_text_color)",
                    "font-weight": "bold",
                    "font-size": "18px",
                    "user-select": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "7px 12px",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center"
                }
            },
            {
                name: "chui_next_slide",
                style: {
                    "right": "0"
                }
            },
            {
                name: "chui_next_slide:hover, chui_prev_slide:hover",
                style: {
                    "background-color": "var(--blue_prime_background_trans)"
                }
            },
            {
                name: ".text",
                style: {
                    "color": "#f2f2f2",
                    "font-size": "15px",
                    "padding": "8px 12px",
                    "position": "absolute",
                    "bottom": "8px",
                    "width": "100%",
                    "text-align": "center"
                }
            },
            {
                name: ".numbertext",
                style: {
                    "color": "#f2f2f2",
                    "font-size": "12px",
                    "padding": "8px 12px",
                    "position": "absolute",
                    "top": "0"
                }
            },
            {
                name: ".dot",
                style: {
                    "cursor": "pointer",
                    "height": "15px",
                    "width": "15px",
                    "margin": "0 2px",
                    "background-color": "#bbb",
                    "border-radius": "50%",
                    "display": "inline-block",
                    "transition": "background-color 0.6s ease"
                }
            },
            {
                name: ".active, .dot:hover",
                style: {
                    "background-color": "#717171",
                }
            }
        ], 'chui_Slideshow');

        for (let slide of options.slides) {
            if (options.slides.indexOf(slide) === 0) {
                slide.set().classList.add("active_slide")
            }
            this.#chui_slides_main.appendChild(slide.set())
        }
        this.#chui_next_slide.addEventListener("click", (e) => {
            this.#changeSlide(1);
        })
        this.#chui_prev_slide.addEventListener("click", (e) => {
            this.#changeSlide(-1)
        })
        this.#chui_next_slide.appendChild(new Icon(Icons.CONTENT.REDO, "14pt", "var(--button_text_color)").set())
        this.#chui_prev_slide.appendChild(new Icon(Icons.CONTENT.UNDO, "14pt", "var(--button_text_color)").set())
        this.#chui_slides_main.appendChild(this.#chui_next_slide)
        this.#chui_slides_main.appendChild(this.#chui_prev_slide)

        if (options.autoplay) {
            setInterval(() => this.#changeSlide(1), options.interval * 1000);
        }
    }
    #changeSlide(n = Number(undefined)) {
        let animation  = new Animation();
        let slides = document.getElementsByTagName("chui_slide");
        let sum_slides = slides.length;
        animation.setElement(slides[this.#default_slide])
        animation.disappearance()
        animation.getElement().addEventListener('animationend', () => {
            animation.getElement().classList.remove("active_slide");
            this.#default_slide = this.#default_slide + n;
            if (this.#default_slide > (sum_slides - 1)) this.#default_slide = 0;
            if (this.#default_slide < 0) this.#default_slide = sum_slides - 1;
            animation.setElement(slides[this.#default_slide]);
            animation.getElement().addEventListener('animationend', () => {
                animation.getElement().classList.add("active_slide");
            });
        });
    }
    set() {
        return this.#chui_slides_main;
    }
}
exports.Slideshow = Slideshow

class Slide {
    #chui_slide = document.createElement('chui_slide');
    constructor(...components) {
        for (let child of components) {
            this.#chui_slide.appendChild(child.set())
        }
    }
    set() {
        return this.#chui_slide;
    }
}
exports.Slide = Slide