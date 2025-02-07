import { CMD } from "../apps/cmd/cmd.js";
import { apartments } from "../data/apartments.js";
import { file_extensions } from "../data/file_extensions.js";
import { pc_email, pc_jobs, pc_names, pc_surnames } from "../data/pc_user_info.js";
import { generateIP, openComputer, wait } from "../functions.js";
import { Apartment } from "./apartment.js";
import { App } from "./app.js";
import { User } from "./user.js";
import { Wifi } from "./wifi.js";
import { ComputerFile } from "./pc/computer_file.js";
import { Folder } from "./pc/folder.js";
import { GenericFile } from "./pc/generic_file.js";
import { shared } from "../shared.js";

export enum FileTypes {
    firewall,
    authorized,
    transmission,
}

const phoneNumbers: string[] = [];
const ids: string[] = [];
const pcs: PC[] = [];

export class PC {
    #on;

    documents: Folder;
    downloadedApps: { [key: string]: any };
    user: User;
    password: string;
    messages: { [key: string]: any };
    ip: string;
    os: { system: string; version: string; commands: { [key: string]: any }};
    loggedIn: boolean;
    state: string;
    browser: { sessions: Session[] };
    openedApps: any[];

    constructor(apartmentName: string) {
        this.documents = new Folder("Documents");
        this.generateFiles();

        this.downloadedApps = {
            CMD,
            // FileExplorer,
            // Calculator,
            // MessX,
            // Browser,
            // Notepad,
            // Canvas,
        };

        const name = pc_names[Math.floor(Math.random() * pc_names.length)];
        const surname = pc_surnames[Math.floor(Math.random() * pc_surnames.length)];
        const job = pc_jobs[Math.floor(Math.random() * pc_jobs.length)];

        let phoneNumber: string[] | string = [];
        do {
            for (let i = 0; i < 3; i++) {
                phoneNumber.push(Math.floor(Math.random() * 1000).toString());
                if (parseInt(phoneNumber[i]) < 10)
                    phoneNumber[i] = "00" + phoneNumber[i];
                else if (parseInt(phoneNumber[i]) < 100)
                    phoneNumber[i] = "0" + phoneNumber[i];
            }

            if (!phoneNumbers.find(phonenNum => phonenNum == phoneNumber)) {
                phoneNumber = phoneNumber[0] + "-" + phoneNumber[1] + "-" + phoneNumber[2];
                phoneNumbers.push(phoneNumber);
                break;
            }
        } while(true);

        let id = "";
        do {
            for (let i = 0; i < 11; i++) {
                id += Math.floor(Math.random() * 10);
            }

            if (!ids.find(i => i == id)) {
                ids.push(id);
                break;
            }
        } while (true);

        const email = name[0].toLowerCase() + surname.toLowerCase() + "@" + pc_email[Math.floor(Math.random() * pc_email.length)];

        this.user = new User(name, surname, Math.floor(Math.random() * 27) + 18, apartmentName, job, phoneNumber, id, email);
        this.password = "";
        for (let i = 0; i < 10; i++) {
            this.password  += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        }

        this.messages = {};

        this.ip = generateIP(pcs);

        // this.os = {
        //     system: "Streamline",
        //     version: "V",
        //     commands: Object.setPrototypeOf( Object.assign( {}, OS ), OS )
        // };

        this.#on = false;
        this.loggedIn = false;
        this.state = "open";

        this.browser = {
            sessions: [],
        }

        this.openedApps = [];

        this.password = "";
        pcs.push(this);
    }

    get on() {
        return this.#on;
    }

    set on(value) {
        this.#on = value;
        if (value === false) this.loggedIn = value;
    }

    get(path: string): GenericFile[] {
        const splitPath = path.split("/");
        let tmpDoc: GenericFile | GenericFile[] = this.documents;

        for (let i = 0; i < splitPath.length; i++) {
            if (splitPath.length === 1 && this.documents.name === splitPath[i] && tmpDoc instanceof Folder) return tmpDoc.inside;
            if (Array.isArray(tmpDoc)) {
                tmpDoc.forEach((doc: GenericFile) => {
                    if (Object.getPrototypeOf(doc).constructor.name === "Folder")
                        if (doc.name === splitPath[i]) tmpDoc = (doc as Folder).inside;
                });
            } else {
                if (Object.getPrototypeOf(tmpDoc).constructor.name === "Folder")
                    if (tmpDoc.name === splitPath[i]) tmpDoc = tmpDoc.inside;
            }
        }

        if (tmpDoc === undefined) throw new Error("Cannot access undefined");
        return tmpDoc as GenericFile[];
    }

    static getByUser(userId: string) {
        return apartments.find((apartment: Apartment) => apartment.pc.user.id === userId)?.pc;
    }

    static getByIP(ip: string) {
        return apartments.find((apartment: Apartment) => apartment.pc.ip === ip)?.pc;
    }

    generateFiles() {
        let tmpDoc: any = this.documents;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
                const randomType = Math.random();
                
                let type: FileTypes;
                if (randomType < 0.33)
                    type = FileTypes.firewall;
                else if (randomType < 0.66)
                    type = FileTypes.authorized;
                else
                    type = FileTypes.transmission;

                let name = "";
                for (let k = 0; k < 7; k++)
                    name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
                name += "." + file_extensions[Math.floor(Math.random() * file_extensions.length)];

                tmpDoc.push(new ComputerFile(name, type));
            }
            if (i + 1 < 3) {
                let name = "";
                for (let k = 0; k < 10; k++)
                    name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

                tmpDoc.push(new Folder(name));
                tmpDoc = tmpDoc.inside[tmpDoc.inside.length - 1];
            }
        }
    }

    static async shutdown() {
        if (shared.activeApartment.pc.state !== "open") return;

        if (shared.activeApartment.pc.on) {
            shared.activeApartment.pc.state = "shuttingdown";
            shared.activeApartment.pc.on = false;
            App.screen.innerHTML = `<p class="pc-center-text">Shutting down PC</p>`;

            const loading = document.createElement("div");
            loading.classList.add("loading");
            App.screen.prepend(loading);

            await wait(3000);

            shared.activeApartment.pc.openedApps = [];

            App.screen.innerHTML = "";
            shared.activeApartment.pc.state = "open";
        } else {
            shared.activeApartment.pc.state = "shuttingdown";
            
            App.screen.innerHTML = /*html*/`
                <p>PC starting up...</p>
                <div class="bottom-right">
                    <p>Press Delete to open BIOS</p>
                </div>
            `;

            await wait(2000);

            App.screen.innerHTML = "";

            if (!shared.activeApartment.pc.os.system || biosKeyPressed) {
                const bios = document.createElement("bios-component");

                App.screen.append(bios);
            } else {
                App.screen.innerHTML = `<p class="pc-center-text">${shared.activeApartment.pc.os.system} starting up...</p>`;
                App.screen.innerHTML += /*html*/`<img class="system-icon" src="./icons/${shared.activeApartment.pc.os.system}.gif">`;

                await wait(6000);

                openComputer();
            }
            
            shared.activeApartment.pc.on = true;
            shared.activeApartment.pc.state = "open";
        }
    }

    static async downloadOS(system: string, version: string) {
        shared.activeApartment.pc.state = "downloadingos";

        const downloadingSpeed = 5000;
        await wait(downloadingSpeed);

        shared.activeApartment.pc.os.system = system;
        shared.activeApartment.pc.os.version = version;
        shared.activeApartment.pc.state = "open";
        shared.activeApartment.pc.on = false;

        PC.shutdown();
    }
}