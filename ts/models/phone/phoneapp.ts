import { PhoneAppComponent } from "../../components/phone-app-component.js";
import { PhoneComponent } from "../../components/phone-component.js";
import { openedPhoneApps, phoneApps } from "./phoneapps.js";

export class PhoneApp {
    static screen: PhoneComponent;

    window: PhoneAppComponent;

    constructor(window: PhoneAppComponent) {
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component") as PhoneAppComponent;
        appComponent.innerHTML = `
            <span slot="name">Default phone app ( not modded )</span>
        `;

        console.log(this.screen);
        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneApp(appComponent));
    }

    static showAppIcons(phone: PhoneComponent) {
        const grid = phone.shadow.querySelector("#app-grid") as HTMLElement;

        grid.innerHTML = "";
        Object.keys(phoneApps).forEach((phoneApp: string) => {
            grid.innerHTML += `<phone-app-icon icon-path="./icons/${phoneApp}.png" app-name="${phoneApp}"></phone-app-icon>`;
        });
    }

    static closeAllApps() {
        while (openedPhoneApps[0]) {
            openedPhoneApps[0].window.remove();
            openedPhoneApps.shift();
        }
    }
}