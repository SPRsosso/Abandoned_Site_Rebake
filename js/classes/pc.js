class PC {
    constructor() {
        this.documents = { name: "Documents" };
        let tmpDoc = this.documents;
        for (let i = 0; i < 3; i++) {
            tmpDoc["files"] = [];
            for (let j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
                const randomType = Math.random();
                let type;
                
                if (randomType < 0.33)
                    type = "firewall";
                else if (randomType < 0.66)
                    type = "authorized";
                else
                    type = "transmission";

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
        this.user = pc_names[Math.floor(Math.random() * pc_names.length)] + " " + pc_surnames[Math.floor(Math.random() * pc_surnames.length)];
        this.password = "";
        for (let i = 0; i < 10; i++) {
            this.password  += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        }
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
}