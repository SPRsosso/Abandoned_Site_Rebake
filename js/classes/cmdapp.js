class CMDApp {
    constructor() {

    }

    static command(tokenized, cmd) {
        CMD.log(cmd.window, "Default CMD App, not implemented yet!");
    }

    static install(app, appName, system) {
        if (!Apartment.activeApartment.router.connectedWifi) {
            CMD.error(app, "No Wifi connected!");
            return;
        }

        const appSize = 5000 / Apartment.activeApartment.router.connectedWifi.strength;
        return new Promise(async ( resolve, reject ) => {
            await App.wait(app, appSize);

            let name = "";
            const currentOS = Apartment.activeApartment.pc.os
            switch (appName.toLowerCase()) {
                case "portscanner":
                    if (currentOS.system === "Streamline" && currentOS.version === "V") name = "portscanner";
                    else if (currentOS.system === "Streamline" && currentOS.version === "X") name = "portscan";
                    else name = "ps";

                    break;
            }

            Apartment.activeApartment.pc.os.commands[currentOS.system][currentOS.version][name] = system.cmdApps[appName].command;
            resolve();
        });
    }
}