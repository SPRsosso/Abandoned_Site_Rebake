import { LoginScreen } from "./components/login-screen.js";
import { Apartment } from "./models/apartment.js";
import { Wifi } from "./models/wifi.js";
import { shared } from "./shared.js";

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateIP(objs: { ip: string; }[]) {
    const firstNum = randomInt(1, 255);
    const secondNum = randomInt(0, 255);
    const thirdNum = randomInt(0, 255);
    const fourthNum = randomInt(0, 255);

    const ip = `${firstNum}.${secondNum}.${thirdNum}.${fourthNum}`;

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];

        if (obj.ip === ip) return generateIP(objs);
    }

    return ip;
}

export function getParentById(id: string, element: HTMLElement) {
    let parent = element.parentElement;
    while (parent?.id !== id)
        parent = parent?.parentElement === undefined ? null : parent?.parentElement;
    return parent;
}

export function wait(ms: number): Promise<void> {
    return new Promise(( resolve, reject ) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function mstoticks(ms: number): number {
    return Math.round(ms / 1000 * ticks);
}

export function tickstoms(t: number): number {
    return Math.round(t / ticks * 1000);
}

export function getCodeFromChar(char: string) {
    return Wifi.possibleChars.indexOf(char);
}

export function getCharFromCode(code: number) {
    return Wifi.possibleChars[code];
}

export function hashChar(char: string, apartment: Apartment = shared.activeApartment): string {
    const command = apartment.router.connectedWifi!.command;
    const disalignment = (2 * command + 1) * 2;

    const maxLength = Wifi.possibleChars.length - 1;

    let halfHashed = getCodeFromChar(char) + disalignment > maxLength ? disalignment - (maxLength - getCodeFromChar(char)) - 1 : getCodeFromChar(char) + disalignment;
    
    return getCharFromCode(halfHashed);
}

export function halfDehashChar(char: string, command: number, apartment: Apartment = shared.activeApartment) {
    const disalignment = (2 * command + 1) * 2;

    const maxLength = Wifi.possibleChars.length - 1;

    let halfHashed = getCodeFromChar(char) - disalignment < 0 ? maxLength - (disalignment - getCodeFromChar(char)) + 1 : getCodeFromChar(char) - disalignment;
    
    return halfHashed;
}

function paste(e: ClipboardEvent) {
    e.preventDefault();
    let paste = e.clipboardData!.getData("text");
    paste = paste.replace(/<\/[^>]+(>|$)/g, "");

    if (e.target!.constructor.name === "HTMLInputElement") {
        (e.target as HTMLInputElement).value = paste;
        return;
    }

    const textNode = document.createTextNode(paste);

    const selection = window.getSelection() as Selection;
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(textNode);
    selection.collapseToEnd();
}
document.addEventListener("paste", paste);

export function openComputer() {
    const loginScreen = document.createElement("login-screen") as LoginScreen;
    document.querySelector("main-screen")!.prepend(loginScreen);

    if (shared.activeApartment.pc.loggedIn) loginScreen.openComputer();
}