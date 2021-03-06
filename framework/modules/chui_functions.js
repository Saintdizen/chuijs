function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function style_parse(json, component) {
    let stringz = JSON.parse(JSON.stringify(json));
    let style_string = [];
    for (let i = 0; i < stringz.length; i++) {
        style_string.push(`${stringz[i].name} {`)
        if (stringz[i].anim !== undefined) {
            style_string.push(`from {`);
            JSON.parse(JSON.stringify(stringz[i].anim.from), function(key, value) {
                if (typeof value !== 'object') {
                    style_string.push(`${key}:${value};`)
                }
                return value;
            });
            style_string.push(`} to {`);
            JSON.parse(JSON.stringify(stringz[i].anim.to), function(key, value) {
                if (typeof value !== 'object') {
                    style_string.push(`${key}:${value};`)
                }
                return value;
            });
            style_string.push(`}`);
        } else {
            JSON.parse(JSON.stringify(stringz[i].style), function(key, value) {
                if (typeof value !== 'object') {
                    style_string.push(`${key}:${value};`)
                }
                return value;
            });
        }
        style_string.push(`}\n`)
    }
    let style = document.createElement('style');
    style.innerText = style_string.join("").slice(0, -1);
    style.type = 'text/css';
    style.setAttribute('id', component);
    if (document.getElementById(component) == null) {
        document.head.appendChild(style);
    }
}

const render = async (rendez) =>  {
    window.addEventListener('DOMContentLoaded', rendez)
}

function getDefaultIcon() {
    return require('path').join(__dirname, 'chui_icon.png');
}

exports.sleep = sleep
exports.style_parse = style_parse
exports.render = render
exports.getDefaultIcon = getDefaultIcon