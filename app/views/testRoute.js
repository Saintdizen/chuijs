const {Page} = require('../../index');

class TestRoutePage extends Page {
    constructor() {
        super();
        this.setTitle('TestRoutePage');
        this.setMain(true)
    }
}

exports.TestRoutePage = TestRoutePage