class Image {
    #chui_image = document.createElement('chui_image');
    constructor(options = {
        path: String(undefined),
        base64: String(undefined),
        width: String(undefined),
        height: String(undefined)
    }) {
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
        ], 'chUi_Image');
        let image = document.createElement('img');
        image.style.width = '-webkit-fill-available';
        image.style.height = '-webkit-fill-available';
        if (options.path !== undefined) image.setAttribute('src', `data:image/png;base64,${require('fs').readFileSync(options.path).toString("base64")}`)
        if (options.base64 !== undefined) image.setAttribute('src', options.base64);
        if (options.width !== undefined) this.#chui_image.style.width = options.width;
        if (options.height !== undefined) this.#chui_image.style.height = options.height;
        this.#chui_image.appendChild(image);
    }
    set() { return this.#chui_image; }
}

exports.Image = Image;