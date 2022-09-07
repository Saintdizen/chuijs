class Table {
    #filtered_data = [];
    #sorted_data = [];
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
        sorted: false,
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
            this.#data.filter(data_1 => data_1[property].toLowerCase() === filterValue.toLowerCase()).forEach(data_2 => { this.#filtered_data.push(data_2); })
        }
        if (type.includes(Table.FILTER_TYPE.PARTIAL_MATCH)) {
            this.#data.filter(data_1 => data_1[property].toLowerCase().includes(filterValue.toLowerCase())).forEach(data_2 => { this.#filtered_data.push(data_2); })
        }
        this.#setTable(this.#filtered_data)
        if (this.#userSelect !== undefined) {
            this.#setUserSelect()
        }
    }
    removeFilterByProperty(property= String(undefined), filterValue = new Object(undefined)) {
        this.#data.filter(data_1 => data_1[property].toLowerCase() === filterValue.toLowerCase()).forEach(data_2 => {
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
            let flag = 1;
            cell.addEventListener("click", () => {
                if (flag === 1) {
                    this.#sortTable(Table.SORT_METHOD.ASC, cell.cellIndex)
                    flag = 2;
                } else if (flag === 2) {
                    this.#sortTable(Table.SORT_METHOD.DESC, cell.cellIndex)
                    flag = 3;
                } else if (flag === 3) {
                    if (this.#filtered_data.length !== 0) {
                        this.#setTable(this.#filtered_data);
                    } else {
                        this.#setTable(this.#data);
                    }
                    flag = 1;
                }
            })
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
    #sortTable(sortMethod = String(undefined), col = Number(undefined)) {
        if (this.#filtered_data.length !== 0) {
            this.#sorted_data = this.#filtered_data;
            this.#sort(col, sortMethod);
        } else {
            this.#sorted_data = this.#data;
            this.#sort(col, sortMethod);
        }
    }
    #sort(colIndex = Number(undefined), sortMethod = String(undefined)) {
        let cols = Object.getOwnPropertyNames(this.#sorted_data[0]);
        let arr = [];
        for (let data of this.#sorted_data) {
            let sub_arr = [];
            for (let i = 0; i < cols.length; i++) sub_arr.push(data[cols[i]]);
            arr.push(sub_arr)
        }
        let sort_data = [];

        if (sortMethod.includes(Table.SORT_METHOD.ASC)) {
            arr.sort((a,b) => {
                if (typeof a[colIndex] === "string") {
                    return a[colIndex].localeCompare(b[colIndex])
                } else if (typeof a[colIndex] === "number") {
                    if (a[colIndex] === b[colIndex]) {
                        return 0
                    } else {
                        return (a[colIndex] < b[colIndex]) ? -1 : 1;
                    }
                }
            }).forEach(data => {
                sort_data.push(new this.#data[0].__proto__.constructor(...data))
            })
        } else if (sortMethod.includes(Table.SORT_METHOD.DESC)) {
            arr.sort((a,b) => {
                if (typeof a[colIndex] === "string") {
                    return b[colIndex].localeCompare(a[colIndex])
                } else if (typeof a[colIndex] === "number") {
                    if (b[colIndex] === a[colIndex]) {
                        return 0
                    } else {
                        return (b[colIndex] < a[colIndex]) ? -1 : 1;
                    }
                }
            }).forEach(data => {
                sort_data.push(new this.#data[0].__proto__.constructor(...data))
            })
        }

        this.#setTable(sort_data)
    }
    static SORT_METHOD = { ASC: "ASC", DESC: "DESC" }
    static FILTER_TYPE = { CLEAR_MATCH: "CLEAR_MATCH", PARTIAL_MATCH: "PARTIAL_MATCH" }
}

exports.Table = Table