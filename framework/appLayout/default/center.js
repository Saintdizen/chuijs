class Center {
    #center = document.createElement("center");
    constructor() {
        this.#center.id = "center";
    }
    set() {
        return this.#center;
    }
}

exports.Center = Center;
