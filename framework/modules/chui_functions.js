const fs = require("fs");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const stylesCache = new Map();

function setStyles(pathToCSS = String(), component = String()) {
    if (document.getElementById(component) != null) return;
    let data;
    if (stylesCache.has(pathToCSS)) {
        data = stylesCache.get(pathToCSS);
    } else {
        data = fs.readFileSync(pathToCSS, "utf8");
        stylesCache.set(pathToCSS, data);
    }
    let style = document.createElement("style");
    style.innerHTML = String(data);
    style.type = "text/css";
    style.setAttribute("id", component);
    document.head.appendChild(style);
}

function style_parse(json, component) {
    let stringz = JSON.parse(JSON.stringify(json));
    let style_string = [];
    for (let i = 0; i < stringz.length; i++) {
        style_string.push(`${stringz[i].name} {`);
        JSON.parse(JSON.stringify(stringz[i].style), function (key, value) {
            if (typeof value !== "object") style_string.push(`${key}:${value};`);
            return value;
        });
        style_string.push(`}\n`);
    }
    let style = document.createElement("style");
    style.innerText = style_string.join("").slice(0, -1);
    style.type = "text/css";
    style.setAttribute("id", component);
    if (document.getElementById(component) == null) document.head.appendChild(style);
}

const render = async (rendez) => {
    window.addEventListener("DOMContentLoaded", rendez);
};

function getDefaultIcon() {
    return require("path").join(__dirname, "chui_icon.png");
}

function markdownToHtml(text = String()) {
    let showdown = require("showdown");
    return new showdown.Converter().makeHtml(text);
}

function htmlToMarkdown(text = String()) {
    let showdown = require("showdown");
    return new showdown.Converter().makeMarkdown(text);
}

function getDate() {
    let date = new Date();
    let day = ("0" + Number(date.getDate()).toString()).slice(-2);
    let month = ("0" + Number(date.getMonth() + 1).toString()).slice(-2);
    let year = date.getFullYear();
    let hours = ("0" + Number(date.getHours()).toString()).slice(-2);
    let minutes = ("0" + Number(date.getMinutes()).toString()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function getDateAgo(date = new Date()) {
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 15) return "только что";
    if (diffSec < 60) return "меньше минуты назад";
    const min = Math.floor(diffSec / 60);
    if (min < 60) return `${min} мин назад`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} ч назад`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} дн назад`;
    return getDate();
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

exports.getDate = getDate;
exports.getDateAgo = getDateAgo;
exports.sleep = sleep;
exports.style_parse = style_parse;
exports.render = render;
exports.markdownToHtml = markdownToHtml;
exports.htmlToMarkdown = htmlToMarkdown;
exports.getDefaultIcon = getDefaultIcon;
exports.setStyles = setStyles;
exports.formatBytes = formatBytes;
