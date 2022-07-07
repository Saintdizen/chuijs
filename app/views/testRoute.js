const {Page, Label} = require('../../index');

class TestRoutePage extends Page {
    constructor(test) {
        super();
        this.setTitle('TestRoutePage3');
        this.add(new Label(test))
    }
}

exports.TestRoutePage = TestRoutePage