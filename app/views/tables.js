const {Page, Table} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(false)

        let table  = new Table({
                data: [
                    new Test('col 1', 'col 2'),
                    new Test('col 1', 'col 2'),
                ],
                contentEditable: true,
                columnsWidth: ["50%", "50%"]
            }
        )
        this.add(table)
    }
}

class Test {
    constructor(name1, name2) {
        this.name1 = name1
        this.name2 = name2
    }
}

exports.TablesPage = TablesPage