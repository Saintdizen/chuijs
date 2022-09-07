const {Page, Table, Button, TextInput} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(true)

        let table  = new Table({
            data: [
                new Test("ЯД", 3, true),
                new Test("АНАНАС", 5, false),
                new Test("ВОДА", 1, true),
            ],
            userSelect: true,
            customName: ["Наименование", "Цена", "Наличие на складе"],
            columnsWidth: ["50%", "25%", "25%"]
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
    constructor(name, price, status) {
        this.name = name
        this.price = price
        this.status = status
    }
}

exports.TablesPage = TablesPage