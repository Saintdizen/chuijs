const {Page, Spinner, SpinnerSize} = require('../../index');

class SpinnerPage extends Page {
    constructor() {
        super();
        this.setTitle('Спинеры - крутилки');
        this.setMain(false)
        let spinner_v_small = new Spinner(SpinnerSize.V_SMALL, 'auto');
        let spinner_small = new Spinner(SpinnerSize.SMALL, 'auto');
        let spinner_def = new Spinner(SpinnerSize.DEFAULT, 'auto');
        let spinner_big = new Spinner(SpinnerSize.BIG, 'auto');
        let spinner_v_big = new Spinner(SpinnerSize.V_BIG, 'auto');
        this.add(spinner_v_small, spinner_small, spinner_def, spinner_big, spinner_v_big)
    }
}

exports.SpinnerPage = SpinnerPage