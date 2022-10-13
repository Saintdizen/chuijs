const {Page, Spinner} = require('../../index');

class SpinnerPage extends Page {
    constructor() {
        super();
        this.setTitle('Спинеры - крутилки');
        this.setMain(false)
        let spinner_v_small = new Spinner(Spinner.SIZE.V_SMALL, 'auto');
        let spinner_small = new Spinner(Spinner.SIZE.SMALL, 'auto');
        let spinner_def = new Spinner(Spinner.SIZE.DEFAULT, 'auto');
        let spinner_big = new Spinner(Spinner.SIZE.BIG, 'auto');
        let spinner_v_big = new Spinner(Spinner.SIZE.V_BIG, 'auto');
        this.add(spinner_v_small, spinner_small, spinner_def, spinner_big, spinner_v_big)
    }
}

exports.SpinnerPage = SpinnerPage