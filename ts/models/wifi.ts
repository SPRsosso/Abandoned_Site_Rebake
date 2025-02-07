import { Logger } from "../apps/cmd/logger.js";
import { AppComponent } from "../components/app-component.js";
import { Company, wifiCompanies } from "../data/wifi_companies.js";
import { generateIP } from "../functions.js";
import { shared } from "../shared.js";
import { Position } from "./position.js";
import { Router } from "./router.js";

const wifis: Wifi[] = [];

export class Wifi {
    static lower = "abcdefghijklmnopqrstuvwxyz"
    static upper = Wifi.lower.toUpperCase();
    static nums = "0123456789";
    static possibleChars =  Wifi.lower +  Wifi.upper +  Wifi.nums;

    private maxNameLength: number = 7;
    private maxPasswordLength: number = 10;
    private maxAdminPanelPasswordLength = 6;

    name: string = "";
    password: string = "";
    adminPanelPassword: string = "";
    pos: Position;
    ip: string;

    strength: number;
    company: Company;
    command: number;

    constructor() {
        for (let i = 0; i < this.maxNameLength; i++)
            this.name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        
        for (let i = 0; i < this.maxPasswordLength; i++)
            this.password += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

        this.pos = {
            x: Math.floor(Math.random() * 50) - 25,
            y: Math.floor(Math.random() * 50) - 25
        }
        this.strength = 0;

        this.ip = generateIP(wifis);
        this.company = wifiCompanies[Math.floor(Math.random() * wifiCompanies.length)];

        for (let i = 0; i < this.maxAdminPanelPasswordLength; i++)
            this.adminPanelPassword += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

        this.command = Math.floor(Math.random() * 6);
    }

    changeStrength(startPos: Position) {
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

    static connectToWifi(app: AppComponent | null, name: string, pwd: string, apartment = shared.activeApartment) {
        const foundWifi = apartment.wifis.find(wifi => wifi.name == name && wifi.password == pwd);
        if (foundWifi) {
            apartment.router.connectedWifi = foundWifi;
            (shared.activeApartment.routers.find(router => router.name == apartment.router.name) as Router).connectedWifi = foundWifi;

            Logger.log(app, "Successfully connected to Wifi.");
        } else {
            Logger.error(app, "Cannot connect to Wifi: " + name);
        }
    }
}