const { Animation } = require("../../../modules/chui_animations/animations");
const { setStyles } = require("../../../modules/chui_functions");
const { Select } = require("../chui_select_box/select_box");
const { Icon, Icons } = require("../../chui_icons/icons");

const pad = (n) => String(n).padStart(2, "0");
const toIso = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;

class DateInput {
    #id = require("randomstring").generate();
    #root = document.createElement("chui_date_input");
    #block = document.createElement("date_main_block");
    #input = document.createElement("input");
    #label = document.createElement("label");
    #openButton = document.createElement("date_dropdown_open");
    #openButtonDisabled = document.createElement("date_dropdown_open");
    #dropdown = document.createElement("date_select_dropdown");
    #controls = document.createElement("date_dropdown_controls");
    #grid = document.createElement("date_grid");
    #monthSelect = new Select({});
    #yearSelect = new Select({});
    #monthNames = [];
    #weekDayNames = [];
    #viewYear;
    #viewMonth;
    #selected = "";
    #disabled = false;
    #open = false;

    constructor(
        options = {
            name: String(),
            title: String(),
            required: Boolean(),
        }
    ) {
        setStyles(__dirname + "/styles.css", "chUiJS_DateInput");

        // Локализованные названия месяцев и дней недели (неделя начинается с воскресенья)
        for (let i = 0; i < 12; i++) {
            this.#monthNames.push(new Date(2024, i, 1).toLocaleString("default", { month: "long" }).toUpperCase());
        }
        for (let i = 0; i < 7; i++) {
            this.#weekDayNames.push(
                new Date(2024, 0, 7 + i).toLocaleString("default", { weekday: "short" }).toUpperCase()
            );
        }

