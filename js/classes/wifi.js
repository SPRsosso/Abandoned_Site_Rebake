const wifis = [];

class Wifi {
    static lower = "abcdefghijklmnopqrstuvwxyz"
    static upper = Wifi.lower.toUpperCase();
    static nums = "0123456789";
    static possibleChars =  Wifi.lower +  Wifi.upper +  Wifi.nums;
    constructor() {
        this._maxNameLength = 7;
        this.name = "";
        for (let i = 0; i < this._maxNameLength; i++)
            this.name += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
        
        this._maxPasswordLength = 10;
        this.password = "";
        for (let i = 0; i < this._maxPasswordLength; i++)
            this.password += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

        this.passwordKeys = [];
        for (let i = 0; i < this.password.length; i++) {
            this.passwordKeys.push(Wifi.possibleChars.indexOf(this.password[i]));
        }

        this.pos = {
            x: Math.floor(Math.random() * 50) - 25,
            y: Math.floor(Math.random() * 50) - 25
        }
        this.strength = null;

        this.ip = generateIP(wifis);
        this.company = wifiCompanies[Math.floor(Math.random() * wifiCompanies.length)];
        // this.company = wifiCompanies[0];

        this._maxAdminPanelPasswordLength = 7;
        this.adminPanelPassword = "";
        for (let i = 0; i < this._maxAdminPanelPasswordLength; i++)
            this.adminPanelPassword += Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];

        this.activePorts = []
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

    static async breakWifi(app, wifiName) {
        let wifi = wifis.find(wifi => wifi.name == wifiName);

        let appConsole = openedApps.find(openedApp => openedApp.window == app);
        let result = await Wifi.showBreakNumbers(app);
        appConsole.getStartLine();
        
        let counter = 0;
        let goodAnswers = 0;
        const steps = 2;
        await new Promise(resolve => setTimeout(resolve, 0));
        return new Promise(async ( resolve, reject ) => {
            async function getLine(event) {
                if (event.keyCode != 13)
                    return;
    
                const mainScreen = app.querySelector("#cmd");
                let editable = mainScreen.querySelector("[contentEditable]");
                if (!editable)
                    return;

                editable = editable.innerHTML;
                
                app.removeEventListener("keydown", getLine);
                
                
                if (editable == result)
                    goodAnswers++;

                appConsole.removeEditable();

                counter++;
                if (editable != result || editable == "exit") {
                    CMD.error(app, "Incorrect value!");
                    resolve();
                    return;
                }

                await App.wait(app, 2000);

                app.addEventListener("keydown", getLine);

                if (counter >= steps) {
                    if (goodAnswers == steps) {
                        mainScreen.innerHTML += "Key: ";
                        for (let i = 0; i < wifi.passwordKeys.length; i++) {
                            mainScreen.innerHTML += wifi.passwordKeys[i] + " ";
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }
                    app.removeEventListener("keydown", getLine);
                    resolve();
                } else {
                    result = await Wifi.showBreakNumbers(app);
                    appConsole.getStartLine();
                }
            }
            app.addEventListener("keydown", getLine);
        });
    }

    static async showBreakNumbers(app) {
        let sum = 0;

        const mainScreen = app.querySelector("#cmd");
        for (let i = 0; i < 10; i++) {
            let number = Math.floor(Math.random() * 50) + 1;
            mainScreen.innerHTML += number + " ";
            sum += number;

            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return sum;
    }

    static connectToWifi(app, name, pwd, apartment = Apartment.activeApartment) {
        const foundWifi = apartment.wifis.find(wifi => wifi.name == name && wifi.password == pwd);
        if (foundWifi) {
            apartment.router.connectedWifi = foundWifi;
            routers.find(router => router.name == apartment.router.name).connectedWifi = foundWifi;

            Browser.updateActivePorts(apartment);

            CMD.log(app, "Successfully connected to Wifi.");
        } else {
            CMD.error(app, "Cannot connect to Wifi: " + name);
        }
    }
}