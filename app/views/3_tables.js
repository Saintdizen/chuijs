const {Page, Table, Button, TextInput} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(true)

        let table  = new Table({
            data: [
                new Test('Paris specialites', 'France'),
                new Test('Alfreds Futterkiste', 'Germany'),
                new Test('Berglunds snabbkop', 'Sweden'),
                new Test('Island Trading', 'UK'),
                new Test('Koniglich Essen', 'Germany'),
                new Test('Magazzini Alimentari Riuniti', 'Italy'),
                new Test('North/South', 'UK'),
                new Test('Laughing Bacchus Winecellars', 'Canada'),
            ],
            userSelect: true,
            customName: ["Столбец 1", "Столбец 2"],
            columnsWidth: ["50%", "50%"]
        })

        let filter_by_text = new TextInput({ title: "ФИЛЬТРЬ" })

        filter_by_text.addInputListener((e) => {
            console.log(e.target.value.toString())
            table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, "name1", e.target.value.toString())
            if (e.target.value === "") {
                table.removeFilterByProperty("name1", e.target.value.toString())
            }
        })

        let sort_button = new Button("Сортировать таблицу", () => {
            table.sortTable()
        })

        this.add(filter_by_text, table, sort_button)
    }
}

class Test {
    constructor(name1, name2) {
        this.name1 = name1
        this.name2 = name2
    }
}

exports.TablesPage = TablesPage