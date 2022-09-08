const {Page, Table, TextInput} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(false)

        let table  = new Table({
            data: [
                new Test("Январь", 1, false),
                new Test("Февраль", 2, false),
                new Test("Март", 3, false),
                new Test("Апрель", 4, false),
                new Test("Май", 5, false),
                new Test("Июнь", 6, false),
                new Test("Июль", 7, false),
                new Test("Август", 8, false),
                new Test("Сентябрь", 9, true),
                new Test("Октябрь", 10, false),
                new Test("Ноябрь", 11, false),
                new Test("Декабрь", 12, false),
            ],
            sorted: true,
            userSelect: true,
            customName: ["Месяц", "Номер", "Активный месяц"],
            //columnsWidth: ["20%", "40%", "40%"]
        })

        let filter_by_text = new TextInput({ title: "ФИЛЬТРЬ" })

        filter_by_text.addInputListener((e) => {
            table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, "name", e.target.value.toString())
            if (e.target.value === "") {
                table.removeFilterByProperty("name", e.target.value.toString())
            }
        })

        this.add(filter_by_text, table);
    }
}

class Test {
    constructor(month, number, active) {
        this.month = month
        this.number = number
        this.active = active
    }
}

exports.TablesPage = TablesPage