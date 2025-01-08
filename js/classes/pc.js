const FileTypes = {
    firewall: "firewall",
    authorized: "authorized",
    transmission: "transmission"
}

const phoneNumbers = [];
const ids = [];
const pcs = [];

class PC {
    #on;
    constructor(apartment) {
        this.documents = new Folder("Documents");
        this.generateFiles();

        this.downloadedApps = {
            CMD,
            FileExplorer,
            Calculator,
            MessX,
            Browser,
            Notepad,
            Canvas,
        };

        const name = pc_names[Math.floor(Math.random() * pc_names.length)];
        const surname = pc_surnames[Math.floor(Math.random() * pc_surnames.length)];
        const job = pc_jobs[Math.floor(Math.random() * pc_jobs.length)];

        let phoneNumber = [];
        do {
            for (let i = 0; i < 3; i++) {
                phoneNumber.push(Math.floor(Math.random() * 1000));
                if (phoneNumber[i] < 10)
                    phoneNumber[i] = "00" + phoneNumber[i];
                else if (phoneNumber[i] < 100)
                    phoneNumber[i] = "0" + phoneNumber[i];
            }

            if (!phoneNumbers.find(phonenNum => phonenNum == phoneNumber)) {
                phoneNumbers.push(phoneNumber);
                break;
            }
        } while(true);
        phoneNumber = phoneNumber[0] + "-" + phoneNumber[1] + "-" + phoneNumber[2];

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

        this.user = new User(name, surname, Math.floor(Math.random() * 27) + 18, apartment.name, job, phoneNumber, id, email);
        this.password = "";
        for (let i = 0; i < 10; i++) {
            this.password  += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        }

        this.messages = {};

        this.ip = generateIP(pcs);

        this.os = {
            system: "Streamline",
            version: "V",
            commands: Object.setPrototypeOf( Object.assign( {}, OS ), OS )
        };

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

    get(path) {
        path = path.split("/");
        let tmpDoc = this.documents
        // debugger;
        for (let i = 0; i < path.length; i++) {
            if (path.length === 1 && this.documents.name === path[i]) return tmpDoc.inside;
            if (tmpDoc.forEach) {
                tmpDoc.forEach(doc => {
                    if (Object.getPrototypeOf(doc).constructor.name === "Folder")
                        if (doc.name === path[i]) tmpDoc = doc.inside;
                });
            } else {
                if (Object.getPrototypeOf(tmpDoc).constructor.name === "Folder")
                    if (tmpDoc.name === path[i]) tmpDoc = tmpDoc.inside;
            }
        }

        if (tmpDoc === undefined) throw new Error("Cannot access undefined");
        return tmpDoc;
    }

    static getByUser(userId) {
        return apartments.find(apartment => apartment.pc.user.id === userId)?.pc;
    }

    static getByIP(ip) {
        return apartments.find(apartment => apartment.pc.ip === ip)?.pc;
    }

    generateFiles() {
        let tmpDoc = this.documents;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
                const randomType = Math.random();
                
                let type;
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
        if (Apartment.activeApartment.pc.state !== "open") return;

        if (Apartment.activeApartment.pc.on) {
            Apartment.activeApartment.pc.state = "shuttingdown";
            Apartment.activeApartment.pc.on = false;
            App.screen.innerHTML = `<p class="pc-center-text">Shutting down PC</p>`;

            const loading = document.createElement("div");
            loading.classList.add("loading");
            App.screen.prepend(loading);

            await wait(3000);

            Apartment.activeApartment.pc.openedApps = [];

            App.screen.innerHTML = "";
            Apartment.activeApartment.pc.state = "open";
        } else {
            Apartment.activeApartment.pc.state = "shuttingdown";
            
            App.screen.innerHTML = /*html*/`
                <p>PC starting up...</p>
                <div class="bottom-right">
                    <p>Press Delete to open BIOS</p>
                </div>
            `;

            await wait(2000);

            App.screen.innerHTML = "";

            if (!Apartment.activeApartment.pc.os.system || biosKeyPressed) {
                const bios = document.createElement("bios-component");

                App.screen.append(bios);
            } else {
                App.screen.innerHTML = `<p class="pc-center-text">${Apartment.activeApartment.pc.os.system} starting up...</p>`;
                App.screen.innerHTML += /*html*/`<img class="system-icon" src="./icons/${Apartment.activeApartment.pc.os.system}.gif">`;

                await wait(6000);

                openComputer();
            }
            
            Apartment.activeApartment.pc.on = true;
            Apartment.activeApartment.pc.state = "open";
        }
    }

    static async downloadOS(system, version) {
        Apartment.activeApartment.pc.state = "downloadingos";

        const downloadingSpeed = 5000;
        await wait(downloadingSpeed);

        Apartment.activeApartment.pc.os.system = system;
        Apartment.activeApartment.pc.os.version = version;
        Apartment.activeApartment.pc.state = "open";
        Apartment.activeApartment.pc.on = false;

        PC.shutdown();
    }
}