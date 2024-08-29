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
            await App.wait(app, appSize * trojanMultiplier);

            let name = "";
            const currentOS = Apartment.activeApartment.pc.os
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

            Apartment.activeApartment.pc.os.commands[currentOS.system][currentOS.version][name] = system.cmdApps[appName].command;
            resolve();
        });
    }
}