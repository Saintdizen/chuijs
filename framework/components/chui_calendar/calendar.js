class Calendar {
    constructor(year, month) {
        this.year = year;
        this.month = month - 1;
        this.calendar = [
            new Array(7),
            new Array(7),
            new Array(7),
            new Array(7),
            new Array(7),
            new Array(7),
            new Array(7)
        ];

        for (let i = 0; i < 35; i++) {
            let dayzz = new Date(this.year, this.month, i+1);
            if (dayzz.getDay() === 0) {
                this.calendar[0][0] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 1) {
                this.calendar[0][1] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 2) {
                this.calendar[0][2] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 3) {
                this.calendar[0][3] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 4) {
                this.calendar[0][4] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 5) {
                this.calendar[0][5] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
            if (dayzz.getDay() === 6) {
                this.calendar[0][6] = dayzz.toLocaleString("default", { weekday: 'short' }).toUpperCase();
            }
        }

        this.list = [];
        this.date = new Date(this.year, this.month, 1);
        /*let optionz = {
            era: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };*/
        while (this.date.getMonth() === this.month) {
            let dayToPush = this.date;
            let days = [];
            days.push(dayToPush.toLocaleString('default', {day: 'numeric'}));
            days.push(dayToPush.toLocaleString('default', {weekday: 'short'}).toUpperCase());
            days.push(dayToPush.toLocaleString('default', {month: 'long'}).toUpperCase());
            this.date.setDate(this.date.getDate() + 1);
            this.list.push(days)
        }
        let index = 1;
        for (let day of this.list) {
            for (let name_day of this.calendar[0]) {
                let indexz = this.calendar[0].indexOf(name_day);
                if (day[1].includes(name_day)) {
                    this.calendar[index][indexz] = day[0];
                    if (indexz === 6) {
                        index++;
                    }
                }
            }
        }
    }
    getDateNow() {
        return new Date();
    }
    getMonthName() {
        return new Date(this.year, this.month).toLocaleString('default', {month: 'long'}).toUpperCase();
    }
    getDayName() {
        return new Date(this.year, this.month).toLocaleString("default", { weekday: 'long' }).toUpperCase();
    }
    getDate() {
        return new Date(this.year, this.month).getDate();
    }
    getMonth() {
        return new Date(this.year, this.month).getMonth();
    }
    getYear() {
        return new Date(this.year, this.month).getFullYear();
    }
    getCalendar() {
        return this.calendar;
    }
}

exports.Calendar = Calendar