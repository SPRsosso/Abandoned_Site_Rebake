import { apartments } from "./data/apartments.js";
import { wifis } from "./data/wifis.js";
import { randomInt } from "./functions.js";
import { Apartment } from "./models/apartment.js";
import { PhoneBank } from "./models/phone/apps/phonebank.js";
import { PhoneCalculator } from "./models/phone/apps/phonecalculator.js";
import { PhoneCrack } from "./models/phone/apps/phonecrack.js";
import { PhoneNotes } from "./models/phone/apps/phonenotes.js";
import { PhoneTutorial } from "./models/phone/apps/phonetutorial.js";
import { phoneApps } from "./models/phone/phoneapps.js";
import { Wifi } from "./models/wifi.js";
import { shared } from "./shared.js";
export function init() {
    let openPhone = document.querySelector("#open-phone");
    openPhone.addEventListener("click", () => {
        const phone = document.querySelector("phone-component");
        phone.classList.toggle("open");
        phone.classList.remove("close");
        if (phone.classList.contains("open")) {
            openPhone.querySelector("img").src = "./icons/ClosePhone.png";
        }
        else {
            phone.classList.add("close");
            openPhone.querySelector("img").src = "./icons/OpenPhone.png";
        }
    });
    const apartmentCount = 50;
    for (let i = 0; i < apartmentCount; i++) {
        let apartNum = i < 10 ? `30${i}` : `3${i}`;
        apartments.push(new Apartment("Chive Apartment", apartNum));
    }
    shared.activeApartment = apartments[0];
    const wifiCount = 10;
    for (let i = 0; i < wifiCount; i++)
        wifis.push(new Wifi());
    apartments.forEach(apartment => {
        apartment.wifis = wifis.map(a => Object.setPrototypeOf(Object.assign({}, a), Wifi.prototype));
        for (let i = 0; i < wifiCount; i++) {
            apartment.wifis[i].changeStrength(apartment.router.strength);
        }
        apartment.router.connectedWifi = apartment.wifis[randomInt(0, wifiCount - 1)];
    });
    phoneApps["PhoneTutorial"] = PhoneTutorial;
    phoneApps["PhoneBank"] = PhoneBank;
    phoneApps["PhoneNotes"] = PhoneNotes;
    phoneApps["PhoneCalculator"] = PhoneCalculator;
    phoneApps["PhoneCrack"] = PhoneCrack;
}
init();
