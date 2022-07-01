const {Icon, Icons} = require("./chui_icons");

class Details {
    #name = require("randomstring").generate();
    #chui_details = document.createElement(`chui_details`);
    //
    #ab = document.createElement('details_button')
    #bt = document.createElement('details_button_text')
    #barrow = document.createElement('details_button_arrow')
    //
    #ap = document.createElement('details_panel')
    #html = document.createElement('details_panel_html')
    #direction;
    #wrap;
    #align;
    #justify;
    #width;
    constructor(options = {
        title: String(undefined),
        contenteditable: Boolean(false),
        direction: String(undefined),
        wrap: String(undefined),
        align: String(undefined),
        justify: String(undefined),
        width: String(undefined)
    }) {
        this.#direction = options.direction;
        this.#wrap = options.wrap;
        this.#align = options.align;
        this.#justify = options.justify;
        this.#width = options.width;
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_details",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "chui_details:hover",
                style: {
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "details_button",
                style: {
                    "background": "var(--button_background)",
                    "cursor": "pointer",
                    "padding": "10px 15px",
                    "font-size": "12pt",
                    "width": "-webkit-fill-available",
                    "text-align": "left",
                    "outline": "none",
                    "display": "flex",
                    "align-items": "center",
                    "border-radius": "var(--border_radius)",
                    "color": "var(--text_color)",
                    "border": "none",
                }
            },
            {
                name: "details_panel",
                style: {
                    "background": "var(--button_background)",
                    "padding": "0px 10px",
                    "display": "block",
                    "overflow": "hidden",
                    "width": "-webkit-fill-available",
                    "max-height": "0",
                    "transition": "background .2s, max-height .1s ease-out",
                    "border-bottom-right-radius": "var(--border_radius)",
                    "border-bottom-left-radius": "var(--border_radius)",
                    "color": "var(--text_color)",
                    "border": "none",
                }
            },
            {
                name: "details_panel_html",
                style: {
                    "padding": "10px 0px",
                    "width": "-webkit-fill-available",
                    "display": "flex"
                }
            },
            {
                name: "details_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: "details_button:hover details_button_text",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "details_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: ".details_active",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: ".details_active chui_icon",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'chui_Details');
        this.#html.setAttribute('contenteditable', options.contenteditable);

        if (this.#direction !== undefined) {
            this.#html.style.flexDirection = this.#direction;
        }
        if (this.#wrap !== undefined) {
            this.#html.style.flexWrap = this.#wrap;
        }
        if (this.#align !== undefined) {
            this.#html.style.alignItems = this.#align;
        }
        if (this.#justify !== undefined) {
            this.#html.style.justifyContent = this.#justify;
        }
        if (this.#width !== undefined) {
            this.#chui_details.style.width = this.#width;
            this.#ab.style.width = this.#width;
            this.#ap.style.width = this.#width;
            this.#html.style.width = this.#width;
        }

        this.#ab.setAttribute('name', this.#name)
        this.#bt.innerHTML = options.title;
        this.#barrow.style.marginLeft = 'auto'
        this.#barrow.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN).getHTML();
        this.#ab.appendChild(this.#bt)
        this.#ab.appendChild(this.#barrow)
        this.#ap.appendChild(this.#html)
        this.#chui_details.appendChild(this.#ab)
        this.#chui_details.appendChild(this.#ap)

        //ФУНКЦИИ
        let test = this.#chui_details.children;
        let i;
        for (i = 0; i < test.length; i++) {
            let elem = test[i];
            if (elem.tagName === 'DETAILS_BUTTON') {
                elem.addEventListener('click', (e) => {
                    elem.classList.toggle('details_active')
                    let panel = elem.nextElementSibling;
                    if (panel.style.maxHeight) {
                        elem.children[1].children[0].style.transform = 'rotate(0deg)'
                        panel.style.maxHeight = null;
                        elem.style.borderBottomLeftRadius = 'var(--border_radius)'
                        elem.style.borderBottomRightRadius = 'var(--border_radius)'
                    } else {
                        elem.children[1].children[0].style.transform = 'rotate(180deg)'
                        elem.style.borderBottomLeftRadius = '0px'
                        elem.style.borderBottomRightRadius = '0px'
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                })
            }
        }
    }
    add(...components) {
        for (let component of components) {
            this.#html.appendChild(component.set());
        }
    }
    set() {
        return this.#chui_details;
    }
}

exports.Details = Details