let {Animation} = require('../modules/chui_animations');

class Spinner {
    #spiner = document.createElement('chui_spiner')
    #element_one = document.createElement('spinner_one')
    #element_two = document.createElement('spinner_two')
    #element_three = document.createElement('spinner_three')
    constructor(size = new SpinnerSize(), margin = String(undefined)) {
        require('../modules/chui_functions').style_parse([
          {
            name: "chui_spiner",
            style: {
              "width": `max-content`,
              "height": `max-content`,
              "display": "flex"
            }
          },
          {
            name: "@keyframes spinner_1",
            anim: {
              from: {
                  "transform": "rotate(0deg)"
              },
              to: {
                  "transform": "rotate(360deg)"
              }
            }
          },
          {
            name: "@keyframes spinner_2",
            anim: {
              from: {
                  "transform": "rotate(360deg)"
              },
              to: {
                  "transform": "rotate(0deg)"
              }
            }
          },
          {
            name: ".element_one",
            style: {
              "border-radius": "100%",
              "animation": `spinner_1 .8s linear infinite`,
              "display": "flex",
              "justify-content": "center",
              "align-items": "center",
              "box-shadow": "var(--blue_prime_background_2) 0px 0px 10px 0px",
            }
          },
          {
            name: ".element_two",
            style: {
              "border-radius": "100%",
              "animation": `spinner_2 .4s linear infinite`,
              "display": "flex",
              "justify-content": "center",
              "align-items": "center",
              "box-shadow": "var(--blue_prime_background_2) 0px 0px 10px 0px",
            }
          },
          {
            name: ".element_three",
            style: {
              "border-radius": "100%",
              "animation": `spinner_1 .4s linear infinite`,
              "display": "flex",
              "justify-content": "center",
              "align-items": "center",
              "box-shadow": "var(--blue_prime_background_2) 0px 0px 10px 0px",
            }
          }
        ], 'chui_Spinner');
        this.#spiner.style.margin = margin;
        // element_one
        this.#element_one.className = 'element_one'
        this.#element_one.style.width = `${size.SIZE}px`;
        this.#element_one.style.height = `${size.SIZE}px`;
        this.#element_one.style.borderTop = `${size.BORDER}px solid var(--blue_prime_background)`
        this.#element_one.style.borderBottom = `${size.BORDER}px solid var(--blue_prime_background)`
        // element_two
        this.#element_two.className = 'element_two'
        this.#element_two.style.width = `calc(${size.SIZE}px / 1.4)`;
        this.#element_two.style.height = `calc(${size.SIZE}px / 1.4)`;
        this.#element_two.style.borderTop = `calc(${size.BORDER}px / 1.2) solid var(--blue_prime_background)`
        this.#element_two.style.borderBottom = `calc(${size.BORDER}px / 1.2) solid var(--blue_prime_background)`
        // element_three
        this.#element_three.className = 'element_three'
        this.#element_three.style.width = `calc(${size.SIZE}px / 2.4)`;
        this.#element_three.style.height = `calc(${size.SIZE}px / 2.4)`;
        this.#element_three.style.borderTop = `calc(${size.BORDER}px / 2.2) solid var(--blue_prime_background)`
        this.#element_three.style.borderBottom = `calc(${size.BORDER}px / 2.2) solid var(--blue_prime_background)`
        //ADDS
        this.#element_two.appendChild(this.#element_three)
        this.#element_one.appendChild(this.#element_two)
        this.#spiner.appendChild(this.#element_one)
    }
    remove() {
        new Animation(this.#spiner).disappearance_and_remove()
    }
    set() {
        return this.#spiner;
    }
}

exports.Spinner = Spinner

class SpinnerSize {
    static VERY_SMALL = { SIZE:  40, BORDER:  2 }
    static SMALL = { SIZE:  60, BORDER:  3 }
    static STANDART = { SIZE:  80, BORDER:  4 }
    static BIG = { SIZE: 100, BORDER: 5 }
    static VERY_BIG = { SIZE: 120, BORDER: 6 }
}

exports.SpinnerSize = SpinnerSize