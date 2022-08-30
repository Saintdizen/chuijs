const {Page, Table, Button} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(false)

        let table  = new Table({
            data: [
                new Test('col 1', 'col 2'),
                new Test('col 3', 'col 4'),
            ],
            userSelect: true,
            customName: ["Столбец 1", "Столбец 2"],
            columnsWidth: ["50%", "50%"]
        })
        let filter1 = new Button("Фильтр 1", () => {
            table.setFilterByProperty("name1", "col 1")
        })
        let filter2 = new Button("Фильтр 2", () => {
            table.setFilterByProperty("name2", "col 4")
        })

        this.add(table, filter1, filter2)
    }
}

class Test {
    constructor(name1, name2) {
        this.name1 = name1
        this.name2 = name2
    }
}

exports.TablesPage = TablesPage