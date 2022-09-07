class Table {
    #filtered_data = [];
    #table = document.createElement('table');
    //#caption = this.#table.createCaption();
    #tHead = this.#table.createTHead();
    #tBody = this.#table.createTBody();
    //#tFoot = this.#table.createTFoot();
    #columns = [];
    #data = [];
    #customNames = [];
    #userSelect = Boolean(false);
    constructor(options = {
        data: undefined,
        customName: undefined,
        userSelect: Boolean(undefined),
        columnsWidth: []
    }) {
        this.#data = options.data;
        this.#customNames = options.customName;
        this.#userSelect = options.userSelect;
        require('../modules/chui_functions').style_parse([
            {
                name: "table",
                style: {
                    "border": "2px solid var(--input_background)",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "display": "grid",
                    "width": "inherit",
                    "height": "max-content",
                    "overflow": "auto"
                }
            },
            {
                name: "thead",
                style: {
                    "background": "var(--input_background)",
                    "font-weight": "600",
                    "height": "max-content",
                    "width": "100%"
                }
            },
            {
                name: "tbody",
                style: {
                    "overflow": "visible",
                    "height": "max-content",
                    "width": "100%"
                }
            },
            {
                name: "tr",
                style: {
                    "display": "grid",
                    "grid-template-columns": `${options.columnsWidth.join(' ')}`,
                    "height": "max-content",
                    "width": "100%",
                    "margin": "0",
                    "grid-row-start": "1",
                    "grid-row-end": "3"
                }
            },
            {
                name: "td",
                style: {
                    "color": "var(--text_color)",
                    "white-space": "break-spaces",
                    "word-break": "break-all",
                    "align-items": "center",
                    "padding": "8px 12px"
                }
            }
        ], 'chui_Table');
        //======================
        //Установка заголовков
        this.#columns = Object.getOwnPropertyNames(this.#data[0]);
        this.#setHeaders();
        //Заполнение таобицы
        this.#setTable(this.#data);
        if (options.userSelect !== undefined) {
            this.#setUserSelect()
        }
    }
    setContextMenu(ctx = new HTMLElement()) { globalThis.ctxs.push({ elem: this.#table, ctx: ctx }) }
    getColumn(col = Number(undefined)) {
        let column = [];
        Array.from(this.#table.rows).forEach(row => {
            Array.from(row.cells).forEach(cell => {
                if (cell.cellIndex === col) {
                    column.push(cell)
                }
            })
        })
        return column;
    }
    getData() { return this.#data; }
    refresh(data) { this.#setTable(data); }
    set() { return this.#table; }

    //Функции фильтров
    setFilterByProperty(type = String(undefined), property = String(undefined), filterValue = new Object(undefined)) {
        this.#filtered_data = [];
        if (type.includes(Table.FILTER_TYPE.CLEAR_MATCH)) {
            this.#data.filter(data_1 => data_1[property] === filterValue).forEach(data_2 => { this.#filtered_data.push(data_2); })
        }
        if (type.includes(Table.FILTER_TYPE.PARTIAL_MATCH)) {
            this.#data.filter(data_1 => data_1[property].includes(filterValue)).forEach(data_2 => { this.#filtered_data.push(data_2); })
        }
        this.#setTable(this.#filtered_data)
        if (this.#userSelect !== undefined) {
            this.#setUserSelect()
        }
    }
    removeFilterByProperty(property= String(undefined), filterValue = new Object(undefined)) {
        this.#data.filter(data_1 => data_1[property] === filterValue).forEach(data_2 => {
            this.#filtered_data.splice(this.#filtered_data.indexOf(data_2), 1)
        })
        if (this.#filtered_data.length !== 0) {
            this.#setTable(this.#filtered_data)
        } else {
            this.#setTable(this.#data)
        }
        if (this.#userSelect !== undefined) {
            this.#setUserSelect()
        }
    }
    //Функции отрисовки таблицы
    #setHeaders() {
        let cols = this.#columns;
        if (this.#customNames !== undefined) { cols = this.#customNames }
        const row = this.#tHead.insertRow()
        //row.style.borderBottom = '2px solid var(--input_background)'
        for (let head of cols) {
            const cell = row.insertCell()
            cell.style.color = 'var(--button_text_color)'
            if (cell.cellIndex !== 0) {
                cell.style.borderLeft = '2px solid transparent'
            }
            cell.innerText = head;
        }
    }
    #setTable(data = []) {
        this.#tBody.innerHTML = '';
        for (let dat of data) {
            let row = this.#tBody.insertRow()
            if (row.rowIndex !== data.length) {
                row.style.borderBottom = '2px solid var(--input_background)'
            }
            for (let col of this.#columns) {
                let cell = row.insertCell();
                if (cell.cellIndex !== 0) {
                    cell.style.borderLeft = '2px solid var(--input_background)'
                }
                cell.innerHTML = dat[col];
            }
        }
    }
    #setUserSelect() {
        for (let row of this.#tBody.rows) {
            for (let cell of row.cells) {
                cell.style.userSelect = 'text'
            }
        }
    }
    sortTable() {
        let cols = Object.getOwnPropertyNames(this.#data[0]);
        let arr = [];
        for (let data of this.#data) {
            let sub_arr = [];
            for (let i = 0; i < cols.length; i++) sub_arr.push(data[cols[i]]);
            arr.push(sub_arr)
        }
        let sort_data = [];
        arr.sort().forEach(data => {
            sort_data.push(new this.#data[0].__proto__.constructor(data[0], data[1]))
        })
        this.#setTable(sort_data)
    }
    static FILTER_TYPE = { CLEAR_MATCH: "CLEAR_MATCH", PARTIAL_MATCH: "PARTIAL_MATCH" }
}

exports.Table = Table