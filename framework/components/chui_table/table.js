const {Icon, Icons} = require("../chui_icons/icons");

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
    #userSelect = Boolean();
    #columnsWidth = undefined;
    #sorted = undefined;
    constructor(options = {
        data: undefined,
        customName: undefined,
        userSelect: Boolean(),
        sorted: Boolean(),
        columnsWidth: undefined,
    }) {
        this.#sorted = options.sorted;
        this.#columnsWidth = options.columnsWidth;
        this.#data = options.data;
        this.#customNames = options.customName;
        this.#userSelect = options.userSelect;
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Table');
        //======================
        //Установка заголовков
        this.#columns = Object.getOwnPropertyNames(this.#data[0]);
        this.#setHeaders();
        //Заполнение таобицы
        this.#setTable(this.#data);
    }
    setContextMenu(ctx = new HTMLElement()) { globalThis.ctxs.push({ elem: this.#table, ctx: ctx }) }
    getColumn(col = Number()) {
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
    setData(data = []) { this.#data = data; }
    getData() { return this.#data; }
    refresh(data = []) { this.#setTable(data); }
    set() { return this.#table; }
    //Функции фильтров
    setFilterByProperty(type = String(), property = String(), filterValue = String()) {
        this.#filtered_data = [];
        if (type.includes(Table.FILTER_TYPE.CLEAR_MATCH)) {
            if (this.#filtered_data.length !== 0) {
                this.#filtered_data = this.#filtered_data.filter(data_1 => String(data_1[property]).toLowerCase() === String(filterValue).toLowerCase())
            } else {
                this.#filtered_data = this.#data.filter(data_1 => String(data_1[property]).toLowerCase() === String(filterValue).toLowerCase())
            }
        }
        if (type.includes(Table.FILTER_TYPE.PARTIAL_MATCH)) {
            if (this.#filtered_data.length !== 0) {
                this.#filtered_data = this.#filtered_data.filter(data_1 => String(data_1[property]).toLowerCase().includes(String(filterValue).toLowerCase()))
            } else {
                this.#filtered_data = this.#data.filter(data_1 => String(data_1[property]).toLowerCase().includes(String(filterValue).toLowerCase()))
            }
        }
        this.#setTable(this.#filtered_data)
        if (this.#userSelect !== undefined) this.#setUserSelect();
    }
    setFilterByMultiProperty(type = String(), properties = [], filterValue = String()) {
        this.#filtered_data = [];
        if (type.includes(Table.FILTER_TYPE.CLEAR_MATCH)) {
            let dump = []
            for (let property of properties) {
                dump = this.#data.filter(data_1 => String(data_1[property]).toLowerCase() === String(filterValue).toLowerCase())
                dump.forEach(dump => this.#filtered_data.push(dump))
            }
        }
        if (type.includes(Table.FILTER_TYPE.PARTIAL_MATCH)) {
            let dump = []
            for (let property of properties) {
                dump = this.#data.filter(data_1 => String(data_1[property]).toLowerCase().includes(String(filterValue).toLowerCase()))
                dump.forEach(dump => this.#filtered_data.push(dump))
            }
        }
        if (filterValue.length > 0) {
            this.#setTable(this.#filtered_data)
        } else if (filterValue.length === 0) {
            this.#setTable(this.#data)
        }
        if (this.#userSelect !== undefined) this.#setUserSelect();
    }
    removeFilterByProperty(property= String(), filterValue = String()) {
        this.#data.filter(data_1 => String(data_1[property]).toLowerCase() === String(filterValue).toLowerCase()).forEach(data_2 => {
            this.#filtered_data.splice(this.#filtered_data.indexOf(data_2), 1)
        })
        if (this.#filtered_data.length !== 0) {
            this.#setTable(this.#filtered_data)
        } else {
            this.#setTable(this.#data)
        }
        if (this.#userSelect !== undefined) this.#setUserSelect()
    }
    //Функции отрисовки таблицы
    #setWidthColumns(row) {
        if (this.#columnsWidth === undefined) {
            let arr = [];
            for (let test of this.#columns) arr.push(`calc(100% / ${this.#columns.length})`);
            row.style.gridTemplateColumns = arr.join(" ");
        } else {
            row.style.gridTemplateColumns = this.#columnsWidth.join(" ");
        }
    }
    #setHeaders() {
        let cols = this.#columns;
        if (this.#customNames !== undefined) { cols = this.#customNames }
        const row = this.#tHead.insertRow();
        this.#setWidthColumns(row);
        row.style.borderBottom = '1px solid var(--element_background)'
        for (let head of cols) {
            const cell = row.insertCell()
            if (cell.cellIndex !== 0) cell.style.borderLeft = '1px solid var(--element_background)'
            let cell_title = document.createElement("cell_title")
            cell_title.innerText = head;
            cell.appendChild(cell_title)
            if (this.#sorted) {
                let flag = 1;
                let sort_button = document.createElement("sort_button");
                sort_button.style.marginLeft = "10px";
                sort_button.innerText = '';
                cell.appendChild(sort_button)
                cell.addEventListener("click", () => {
                    if (flag === 1) {
                        sort_button.innerHTML = new Icon(Icons.NAVIGATION.EXPAND_MORE, "20px", "var(--button_text_color)").getHTML();
                        this.#sortTable(Table.#SORT_METHOD.ASC, cell.cellIndex)
                        flag = 2;
                    } else if (flag === 2) {
                        sort_button.innerHTML = new Icon(Icons.NAVIGATION.EXPAND_LESS, "20px", "var(--button_text_color)").getHTML();
                        this.#sortTable(Table.#SORT_METHOD.DESC, cell.cellIndex)
                        flag = 3;
                    } else if (flag === 3) {
                        sort_button.innerText = "";
                        if (this.#filtered_data.length !== 0) {
                            this.#setTable(this.#filtered_data);
                        } else {
                            this.#setTable(this.#data);
                        }
                        flag = 1;
                    }
                })
            }
            cell.style.color = 'var(--button_text_color)';
            cell.style.display = "flex";
            cell.style.flexDirection = "row";
            cell.style.justifyContent = "space-between";
            cell.style.alignItems = "center";
            if (cell.cellIndex !== 0) cell.style.borderLeft = '1px solid transparent';
        }
    }
    #setTable(data = []) {
        this.#tBody.innerHTML = '';
        for (let dat of data) {
            let row = this.#tBody.insertRow()
            this.#setWidthColumns(row);
            if (data.indexOf(dat) !== data.length - 1) row.style.borderBottom = '1px solid var(--element_background)'
            for (let col of this.#columns) {
                let cell = row.insertCell();
                if (cell.cellIndex !== 0) {
                    cell.style.borderLeft = '1px solid var(--element_background)'
                }
                cell.innerHTML = dat[col];
            }
        }
        if (this.#userSelect !== undefined) this.#setUserSelect();
    }
    #setUserSelect() {
        for (let row of this.#tBody.rows) {
            for (let cell of row.cells) {
                cell.style.userSelect = 'text'
            }
        }
    }
    #sortTable(sortMethod = String(), col = Number()) {
        if (this.#filtered_data.length !== 0) {
            this.#sorted_data = this.#filtered_data;
            this.#sort(col, sortMethod);
        } else {
            this.#sorted_data = this.#data;
            this.#sort(col, sortMethod);
        }
    }
    #sort(colIndex = Number(), sortMethod = String()) {
        let cols = Object.getOwnPropertyNames(this.#sorted_data[0]);
        let arr = [];
        for (let data of this.#sorted_data) {
            let sub_arr = [];
            for (let i = 0; i < cols.length; i++) sub_arr.push(data[cols[i]]);
            arr.push(sub_arr)
        }
        let sort_data = [];
        //
        function asc(a, b) {
            if (typeof a[colIndex] === "number") {
                if (a[colIndex] === b[colIndex]) { return 0; } else { return (a[colIndex] < b[colIndex]) ? -1 : 1; }
            } else {
                return a[colIndex].toString().localeCompare(b[colIndex].toString());
            }
        }
        function desc(a, b) {
            if (typeof a[colIndex] === "number") {
                if (b[colIndex] === a[colIndex]) { return 0; } else { return (b[colIndex] < a[colIndex]) ? -1 : 1; }
            } else {
                return b[colIndex].toString().localeCompare(a[colIndex].toString());
            }
        }
        //
        if (sortMethod.includes(Table.#SORT_METHOD.ASC)) {
            arr.sort(asc).forEach(data => {
                sort_data.push(new this.#data[0].__proto__.constructor(...data))
            })
        } else if (sortMethod.includes(Table.#SORT_METHOD.DESC)) {
            arr.sort(desc).forEach(data => {
                sort_data.push(new this.#data[0].__proto__.constructor(...data))
            })
        }
        this.#setTable(sort_data)
    }
    static #SORT_METHOD = { ASC: "ASC", DESC: "DESC" }
    static FILTER_TYPE = { CLEAR_MATCH: "CLEAR_MATCH", PARTIAL_MATCH: "PARTIAL_MATCH" }
}

exports.Table = Table