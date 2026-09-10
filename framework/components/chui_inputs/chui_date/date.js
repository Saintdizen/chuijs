const {Animation} = require('../../../modules/chui_animations/animations');
const {Calendar} = require('../../chui_calendar/calendar');
const {Icon, Icons} = require('../../chui_icons/icons');

const MONTHS_IN_YEAR = 12;
const isDayNumber = (cell) => /^\d+$/.test(String(cell).trim());

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
    #date_month_list = document.createElement('date_month_list');
    #date_calendar_title = document.createElement('date_calendar_title');
    #calendar_year = this.#date_now.getFullYear();
    #calendar_month = this.#date_now.getMonth();
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
        this.#dropdown.appendChild(this.#buildCalendarHeader());
        this.#dropdown.appendChild(this.#date_month_list);
        this.#buildYear(this.#calendar_year);
        this.#showMonth(this.#calendar_month);
        //LISTENERS
        this.#chui_date_input.addEventListener('click', (event) => {
            if (!this.#input.disabled) {
                if (event.target.parentNode === this.#date_main_block) {
                    this.#input.focus()
                    new Animation(this.#dropdown).fadeIn();
                    window.addEventListener('click', this.#window_click_event);
                }
            }
        });
        this.#date_main_block.appendChild(this.#input);
        this.#date_main_block.appendChild(this.#date_dropdown_open);
        this.#date_main_block.appendChild(this.#dropdown);
        this.#chui_date_input.appendChild(this.#date_main_block);
    }
    #buildCalendarHeader() {
        const header = document.createElement('date_calendar_header');
        const previous = document.createElement('date_calendar_nav');
        previous.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_LEFT, undefined, "var(--text_color)").getHTML();
        previous.addEventListener('click', (event) => {
            event.stopPropagation();
            this.#goToMonth(-1);
        });
        const next = document.createElement('date_calendar_nav');
        next.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_RIGHT, undefined, "var(--text_color)").getHTML();
        next.addEventListener('click', (event) => {
            event.stopPropagation();
            this.#goToMonth(1);
        });
        header.appendChild(previous);
        header.appendChild(this.#date_calendar_title);
        header.appendChild(next);
        return header;
    }
    #buildYear(year) {
        this.#date_month_list.innerHTML = '';
        for (let i = 0; i < MONTHS_IN_YEAR; i++) {
            const cal = new Calendar(year, i + 1);
            const date_month_main = document.createElement('date_month_main');
            date_month_main.setAttribute('month-name', cal.getMonthName());
            date_month_main.setAttribute('month-index', String(cal.getMonth()));
            date_month_main.style.width = 'fit-content';
            for (let row of cal.getCalendar()) {
                const date_week = document.createElement('date_week');
                let index = 0;
                for (let cell of row) {
                    const date_day = document.createElement('date_day');
                    if (cell !== undefined) {
                        date_day.innerText = cell;
                        if (isDayNumber(cell)) {
                            date_day.classList = 'date_day';
                            date_day.addEventListener("click", () => {
                                const selected = new Date(cal.getYear(), cal.getMonth(), Number(cell));
                                this.#input.value = formatLocalDate(selected);
                                this.#closeDropdown();
                            });
                        }
                    } else {
                        index++;
                    }
                    date_week.appendChild(date_day);
                }
                if (index !== 7) {
                    date_month_main.appendChild(date_week);
                }
            }
            this.#date_month_list.appendChild(date_month_main);
        }
    }
    #showMonth(index) {
        this.#calendar_month = index;
        const months = this.#date_month_list.querySelectorAll('date_month_main');
        for (let month of months) {
            month.style.display = Number(month.getAttribute('month-index')) === index ? 'block' : 'none';
        }
        this.#date_calendar_title.innerText = new Date(this.#calendar_year, index)
            .toLocaleString('default', {month: 'long'}).toUpperCase() + ' ' + this.#calendar_year;
    }
    #goToMonth(delta) {
        let month = this.#calendar_month + delta;
        let year = this.#calendar_year;
        if (month < 0) {
            month = MONTHS_IN_YEAR - 1;
            year--;
        } else if (month >= MONTHS_IN_YEAR) {
            month = 0;
            year++;
        }
        if (year !== this.#calendar_year) {
            this.#calendar_year = year;
            this.#buildYear(year);
        }
        this.#showMonth(month);
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
    #window_click_event = (event) => {
        if (!this.#date_main_block.contains(event.target)) this.#closeDropdown();
    }
    #closeDropdown() {
        window.removeEventListener('click', this.#window_click_event);
        new Animation(this.#dropdown).fadeOut();
    }
    set() { return this.#chui_date_input; }
}

const formatLocalDate = (date) =>
    date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

exports.DateInput = DateInput
