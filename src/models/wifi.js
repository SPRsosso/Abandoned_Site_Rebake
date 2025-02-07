import { Logger } from "../apps/cmd/logger.js";
import { wifiCompanies } from "../data/wifi_companies.js";
import { generateIP } from "../functions.js";
import { shared } from "../shared.js";
const wifis = [];
export class Wifi {
    static lower = "abcdefghijklmnopqrstuvwxyz";
    static upper = Wifi.lower.toUpperCase();
    static nums = "0123456789";
    static possibleChars = Wifi.lower + Wifi.upper + Wifi.nums;
    maxNameLength = 7;
    maxPasswordLength = 10;
    maxAdminPanelPasswordLength = 6;
    name = "";
    password = "";
    adminPanelPassword = "";
    pos;
    ip;
    strength;
    company;
    command;
    constructor() {
        for (let i = 0; i < this.maxNameLength; i++)
            this.name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        for (let i = 0; i < this.maxPasswordLength; i++)
            this.password += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        this.pos = {
            x: Math.floor(Math.random() * 50) - 25,
            y: Math.floor(Math.random() * 50) - 25
        };
        this.strength = 0;
        this.ip = generateIP(wifis);
        this.company = wifiCompanies[Math.floor(Math.random() * wifiCompanies.length)];
        for (let i = 0; i < this.maxAdminPanelPasswordLength; i++)
            this.adminPanelPassword += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        this.command = Math.floor(Math.random() * 6);
    }
    changeStrength(startPos) {
        const distance = Math.hypot(startPos.x - this.pos.x, startPos.y - this.pos.y);
        if (distance <= 5)
            this.strength = 5;
        else if (distance <= 10)
            this.strength = 4;
        else if (distance <= 15)
            this.strength = 3;
        else if (distance <= 20)
            this.strength = 2;
        else
            this.strength = 1;
    }
    static connectToWifi(app, name, pwd, apartment = shared.activeApartment) {
        const foundWifi = apartment.wifis.find(wifi => wifi.name == name && wifi.password == pwd);
        if (foundWifi) {
            apartment.router.connectedWifi = foundWifi;
            shared.activeApartment.routers.find(router => router.name == apartment.router.name).connectedWifi = foundWifi;
            Logger.log(app, "Successfully connected to Wifi.");
        }
        else {
            Logger.error(app, "Cannot connect to Wifi: " + name);
        }
    }
}
