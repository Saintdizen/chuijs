const {Animation} = require('../../../modules/chui_animations/animations');
const {Calendar} = require('../../chui_calendar/calendar');
const {Select} = require('../chui_select_box/select_box');
const {Icon, Icons} = require('../../chui_icons/icons');

class DateInput {
    #id = require("randomstring").generate();
    #chui_date_input = document.createElement('chui_date_input');
    #date_main_block = document.createElement('date_main_block');
    #input = document.createElement('input');
    #label = document.createElement('label');
    #date_dropdown_open = document.createElement('date_dropdown_open');
    #date_dropdown_open_disabled = document.createElement('date_dropdown_open');
    #dropdown = document.createElement('date_select_dropdown');
    #dropdown_id = require("randomstring").generate();
    #date_now = new Date();
    constructor(options = { name: String(), title: String(), required: Boolean() }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_DateInput');
        this.#date_main_block.style.display = 'flex';
        this.#input.type = 'date';
        this.#input.className = "date_input";
        this.#input.id = this.#id;
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.required !== undefined) this.#input.required = options.required;
        this.#date_dropdown_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#date_dropdown_open_disabled.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--text_color_disabled)").getHTML();
        this.#date_dropdown_open_disabled.style.cursor = "not-allowed";
        if (options.title !== undefined) {
            this.#label.classList.add('date_input_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id);
            this.#chui_date_input.appendChild(this.#label);
        }
        this.#input.addEventListener('focus', () => {
            this.#date_main_block.style.border = '1px solid var(--blue_prime_background)';
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
        for (let i = 0; i < 10; i++) {
            datez--;
            select_year.addOption(datez, datez)
        }
        for (let i = 0; i < 12; i++) {
            let test = new Date(2024, i).toLocaleString('default', {month: 'long'}).toUpperCase();
            select.addOption(test, test)
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
                if (elem != null && elem.getAttribute("month-name") === event.detail.value) {
                    elem.style.display = 'block';
                }
            }
        })
        select_year.addValueChangeListener((event) => {
            date_month_list.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                //console.log(event)
                let cal = new Calendar(event.detail.value, i+1);
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
                                new Animation(this.#dropdown).fadeOut();
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
            if (!this.#input.disabled) {
                if (event.target.parentNode === this.#date_main_block) {
                    this.#input.focus()
                    new Animation(this.#dropdown).fadeIn();
                }
            }
        });
        window.addEventListener('click', (event) => {
            if (!event.target in getElementsWithDepth(this.#date_main_block)) {
                new Animation(this.#dropdown).fadeOut();
            }
        });
        this.#date_main_block.appendChild(this.#input);
        this.#date_main_block.appendChild(this.#date_dropdown_open);
        this.#date_main_block.appendChild(this.#dropdown);
        this.#chui_date_input.appendChild(this.#date_main_block);
    }
    getName() { return this.#input.name; }
    getTitle() { return this.#label.innerText; }
    getValue() { return this.#input.value; }
    setValue(date = String()) { this.#input.value = date; }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#date_main_block.classList.add("date_main_block_disabled")
            this.#input.className = "date_input_disabled"
            this.#label.className = "date_input_label_disabled"
            this.#date_dropdown_open.remove();
            this.#date_main_block.appendChild(this.#date_dropdown_open_disabled);
        } else {
            this.#date_main_block.classList.remove("date_main_block_disabled")
            this.#input.className = "date_input"
            this.#label.className = "date_input_label"
            this.#date_dropdown_open_disabled.remove();
            this.#date_main_block.appendChild(this.#date_dropdown_open);
        }
    }
    set() { return this.#chui_date_input; }
}

const getElementsWithDepth = (el, level = 0) =>
  [...el.children].reduce((acc, n) => {
    acc.push(...getElementsWithDepth(n, level + 1));
    return acc;
  }, [ { el, level } ]);

exports.DateInput = DateInput
