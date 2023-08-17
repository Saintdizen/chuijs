const {Icon, Icons} = require("./chui_icons");

class Accordion {
    #name = require("randomstring").generate();
    #chui_accordion = document.createElement(`chui_accordion`);
    constructor(options = [ { b_text: undefined, p_text: undefined } ]) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_accordion",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "max-content",
                    "font-size": "12pt",
                    "font-weight":"400",
                    "border": "none",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "chui_accordion_main_test",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "font-size": "12pt",
                    "font-weight":"400",
                    "border-radius": "var(--border_radius)",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: "accordion_button",
                style: {
                    "background": "var(--button_background)",
                    "cursor": "pointer",
                    "padding": "var(--main_padding)",
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
                name: "accordion_panel",
                style: {
                    "background": "var(--background_color_1)",
                    "padding": "0px 10px",
                    "display": "block",
                    "overflow": "hidden",
                    "width": "-webkit-fill-available",
                    "max-height": "0",
                    "border-bottom-right-radius": "var(--border_radius)",
                    "border-bottom-left-radius": "var(--border_radius)",
                    "color": "var(--text_color)",
                    "border": "none",
                }
            },
            {
                name: "accordion_panel_html",
                style: {
                    "padding": "8px 0px",
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "border": "none"
                }
            },
            {
                name: "accordion_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: "accordion_button:hover accordion_button_text",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "accordion_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: ".accordion_active",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: ".accordion_active chui_icon",
                style: {
                    "background": "transparent",
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'chUiJS_Accordion');

        options.forEach(element => {
            let main_test = document.createElement(`chui_accordion_main_test`);
            let ab = document.createElement('accordion_button')
            ab.setAttribute('name', this.#name)
            let bt = document.createElement('accordion_button_text')
            bt.innerHTML = element.b_text
            let barrow = document.createElement('accordion_button_arrow')
            barrow.style.marginLeft = 'auto'
            barrow.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN).getHTML();
            ab.appendChild(bt)
            ab.appendChild(barrow)
            let ap = document.createElement('accordion_panel')
            /*if ((options.indexOf(elem) + 1) !== options.length) {
                ap.style.marginBottom = 'var(--margin)'
            }*/
            let html = document.createElement('accordion_panel_html')
            html.innerHTML = element.p_text
            ap.appendChild(html)
            main_test.appendChild(ab)
            main_test.appendChild(ap)
            this.#chui_accordion.appendChild(main_test)

            if (options.indexOf(element) > 0) {
                main_test.style.marginTop = "8px"
            }

            //ФУНКЦИИ
            let test = main_test.children;
            let i;
            for (i = 0; i < test.length; i++) {
                let elem = test[i];
                if (elem.tagName === 'ACCORDION_BUTTON') {
                    elem.addEventListener('click', (e) => {
                        elem.classList.toggle('accordion_active')
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
        })
    }
    set() {
        return this.#chui_accordion;
    }
}

exports.Accordion = Accordion