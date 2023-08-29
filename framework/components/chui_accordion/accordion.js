const {Icon, Icons} = require("../chui_icons/icons");

class Accordion {
    #name = require("randomstring").generate();
    #chui_accordion = document.createElement(`chui_accordion`);
    constructor(options = [ { b_text: undefined, p_text: undefined } ]) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Accordion');
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