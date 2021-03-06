const {Animation} = require('../../modules/chui_animations');
const {Calendar} = require('../chui_calendar');
const {Select} = require('./chui_select_box');
const {Icon, Icons} = require('../chui_icons');

class DateInput {
    #id = require("randomstring").generate();
    #chui_date_input = document.createElement('chui_date_input');
    #date_main_block = document.createElement('date_main_block');
    #input = document.createElement('input');
    #label = document.createElement('label');
    #date_dropdown_open = document.createElement('date_dropdown_open');
    #dropdown = document.createElement('date_select_dropdown');
    #dropdown_id = require("randomstring").generate();
    #date_now = new Date();
    constructor(options = {
        title: String(undefined),
        required: Boolean(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "date_input_controls",
                style: {
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center"
                }
            },
            {
                name: "chui_date_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "max-content",
                    "height": "max-content",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "::-webkit-calendar-picker-indicator",
                style: {
                    "display": "none"
                }
            },
            {
                name: "::-webkit-datetime-edit-text",
                style: {
                    "padding": "0px",
                    "width": "100%"
                }
            },
            {
                name: "date_select_dropdown",
                style: {
                    "display": "none",
                    "flex-direction": "column",
                    "color": "var(--text_color)",
                    "padding": "8px",
                    "background": "var(--dropdown_background)",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "position":"absolute",
                    "top": "-2px",
                    "left": "-2px",
                    "z-index": "1",
                    "box-shadow": "var(--shadow_one) 0px 19px 38px, var(--shadow_two) 0px 15px 12px",
                }
            },
            {
                name: "date_week",
                style: {
                    "display": "flex",
                }
            },
            {
                name: "date_day",
                style: {
                    "display": "block",
                    "width": "20px",
                    "border-radius": "var(--border_radius)",
                    "padding": "8px",
                }
            },
            {
                name: ".date_day:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "date_dropdown_open",
                style: {
                    "padding": "8px 13px 8px 0px",
                    "height": "-webkit-fill-available",
                    "margin": "0px",
                    "display": "inline-flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "color": "var(--badge_cancel_text)",
                }
            },
            {
                name: "date_main_block",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "font-size": "12pt",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "2px solid var(--input_background)",
                    "position": "relative",
                    "display": "flex",
                }
            },
            {
                name: ".date_input",
                style: {
                    "width":"100%",
                    "display": "block",
                    "text-align": "center",
                    "margin": "0px",
                    "padding": "8px 0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "border": "0",
                    "font-size": "12pt",
                }
            },
            {
                name: ".date_input_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            }
        ], 'chui_DateInput');
        this.#date_main_block.style.display = 'flex';
        this.#input.type = 'date';
        this.#input.className = "date_input";
        this.#input.id = this.#id;
        if (options.required !== undefined) {
            this.#input.required = options.required;
        }
        this.#date_dropdown_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        if (options.title !== undefined) {
            this.#label.classList.add('date_input_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id);
            this.#chui_date_input.appendChild(this.#label);
        }
        this.#input.addEventListener('focus', () => {
            this.#date_main_block.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#date_main_block.removeAttribute("style");
            this.#label.removeAttribute("style");
        });
        this.#dropdown.setAttribute('id', this.#dropdown_id);
        let select = new Select({
            width: '-webkit-fill-available'
        });
        select.setDropdownHeight('200px');
        let select_year = new Select({
            width: '-webkit-fill-available'
        });
        select_year.setDropdownHeight('200px');
        let datez = this.#date_now.getFullYear() + 5;
        for (let i = 0; i < 150; i++) {
            datez--;
            select_year.addOptions(datez)
        }
        for (let i = 0; i < 12; i++) {
            let test = new Date(2022, i).toLocaleString('default', {month: 'long'}).toUpperCase();
            select.addOptions(test)
        }
        //date_input_controls.appendChild(select.set());
        //date_input_controls.appendChild(select_year.set());
        let date_month_list = document.createElement('date_month_list');
        this.#dropdown.appendChild(select.set());
        this.#dropdown.appendChild(select_year.set());
        this.#dropdown.appendChild(date_month_list);
        select.addValueChangeListener((event) => {
            for (let i = 0; i < 12; i++) {
                let elem = document.getElementById(`month_${i}`);
                if (elem != null && elem.style.display === 'block') {
                    elem.style.display = 'none';
                }
            }
            for (let i = 0; i < 12; i++) {
                let elem = document.getElementById(`month_${i}`);
                if (elem != null && elem.getAttribute("month-name") === event.target.value) {
                    elem.style.display = 'block';
                }
            }
        })
        select_year.addValueChangeListener((event) => {
            date_month_list.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                let cal = new Calendar(event.target.value, i+1);
                let date_month_main = document.createElement('date_month_main');
                date_month_main.setAttribute('month-name', cal.getMonthName());
                date_month_main.setAttribute('id', `month_${cal.getMonth()}`);
                date_month_main.style.width = 'fit-content'
                for (let row of cal.getCalendar()) {
                    let date_week = document.createElement('date_week');
                    let index = 0;
                    for (let cell of row) {
                        let date_day = document.createElement('date_day');
                        if (cell !== undefined) {
                            date_day.innerText = cell;
                            date_day.classList = 'date_day';
                            date_day.addEventListener("click", () => {
                                let today = this.#date_now;
                                today.setDate(cell);
                                today.setFullYear(cal.getYear())
                                today.setMonth(cal.getMonth())
                                this.#input.value = today.toISOString().substr(0, 10);
                                new Animation(this.#dropdown).disappearance();
                            })
                        } else {
                            index++;
                        }
                        date_week.appendChild(date_day);
                    }
                    if (index !== 7) {
                        date_month_main.appendChild(date_week);
                    }
                }
                date_month_list.appendChild(date_month_main)
                if (cal.getMonth() === this.#date_now.getMonth()) {
                    select.setDefaultOption(this.#date_now.toLocaleString('default', {month: 'long'}).toUpperCase());
                    date_month_main.style.display = 'block';
                } else {
                    date_month_main.style.display = 'none';
                }
            }
            this.#dropdown.appendChild(date_month_list);
        })
        select.setDefaultOption(this.#date_now.toLocaleString('default', {month: 'long'}).toUpperCase());
        select_year.setDefaultOption(this.#date_now.getFullYear());
        //LISTENERS
        this.#chui_date_input.addEventListener('click', (event) => {
            if (event.target.parentNode === this.#date_main_block) {
                this.#input.focus()
                new Animation(this.#dropdown).appearance();
            }
        });
        window.addEventListener('click', (event) => {
            if (!event.target in getElementsWithDepth(this.#date_main_block)) {
                new Animation(this.#dropdown).disappearance();
            }
        });
        this.#date_main_block.appendChild(this.#input);
        this.#date_main_block.appendChild(this.#date_dropdown_open);
        this.#date_main_block.appendChild(this.#dropdown);
        this.#chui_date_input.appendChild(this.#date_main_block);
    }
    getTitle() { return this.title; }
    getValue() { return this.#input.value; }
    setValue(date = String(undefined)) { this.#input.value = date; }
    set() { return this.#chui_date_input; }
}

const getElementsWithDepth = (el, level = 0) =>
  [...el.children].reduce((acc, n) => {
    acc.push(...getElementsWithDepth(n, level + 1));
    return acc;
  }, [ { el, level } ]);

exports.DateInput = DateInput
