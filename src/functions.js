import { Wifi } from "./models/wifi.js";
import { shared } from "./shared.js";
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateIP(objs) {
    const firstNum = randomInt(1, 255);
    const secondNum = randomInt(0, 255);
    const thirdNum = randomInt(0, 255);
    const fourthNum = randomInt(0, 255);
    const ip = `${firstNum}.${secondNum}.${thirdNum}.${fourthNum}`;
    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (obj.ip === ip)
            return generateIP(objs);
    }
    return ip;
}
export function getParentById(id, element) {
    let parent = element.parentElement;
    while (parent?.id !== id)
        parent = parent?.parentElement === undefined ? null : parent?.parentElement;
    return parent;
}
export function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
export function mstoticks(ms) {
    return Math.round(ms / 1000 * ticks);
}
export function tickstoms(t) {
    return Math.round(t / ticks * 1000);
}
export function getCodeFromChar(char) {
    return Wifi.possibleChars.indexOf(char);
}
export function getCharFromCode(code) {
    return Wifi.possibleChars[code];
}
export function hashChar(char, apartment = shared.activeApartment) {
    const command = apartment.router.connectedWifi.command;
    const disalignment = (2 * command + 1) * 2;
    const maxLength = Wifi.possibleChars.length - 1;
    let halfHashed = getCodeFromChar(char) + disalignment > maxLength ? disalignment - (maxLength - getCodeFromChar(char)) - 1 : getCodeFromChar(char) + disalignment;
    return getCharFromCode(halfHashed);
}
export function halfDehashChar(char, command, apartment = shared.activeApartment) {
    const disalignment = (2 * command + 1) * 2;
    const maxLength = Wifi.possibleChars.length - 1;
    let halfHashed = getCodeFromChar(char) - disalignment < 0 ? maxLength - (disalignment - getCodeFromChar(char)) + 1 : getCodeFromChar(char) - disalignment;
    return halfHashed;
}
function paste(e) {
    e.preventDefault();
    let paste = e.clipboardData.getData("text");
    paste = paste.replace(/<\/[^>]+(>|$)/g, "");
    if (e.target.constructor.name === "HTMLInputElement") {
        e.target.value = paste;
        return;
    }
    const textNode = document.createTextNode(paste);
    const selection = window.getSelection();
    if (!selection.rangeCount)
        return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(textNode);
    selection.collapseToEnd();
}
document.addEventListener("paste", paste);
export function openComputer() {
    const loginScreen = document.createElement("login-screen");
    document.querySelector("main-screen").prepend(loginScreen);
    if (shared.activeApartment.pc.loggedIn)
        loginScreen.openComputer();
}
