class Image {
    #chui_image = document.createElement('chui_image');
    constructor(src = String(undefined), width = String(undefined), height = String(undefined)) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_image",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "box-shadow": "var(--shadow_one) 0px 0px 2px 0px",
                    "display": "flex"
                }
            },
            {
                name: "img",
                style: {
                    "border-radius": "var(--border_radius)"
                }
            }
        ], 'Image');
        let image = document.createElement('img');
        image.setAttribute('src', src);
        if (width !== undefined) { image.setAttribute('width', width); } else { image.setAttribute('width', 'auto'); }
        if (height !== undefined) { image.setAttribute('height', height); } else { image.setAttribute('height', 'auto'); }
        this.#chui_image.appendChild(image);
    }
    set() {
        return this.#chui_image;
    }
}

exports.Image = Image;