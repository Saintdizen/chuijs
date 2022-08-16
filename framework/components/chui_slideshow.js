let slideIndex = 1;

class Slideshow {
    #default_slide = 0;
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
                    "margin": "auto",
                    "width": "400px",
                    "height": "400px"
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
                    "color": "var(--button_text_color)",
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
            if (options.slides.indexOf(slide) === 0) {
                slide.set().style.display = 'block';
            }
            this.#chui_slides_main.appendChild(slide.set())
        }
        this.#chui_next_slide.addEventListener("click", (e) => {
            this.#changeSlide(1);
        })
        this.#chui_prev_slide.addEventListener("click", (e) => {
            this.#changeSlide(-1)
        })
        this.#chui_next_slide.textContent = "NEXT";
        this.#chui_prev_slide.textContent = "PREV";
        this.#chui_slides_main.appendChild(this.#chui_next_slide)
        this.#chui_slides_main.appendChild(this.#chui_prev_slide)
    }
    #changeSlide(n = Number(undefined)) {
        let slides = document.getElementsByTagName("chui_slide");
        console.log(this.#default_slide)
        if (slides[this.#default_slide] !== undefined) {
            slides[this.#default_slide].removeAttribute("style")
        }
        let sum_slides = slides.length;
        this.#default_slide = this.#default_slide + n;
        if (this.#default_slide > sum_slides) this.#default_slide = 1;
        if (this.#default_slide < 1) this.#default_slide = sum_slides;
        slides[this.#default_slide].style.display = 'block';
    }
    set() {
        return this.#chui_slides_main;
    }
}
exports.Slideshow = Slideshow

class Slide {
    #chui_slide = document.createElement('chui_slide');
    constructor(text = String(undefined)) {
        this.#chui_slide.innerText = text;
    }
    set() {
        return this.#chui_slide;
    }
}
exports.Slide = Slide