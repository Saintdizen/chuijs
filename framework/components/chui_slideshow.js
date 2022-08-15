let slideIndex = 1;

class Slideshow {
    #chui_slides_main = document.createElement('chui_slides_main');
    #chui_next_slide = document.createElement('chui_next_slide');
    #chui_prev_slide = document.createElement('chui_prev_slide');
    constructor(options = {
        slides: []
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_slides_main",
                style: {
                    "max-width": "1000px",
                    "position": "relative",
                    "margin": "auto"
                }
            },
            {
                name: "chui_slide",
                style: {
                    "display": "none"
                }
            },
            {
                name: "chui_next_slide, chui_prev_slide",
                style: {
                    "cursor": "pointer",
                    "position": "absolute",
                    "top": "50%",
                    "width": "auto",
                    "margin-top": "-22px",
                    "padding": "16px",
                    "color": "white",
                    "font-weight": "bold",
                    "font-size": "18px",
                    "transition": "0.6s ease",
                    "border-radius": "0 3px 3px 0",
                    "user-select": "none"
                }
            },
            {
                name: "chui_next_slide",
                style: {
                    "right": "0",
                    "border-radius": "3px 0 0 3px"
                }
            },
            {
                name: "chui_next_slide:hover, chui_prev_slide:hover",
                style: {
                    "background-color": "rgba(0,0,0,0.8)"
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
            this.#chui_slides_main.appendChild(slide.set())
        }
        this.#chui_next_slide.addEventListener("click", (e) => {
            this.#plusSlides(-1);
        })
        this.#chui_prev_slide.addEventListener("click", (e) => {
            this.#plusSlides(1)
        })
        this.#chui_slides_main.appendChild(this.#chui_next_slide)
        this.#chui_slides_main.appendChild(this.#chui_prev_slide)
    }
    #plusSlides(n = Number(undefined)) {
        let slides = document.getElementsByTagName("chui_slide");
        for (let slide of slides) {
            console.log(slide)
        }
    }
    set() {
        return this.#chui_slides_main;
    }
}
exports.Slideshow = Slideshow

class Slide {
    #chui_slide = document.createElement('chui_slide');
    constructor() {
        this.#chui_slide.innerText = "test"
    }
    set() {
        return this.#chui_slide;
    }
}
exports.Slide = Slide