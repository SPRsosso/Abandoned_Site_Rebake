const FileTypes = {
    firewall: "firewall",
    authorized: "authorized",
    transmission: "transmission"
}

const phoneNumbers = [];
const ids = [];

class PC {
    constructor(apartment) {
        this.documents = { name: "Documents" };
        let tmpDoc = this.documents;
        for (let i = 0; i < 3; i++) {
            tmpDoc["files"] = [];
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

                tmpDoc["files"].push({ name, type });
            }
            if (i + 1 < 3) {
                let name = "";
                for (let k = 0; k < 10; k++)
                    name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

                tmpDoc["folder"] = { name };
                tmpDoc = tmpDoc["folder"];
            }
        }
        this.downloadedApps = { CMD, FileExplorer };
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

        this.user = new User(name, surname, Math.floor(Math.random() * 27) + 18, "Chive Apartment " + apartment.roomNumber, job, phoneNumber, id, email);
        this.password = "";
        for (let i = 0; i < 10; i++) {
            this.password  += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        }

        this.messages = {};
    }

    get(index) {
        let i = 0;
        let tmpDoc = this.documents;
        while(i < index) {
            tmpDoc = tmpDoc["folder"];
            i++;
        }
        return tmpDoc;
    }

    static getByUser(userId) {
        return apartments.find(apartment => apartment.pc.user.id === userId)?.pc;
    }
}