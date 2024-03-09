class PC {
    constructor() {
        this.documents = {};
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


                tmpDoc["files"].push({ name: Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)], type });
            }
            if (i + 1 < 3) {
                tmpDoc["folder"] = {};
                tmpDoc = tmpDoc["folder"];
            }
        }
        this.downloadedApps = [ CMD ];
        this.routers = [];
        this.user = "";
        this.password = "";
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