        // Поле ввода
        this.#input.type = "date";
        this.#input.className = "date_input";
        this.#input.id = this.#id;
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.required !== undefined) this.#input.required = options.required;

        // Заголовок
        if (options.title !== undefined) {
            this.#label.classList.add("date_input_label");
            this.#label.innerText = options.title;
            this.#label.setAttribute("for", this.#id);
            this.#root.appendChild(this.#label);
        }

        // Кнопки раскрытия
        this.#openButton.innerHTML = new Icon(
            Icons.HARDWARE.KEYBOARD_ARROW_DOWN,
            undefined,
            "var(--blue_prime_background)"
        ).getHTML();
        this.#openButtonDisabled.innerHTML = new Icon(
            Icons.HARDWARE.KEYBOARD_ARROW_DOWN,
            undefined,
            "var(--text_color_disabled)"
        ).getHTML();
        this.#openButtonDisabled.style.cursor = "not-allowed";
        this.#openButtonDisabled.style.display = "none";

        // Селекты месяца и года
        this.#fillMonthOptions();
        this.#fillYearOptions();
        this.#controls.appendChild(this.#monthSelect.set());
        this.#controls.appendChild(this.#yearSelect.set());
        this.#monthSelect.set().style.flex = "1 1 0%";
        this.#yearSelect.set().style.flex = "0 0 92px";
        this.#monthSelect.set().style.margin = "0";
        this.#yearSelect.set().style.margin = "0";

        // Сборка выпадающего блока
        this.#dropdown.appendChild(this.#controls);
        this.#dropdown.appendChild(this.#grid);

        this.#block.appendChild(this.#input);
        this.#block.appendChild(this.#openButton);
        this.#block.appendChild(this.#openButtonDisabled);
        this.#block.appendChild(this.#dropdown);
        this.#root.appendChild(this.#block);

        // Текущий месяц для первичного показа
        let now = new Date();
        this.#viewYear = now.getFullYear();
        this.#viewMonth = now.getMonth();

        this.#monthSelect.addValueChangeListener((event) => {
            this.#viewMonth = Number(event.detail.value);
            this.#renderGrid();
        });
        this.#yearSelect.addValueChangeListener((event) => {
            this.#viewYear = Number(event.detail.value);
            this.#renderGrid();
        });

        // Клик по полю открывает/закрывает календарь
        this.#root.addEventListener("click", (event) => {
            if (this.#disabled) return;
            // Переключаем только по клику на самом поле (не на календаре)
            if (!this.#block.contains(event.target)) return;
            if (this.#dropdown.contains(event.target)) return;
            if (this.#open) {
                this.close();
            } else {
                this.open();
            }
        });
        // Синхронизация при ручном вводе даты в нативное поле
        this.#input.addEventListener("change", () => {
            this.#selected = this.#input.value;
            this.#syncViewToSelected();
            this.#emitChange();
        });

        this.#renderGrid();
    }

    // === НАПОЛНЕНИЕ СЕЛЕКТОВ ===
    #fillMonthOptions() {
        for (let i = 0; i < 12; i++) {
            this.#monthSelect.addOption(this.#monthNames[i], i);
        }
    }
    #fillYearOptions() {
        let current = new Date().getFullYear();
        for (let year = current - 6; year <= current + 6; year++) {
            this.#yearSelect.addOption(String(year), year);
        }
    }

    // === ПАРСИНГ И СЕТКА ===
    #syncViewToSelected() {
        let parsed = this.#parseIso(this.#selected);
        if (parsed !== null) {
            this.#viewYear = parsed.year;
            this.#viewMonth = parsed.month;
        }
    }
    #parseIso(value) {
        let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (match === null) return null;
        return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
    }

    #renderGrid() {
        this.#grid.innerHTML = "";
        // Шапка недели
        for (let name of this.#weekDayNames) {
            let head = document.createElement("date_week_day");
            head.innerText = name;
            this.#grid.appendChild(head);
        }
        // Ячейки дней
        let first = new Date(this.#viewYear, this.#viewMonth, 1);
        let offset = first.getDay();
        let daysInMonth = new Date(this.#viewYear, this.#viewMonth + 1, 0).getDate();
        let total = Math.ceil((offset + daysInMonth) / 7) * 7;
        let today = new Date();
        let selected = this.#parseIso(this.#selected);
        for (let i = 0; i < total; i++) {
            if (i < offset) {
                this.#grid.appendChild(document.createElement("date_day_empty"));
                continue;
            }
            let day = i - offset + 1;
            let cell = document.createElement("date_day");
            cell.innerText = String(day);
            if (
                today.getFullYear() === this.#viewYear &&
                today.getMonth() === this.#viewMonth &&
                today.getDate() === day
            ) {
                cell.classList.add("date_day_today");
            }
            if (
                selected !== null &&
                selected.year === this.#viewYear &&
                selected.month === this.#viewMonth &&
                selected.day === day
            ) {
                cell.classList.add("date_day_selected");
            }
            cell.addEventListener("click", (event) => this.#selectDay(day, event));
            this.#grid.appendChild(cell);
        }
    }

    #selectDay(day, event) {
        // Не даём клику по ячейке всплыть до корня и заново открыть календарь
        if (event !== undefined) event.stopPropagation();
        this.#selected = toIso(this.#viewYear, this.#viewMonth, day);
        this.#input.value = this.#selected;
        this.#emitChange();
        this.#renderGrid();
        this.close();
    }

    #emitChange() {
        this.#root.dispatchEvent(
            new CustomEvent("chui_date_input_changed", {
                detail: { value: this.#selected },
            })
        );
    }

    // === ОТКРЫТИЕ / ЗАКРЫТИЕ ===
    open() {
        if (this.#disabled || this.#open) return;
        this.#open = true;
        this.#syncViewToSelected();
        this.#monthSelect.setDefaultOption(this.#viewMonth);
        this.#yearSelect.setDefaultOption(this.#viewYear);
        this.#renderGrid();
        this.#block.classList.add("date_open");
        new Animation(this.#dropdown).fadeIn();
        this.#positionDropdown();
        document.addEventListener("mousedown", this.#onDocumentMouseDown);
        document.addEventListener("keydown", this.#onDocumentKeyDown);
    }
    close() {
        if (!this.#open) return;
        this.#open = false;
        this.#block.classList.remove("date_open");
        new Animation(this.#dropdown).fadeOut();
        document.removeEventListener("mousedown", this.#onDocumentMouseDown);
        document.removeEventListener("keydown", this.#onDocumentKeyDown);
    }

    #onDocumentMouseDown = (event) => {
        if (!this.#root.contains(event.target)) this.close();
    };
    #onDocumentKeyDown = (event) => {
        if (event.key === "Escape") this.close();
    };

    #positionDropdown() {
        let rect = this.#dropdown.getBoundingClientRect();
        let overflowBottom = rect.bottom - (window.innerHeight - 8);
        let overflowRight = rect.right - (window.innerWidth - 8);
        if (overflowBottom > 0 || overflowRight > 0) {
            this.#dropdown.style.transition = "none";
            if (overflowBottom > 0) this.#dropdown.style.top = `-${rect.height + 4}px`;
            if (overflowRight > 0) this.#dropdown.style.left = `-${overflowRight}px`;
            void this.#dropdown.offsetWidth;
            this.#dropdown.style.removeProperty("transition");
        }
    }

    // === ПУБЛИЧНЫЙ API ===
    getName() {
        return this.#input.name;
    }
    getTitle() {
        return this.#label.innerText;
    }
    getValue() {
        return this.#input.value;
    }
    setValue(date = String()) {
        let iso = "";
        if (date instanceof Date && !isNaN(date.getTime())) {
            iso = toIso(date.getFullYear(), date.getMonth(), date.getDate());
        } else {
            iso = String(date);
        }
        this.#selected = iso;
        this.#input.value = iso;
        if (this.#open) {
            this.#syncViewToSelected();
            this.#monthSelect.setDefaultOption(this.#viewMonth);
            this.#yearSelect.setDefaultOption(this.#viewYear);
            this.#renderGrid();
        }
    }
    setDisabled(boolean = Boolean()) {
        this.#disabled = boolean;
        this.#input.disabled = boolean;
        if (boolean) {
            this.#openButton.style.display = "none";
            this.#openButtonDisabled.style.display = "inline-flex";
            this.#block.classList.add("date_main_block_disabled");
            this.#label.classList.add("date_input_label_disabled");
        } else {
            this.#openButtonDisabled.style.display = "none";
            this.#openButton.style.display = "inline-flex";
            this.#block.classList.remove("date_main_block_disabled");
            this.#label.classList.remove("date_input_label_disabled");
        }
        if (boolean) this.close();
    }
    addValueChangeListener(listener = () => {}) {
        this.#root.addEventListener("chui_date_input_changed", listener);
    }
    set() {
        return this.#root;
    }
}

exports.DateInput = DateInput;
