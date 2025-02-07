import { openedPhoneApps } from "./phone/phoneapps.js";
export class Player {
    #digiCoins;
    boughtApps;
    boughtItems;
    constructor() {
        this.#digiCoins = 0;
        this.boughtApps = {};
        this.boughtItems = [];
    }
    get digiCoins() {
        return this.#digiCoins;
    }
    set digiCoins(digiCoins) {
        this.#digiCoins = digiCoins;
        if (this.#digiCoins < 0) {
            this.#digiCoins = 0;
        }
        this.#digiCoins = Math.round(this.#digiCoins * 1000) / 1000;
        openedPhoneApps.forEach((phoneApp) => {
            if (phoneApp.constructor.name === "PhoneBank") {
                phoneApp.window.querySelector("#coins").innerText = this.#digiCoins.toString();
            }
        });
    }
}
