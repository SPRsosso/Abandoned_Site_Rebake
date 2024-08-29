// Game starts the first time that the user logs in to the computer
let isGameStarted = false;

// Game ticks
const ticks = 20;
const tps = 1000 / ticks;
let currentTick = 0;
let globalTick = 0;
let insidePCTick = 0;
let anonymousUserMessageTick = 0;

// Viruses
let trojanMultiplier = 1;

function wait(ms) {
    return new Promise(( resolve, reject ) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function mstoticks(ms) {
    return Math.round(ms / 1000 * ticks);
}

function tickstoms(t) {
    return Math.round(t / ticks * 1000);
}

function getCodeFromChar(char) {
    return Wifi.possibleChars.indexOf(char);
}

function getCharFromCode(code) {
    return Wifi.possibleChars[code];
}

function hashChar(char, apartment = Apartment.activeApartment) {
    const command = apartment.router.connectedWifi.command;
    const disalignment = (2 * command + 1) * 2;

    const maxLength = Wifi.possibleChars.length - 1;

    let halfHashed = getCodeFromChar(char) + disalignment > maxLength ? disalignment - (maxLength - getCodeFromChar(char)) - 1 : getCodeFromChar(char) + disalignment;
    
    return getCharFromCode(halfHashed);
}

function halfDehashChar(char, command, apartment = Apartment.activeApartment) {
    const disalignment = (2 * command + 1) * 2;

    const maxLength = Wifi.possibleChars.length - 1;

    let halfHashed = getCodeFromChar(char) - disalignment < 0 ? maxLength - (disalignment - getCodeFromChar(char)) + 1 : getCodeFromChar(char) - disalignment;
    
    return halfHashed
}

function paste(e) {
    e.preventDefault();
    let paste = e.clipboardData.getData("text");
    paste = paste.replace(/<\/[^>]+(>|$)/g, "");

    const textNode = document.createTextNode(paste);

    const selection = window.getSelection();
    const sel = window.getSelection();
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(textNode);
    selection.collapseToEnd();
}
document.addEventListener("paste", paste);