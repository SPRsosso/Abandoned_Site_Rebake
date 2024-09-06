class CMDApp {
    constructor() {

    }

    static command(tokenized, cmd) {
        CMD.log(cmd.window, "Default CMD App, not implemented yet!");
    }

    static install(cmd, appName, system) {
        const app = cmd.window;
        if (!Apartment.activeApartment.router.connectedWifi) {
            CMD.error(app, "No Wifi connected!");
            return;
        }

        let name = "";
        const currentOS = Apartment.activeApartment.pc.os;
        switch (appName.toLowerCase()) {
            case "portscanner":
                switch(currentOS.system) {
                    case "Streamline":
                        switch(currentOS.version) {
                            case "V":
                                name = "portscanner";
                                break;
                            case "X":
                                name = "portscan";
                                break;
                            default:
                                name = "ps";
                                break;
                        }
                        break;
                }
                break;
            case "decoder":
                switch(currentOS.system) {
                    case "Streamline":
                        switch(currentOS.version) {
                            default:
                                name = "decode";
                                break;
                        }
                        break;
                }
                break;
        }

        if (Apartment.activeApartment.pc.os.commands[currentOS.system][currentOS.version][name]) {
            CMD.error(app, "App already downloaded!");
            return;
        }

        if (!system.cmdApps[appName].isFree) {
            if (!player.boughtApps[appName]) {
                CMD.error(app, "App is not bought!");
                return;
            }
        }

        const appSize = 30000 / Apartment.activeApartment.router.connectedWifi.strength;
        return new Promise(async ( resolve, reject ) => {
            await App.wait(app, appSize * trojanMultiplier);

            if (!Apartment.activeApartment.pc.openedApps.find(app => app == cmd)) {
                resolve();
                return;
            }

            Apartment.activeApartment.pc.os.commands[currentOS.system][currentOS.version][name] = system.cmdApps[appName].command;
            resolve();
        });
    }
}