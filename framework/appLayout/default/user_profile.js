const { Animation } = require("../../modules/chui_animations/animations");

class UserProfile {
    #user_main = document.createElement("user_main");
    #user_button = document.createElement("user_button");
    #user_dropdown = document.createElement("user_dropdown");
    //
    #user_dd_image_main = document.createElement("user_dd_image_main");
    #user_dd_image = document.createElement("user_dd_image");
    //
    constructor(
        options = {
            username: String(),
            image: { noImage: Boolean(), imageLink: String(), imageBase64: String() },
            items: [],
        }
    ) {
        this.#user_button.innerText = options.username;
        this.#user_main.appendChild(this.#user_button);
        this.#user_main.appendChild(this.#user_dropdown);
        this.#user_button.addEventListener("click", () => {
            if (this.#user_dropdown.style.display === "flex") {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).fadeOut();
            } else {
                this.#user_button.classList.add("user_button");
                new Animation(this.#user_dropdown).fadeIn();
            }
        });
        window.addEventListener("click", (event) => {
            if (event.target.parentNode !== this.#user_main) {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).fadeOut();
            }
        });
        //
        if (options.image !== undefined) {
            if (!options.image.noImage) {
                let new_name = "";
                for (let item of options.username.split(" ")) new_name += item.charAt(0);
                this.#user_dd_image.innerText = new_name;
                this.#user_dd_image_main.appendChild(this.#user_dd_image);
                this.#user_dropdown.appendChild(this.#user_dd_image_main);
            }
        }
        //
        for (let item of options.items) this.#user_dropdown.appendChild(item);
    }

    set() {
        return this.#user_main;
    }
}

exports.UserProfile = UserProfile;
