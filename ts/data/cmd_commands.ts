import { CMD } from "../apps/cmd/cmd.js";
import { Logger } from "../apps/cmd/logger.js";
import { Token, TokenType } from "../cmd_lexer/lexer.js";
import { generateIP } from "../functions.js";
import { Apartment } from "../models/apartment.js";
import { App } from "../models/app.js";
import { ComputerFile } from "../models/pc/computer_file.js";
import { Folder } from "../models/pc/folder.js";
import { GenericFile } from "../models/pc/generic_file.js";
import { ImageFile } from "../models/pc/image_file.js";
import { FileTypes } from "../models/pc.js";
import { User } from "../models/user.js";
import { Wifi } from "../models/wifi.js";

function isFlag(flag: Token) {
    return flag.type == TokenType.Flag;
}

function removeFlags(tokenized: Token[]) {
    const flagIndexes = [];
    for (let i = 0; i < tokenized.length; i++)
        if (isFlag(tokenized[i])) flagIndexes.push(i);

    for (let i = flagIndexes.length - 1; i >= 0; i--) {
        tokenized.splice(flagIndexes[i], 1);
    }
}

const GLOBAL_COMMANDS = {
    clear: (tokenized: Token[], cmd: CMD) => {
        if (cmd.window) cmd.window.querySelector("#cmd")!.innerHTML = "";
    },
    setuser: (tokenized: Token[]) => {
        const user: User = Apartment.activeApartment.pc.user;

        let string = "";
        const allowedFlags = [
            { value: "name", output: "name"},
            { value: "n", output: "name" },
            { value: "surname", output: "surname"},
            { value: "s", output: "surname" },
            { value: "age", output: "age" },
            { value: "a", output: "age" },
            { value: "phonenumber", output: "phoneNumber" },
            { value: "p", output: "phoneNumber" },
            { value: "job", output: "job" },
            { value: "j", output: "job" },
            { value: "email", output: "email" },
            { value: "e", output: "email" },
        ];
        const flagArray = CMD.getFlags(allowedFlags, tokenized);

        while (tokenized.length > 0) {
            tokenized.shift();

            if (tokenized.length > 0) {
                if (isFlag(tokenized[0]))
                    continue;
                
                string += tokenized[0].value;
            }

            if (tokenized[1] && !isFlag(tokenized[1]))
                string += " ";
        }

        flagArray.forEach(flag => {
            switch(flag) {
                default:
                    (user as { [key: string]: any })[flag] = string;
                    break;
            }
        });

        if (flagArray.length == 0) {
            user.name = string;
            user.surname = "";
            user.fullName = user.name;
        } else {
            user.fullName = user.name + " " + user.surname;
        }
    },
    connectwifi: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();

        if (tokenized.length < 2) {
            Logger.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        Wifi.connectToWifi(cmd.window, tokenized.shift()!.value, tokenized.shift()!.value);
    },
    dirlist: (tokenized: Token[], cmd: CMD) => {
        const folder: GenericFile | GenericFile[] = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

        let filesDir;
        if (cmd.path === "")
            filesDir = [ folder ];
        else
            filesDir = folder;

        for (let i = 0; i < filesDir.length; i++) {
            const file = filesDir[i];
            Logger.log(cmd.window, (file as GenericFile).name + " ");
        }
    },
    cdir: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();
        
        while(tokenized.length > 0) {
            const path = tokenized[0].value;

            if (path == "/") {
                tokenized.shift();
                continue;
            }

            if (path == ".." && cmd.path.length > 0) {
                const pathArray = cmd.path.split("/");
                if (pathArray.length > 1) pathArray.shift();

                cmd.path = "";
                for (let i = 0; i < pathArray.length - 1; i++) {
                    cmd.path += `/${pathArray[i]}`;
                }

                if (cmd.path === "/") cmd.path = "";
            } else {
                const folder: GenericFile | GenericFile[] = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

                let foundFolder
                if (cmd.path === "") {
                    if (folder instanceof Folder) if (folder.name === path) foundFolder = folder.name;
                } else {
                    foundFolder = folder.find(document => {
                        return document.name === path && Object.getPrototypeOf(document).constructor.name === "Folder";
                    })?.name;
                }
                    
                if (!foundFolder) {
                    Logger.error(cmd.window, "Couldn't find folder: " + path);
                } else {
                    cmd.path += `/${foundFolder}`;
                }

            }

            tokenized.shift();
        }
    },
    createfile: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();
        if (tokenized.length < 2) {
            Logger.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        let fileName = tokenized.shift()!.value;
        const typedFileType = tokenized.shift()!.value;

        if (cmd.path === "") {
            Logger.error(cmd.window, "Cannot create file in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFile = pathFiles.find(file => {
            return file.name === fileName && file.constructor.name === "ComputerFile";
        });

        if (foundFile) {
            Logger.error(cmd.window, "Cannot create file with duplicate name");
            return;
        }
        
        const fileType = FileTypes[typedFileType.toLowerCase() as keyof typeof FileTypes];

        if (!fileType) {
            Logger.error(cmd.window, "Unknown file type: " + typedFileType);
            return;
        }

        pathFiles.push(new ComputerFile(fileName, fileType));
    },
    deletefile: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            Logger.error(cmd.window, "Needs at least 1 argument!")
            return;
        }

        let fileName = tokenized.shift()!.value;

        if (cmd.path === ""){
            Logger.error(cmd.window, "Cannot delete file in this path");
            return;
        }

        let files = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        let index = files.findIndex(file => {
            return file.name === fileName && (file.constructor.name === "ComputerFile" || file.constructor.name === "ImageFile");
        });
        if (index !== -1)
            files.splice(index, 1);
        else
            Logger.error(cmd.window, "File " + fileName + " not found");
    },
    createimage: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            Logger.error(cmd.window, "Needs at least 1 arguments!");
            return;
        }

        let fileName = tokenized.shift()!.value;

        if (cmd.path === "") {
            Logger.error(cmd.window, "Cannot create image in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFile = pathFiles.find(file => {
            return file.name === fileName && (file.constructor.name === "ImageFile" || file.constructor.name === "ComputerFile");
        });

        if (foundFile) {
            Logger.error(cmd.window, "Cannot create image with duplicate name");
            return;
        }

        pathFiles.push(new ImageFile(fileName));
    },
    createdir: (tokenized: Token[], cmd: CMD) => {
        tokenized.shift();

        if (tokenized.length <= 0) {
            Logger.error(cmd.window, "Need at least 1 argument!");
            return;
        }

        let dirName = tokenized.shift()!.value;

        if (cmd.path === "") {
            Logger.error(cmd.window, "Cannot create directory in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFolder = pathFiles.find(folder => {
            return folder.name === dirName && folder.constructor.name === "Folder";
        });

        if (foundFolder) {
            Logger.error(cmd.window, "Cannot create folder with duplicate name");
            return;
        }

        pathFiles.push(new Folder(dirName));
    },
    deletedir: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length <= 0) {
            CMD.error(cmd.window, "Need at least 1 argument!");
            return;
        }

        let dirName = tokenized.shift().value;

        if (cmd.path === "") {
            CMD.error(cmd.window, "Cannot delete directory in this path");
            return;
        }

        let folders = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        let index = folders.findIndex(folder => {
            return folder.name === dirName && Object.getPrototypeOf(folder).constructor.name === "Folder";
        });

        if (index !== -1)
            folders.splice(index, 1);
        else 
            CMD.error(cmd.window, "Folder " + dirName + " not found");
    },
    pingpc: async (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length < 3) {
            CMD.error(cmd.window, "Needs at least 3 arguments!");
            return;
        }

        const pingTo = tokenized.shift().value;
        const packetSize = tokenized.shift().value;
        const pings = tokenized.shift().value;

        const pingedPc = PC.getByIP(pingTo);

        if (!pingedPc) {
            CMD.error(cmd.window, "Cannot find PC");
            return;
        }

        const pingedApartment = Apartment.getByPC(pingedPc);
        const wifi = pingedApartment.router.connectedWifi;
        const currentWifi = Apartment.activeApartment.router.connectedWifi
        if (wifi?.ip !== currentWifi?.ip || !currentWifi || !wifi) {
            CMD.error(cmd.window, "Cannot connect with the user");
            return;
        }

        let packetTimePC1_ms = 100;
        let packetTimePC2_ms = 100;
        packetTimePC1_ms *= packetSize;
        packetTimePC2_ms *= packetSize;

        packetTimePC1_ms /= wifi.strength / 5;
        packetTimePC2_ms /= currentWifi.strength / 5;

        let packetTime_ms = (packetTimePC1_ms + packetTimePC2_ms) / 2;

        for (let i = 0; i < parseInt(pings); i++) {
            packetTime_ms *= randomInt(0, 50) / 100 + 0.75; // multiplies from 0.75 - 1.25
            packetTime_ms = Math.floor(packetTime_ms * 10) / 10;

            const maxTimeOutTime = 10000;
            if (packetTime_ms > maxTimeOutTime){
                await wait(maxTimeOutTime);
                CMD.log(cmd.window, "Timed out");
            } else {
                await wait(packetTime_ms);
                CMD.log(cmd.window, "Time: " + packetTime_ms + "ms");
            }
        }
    },
    pcinfo: (tokenized, cmd) => {
        tokenized.shift();

        CMD.log(cmd.window, `IP: ${Apartment.activeApartment.pc.ip}`);
        if (Apartment.activeApartment.router.connectedWifi)
            CMD.log(cmd.window, `
                <table>
                    <tr>
                        <td style="padding-right: 10px">Connected Wifi:</td>
                        <td>Name: </td>
                        <td>${Apartment.activeApartment.router.connectedWifi.name}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Password: </td>
                        <td>${Apartment.activeApartment.router.connectedWifi.password}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>IP: </td>
                        <td>${Apartment.activeApartment.router.connectedWifi.ip}</td>
                    </tr>
                </table>
            `);
        else CMD.log(cmd.window, "Connected Wifi: Not connected");
    },
    colorize: (tokenized, cmd) => {
        tokenized.shift();

        const allowedFlags = [
            { value: "reset", output: "reset"},
            { value: "r", output: "reset" },
        ]
        const flagArray = CMD.getFlags(allowedFlags, tokenized);

        const root = document.querySelector(":root");
        let isReset = false;
        flagArray.forEach(flag => {
            if (flag === "reset") {
                root.style.setProperty("--bg-color", "black");
                root.style.setProperty("--bg-color-faded", "rgba(255, 255, 255, 0.2)");
                root.style.setProperty("--accent-color", "rgb(25, 211, 0)");
                root.style.setProperty("--accent-color-faded", "rgba(25, 211, 0, 0.3)");
                isReset = true;
            }
        });

        removeFlags(tokenized);

        if (isReset) return;

        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        const bgcolor = tokenized.shift().value;
        const accentcolor = tokenized.shift().value;

        root.style.setProperty("--bg-color", bgcolor);
        root.style.setProperty("--bg-color-faded", bgcolor + "33");
        root.style.setProperty("--accent-color", accentcolor);
        root.style.setProperty("--accent-color-faded", accentcolor + "4d");
    },
    install: async (tokenized, cmd, system) => {
        tokenized.shift();

        let string = tokenized.shift().value;
        Object.keys(system.cmdApps).forEach(( key ) => {
            if (string == key || string.toLowerCase() == key.toLowerCase() || string.toUpperCase() == key.toUpperCase()) {
                string = key;
                return;
            }
        });

        if (system.cmdApps[string])
            await CMDApp.install(cmd, string, system);
        else
            CMD.error(cmd.window, "App does not exist: " + string);
    },
    changepassword: (tokenized, cmd) => {
        tokenized.shift();

        let password = "";
        if (tokenized.length > 0) password = tokenized.shift().value;

        Apartment.activeApartment.pc.password = password;
    },
    editfile: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }

        const fileName = tokenized.shift().value;

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

        if (pathFiles.name) {
            CMD.error(cmd.window, "Cannot edit file in this path");
            return;
        }

        const foundFile = pathFiles.find(file => {
            return file.name === fileName && (file.constructor.name === "ComputerFile" || file.constructor.name === "ImageFile");
        });

        if (!foundFile) {
            CMD.error(cmd.window, "Cannot find file in this path");
            return;
        }

        Notepad.openApp(foundFile);
    },
    downapp: async (tokenized, cmd, system) => {
        let string = "";
        while (tokenized.length > 0) {
            tokenized.shift();

            if (tokenized.length > 0)
                string += tokenized[0].value;

            if (tokenized[1])
                string += " ";
        }
        Object.keys(system.apps).forEach(( key ) => {
            if (string == key || string.toLowerCase() == key.toLowerCase() || string.toUpperCase() == key.toUpperCase()) {
                string = key;
                return;
            }
        });

        if (system.apps[string])
            await App.downloadApp(cmd, string, system);
        else
            CMD.error(cmd.window, "App does not exist: " + string);
    },
    watch: async (tokenized, cmd, system) => {
        tokenized.shift();

        if (tokenized.length < 3) {
            CMD.error(cmd.window, "Needs at least 3 arguments!");
            return;
        }

        const wifiIP = tokenized.shift().value;
        const port = tokenized.shift().value;
        const time_s = tokenized.shift().value;

        const wifi = wifis.find(wifi => wifi.ip === wifiIP);
        if (!wifi) {
            CMD.error(cmd.window, "Wifi IP not found");
            return;
        }

        const portInfo = wifi.activePorts.find(portInfo => portInfo.port == port);
        if (!portInfo) {
            CMD.error(cmd.window, "Wifi does not have port " + port + " active");
            return;
        }

        await new Promise(async ( resolve, reject ) => {
            let intervalTicks = 0;
            const slog = CMD.slog(cmd.window);
            while(true) {
                if (tickstoms(intervalTicks) >= time_s * 1000) {
                    CMD.inlog(cmd.window, slog, hashChar(Apartment.activeApartment.router.connectedWifi.command));
                    resolve();
                    break;
                }

                CMD.inlog(cmd.window, slog, hashChar(portInfo.pcIPs[0].packets[portInfo.pcIPs[0].packetIndex]));

                intervalTicks++;

                await wait(tps * trojanMultiplier);
            }
        });
    },
    alocate: async (tokenized, cmd, system) => {
        tokenized.shift();

        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 3 arguments!");
            return;
        }

        const packets = tokenized.shift().value;
        const command = tokenized.shift().value;

        await new Promise(async ( resolve, reject ) => {
            const slog = CMD.slog(cmd.window);

            let i = 0;
            while(true) {
                if (packets.length <= i) {
                    resolve();
                    break;
                }

                const halfDehash = halfDehashChar(packets[i], command)
                CMD.inlog(cmd.window, slog, halfDehash);
                if (i < packets.length - 1) CMD.inlog(cmd.window, slog, ":");

                i++;

                await wait(tps * trojanMultiplier);
            }
        });
    },
    codetable: async (tokenized, cmd, system) => {
        tokenized.shift();

        const slog = CMD.slog(cmd.window);
        for (let i = 0; i < Wifi.possibleChars.length; i++) {
            CMD.inlog(cmd.window, slog, `${i}-${Wifi.possibleChars[i]}`);
            if (i < Wifi.possibleChars.length - 1) CMD.inlog(cmd.window, slog, ", ");
        }
    },
    forcepassword: async (tokenized, cmd, system) => {
        tokenized.shift();

        const allowedFlags = [
            { value: "wifi", output: "wifi"},
            { value: "w", output: "wifi" },
            { value: "adminpanel", output: "adminpanel" },
            { value: "ap", output: "adminpanel" },
        ]
        const flagArray = CMD.getFlags(allowedFlags, tokenized);

        let whatToForce;
        flagArray.forEach(flag => {
            whatToForce = flag;
        });

        removeFlags(tokenized);

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }
        const wifiIP = tokenized.shift().value;

        const wifi = wifis.find(wifi => wifi.ip === wifiIP);
        if (!wifi) {
            CMD.error(cmd.window, "Wifi not found");
            return;
        }

        let toCheck;
        if (whatToForce === "adminpanel") {
            toCheck = wifi.adminPanelPassword;
        } else {
            toCheck = wifi.password;
        }

        await new Promise(async ( resolve, reject ) => {
            CMD.log(cmd.window, "Forcing password...");

            let i = 1;
            let password = "";
            let testPassword = "aa".split("");
            let passwordIndex = 0;

            let intervalTicks = 0;
            let interval = setInterval(() => {
                intervalTicks++;
            }, tps);

            while(true) {
                let passStr = "";
                testPassword.forEach(char => {
                    passStr += char;
                });

                if (passStr === toCheck[passwordIndex] + toCheck[passwordIndex + 1]) {
                    testPassword.forEach(char => {
                        password += char
                    });

                    passwordIndex += 2;
                    testPassword = "aa".split("");
                }

                if (password === toCheck) {
                    CMD.log(cmd.window, `Password: ${password}`);
                    CMD.log(cmd.window, `Time elapsed: ${tickstoms(intervalTicks)}ms`);
                    clearInterval(interval);
                    resolve();
                    break;
                }

                testPassword[0] = Wifi.possibleChars[i];

                for (let j = 0; j < testPassword.length; j++) {
                    if (testPassword[j] == undefined) {
                        testPassword[j] = Wifi.possibleChars[0];
                        if (j + 1 < testPassword.length);
                            testPassword[j + 1] = Wifi.possibleChars[Wifi.possibleChars.indexOf(testPassword[j + 1]) + 1];
                    }
                }

                if (i >= Wifi.possibleChars.length) {
                    i = 0;
                }
                i++;

                await wait(tps * trojanMultiplier);
            }
        });
    },
    systeminfo: (tokenized, cmd, system) => {
        tokenized.shift();

        CMD.log(cmd.window, `System: ${Apartment.activeApartment.pc.os.system} ${Apartment.activeApartment.pc.os.version}`);
        CMD.log(cmd.window, "Name: " + Apartment.activeApartment.pc.os.system);
        CMD.log(cmd.window, "Version: " + Apartment.activeApartment.pc.os.version);
    },
    paint: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }

        const fileName = tokenized.shift().value;

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

        if (pathFiles.name) {
            CMD.error(cmd.window, "Cannot edit file in this path");
            return;
        }

        const foundFile = pathFiles.find(file => {
            return file.name === fileName && file.constructor.name === "ImageFile";
        });

        if (!foundFile) {
            CMD.error(cmd.window, "Cannot find file in this path");
            return;
        }

        Canvas.openApp(foundFile);
    },
    shop: (tokenized, cmd, system) => {
        tokenized.shift();

        CMD.log(cmd.window, "---Apps---");
        Object.keys(apps).forEach(app => {
            if (!apps[app].isFree) {
                CMD.log(cmd.window, `${app} - ${apps[app].price} DigiCoins`);
            }
        });

        CMD.log(cmd.window, "<br>");
        
        CMD.log(cmd.window, "---CMD Apps---");
        Object.keys(Streamline.cmdApps).forEach(app => {
            if (!Streamline.cmdApps[app].isFree) {
                CMD.log(cmd.window, `${app} - ${Streamline.cmdApps[app].price} DigiCoins`);
            }
        });
        Object.keys(NeoX.cmdApps).forEach(app => {
            if (!NeoX.cmdApps[app].isFree) {
                CMD.log(cmd.window, `${app} - ${NeoX.cmdApps[app].price} DigiCoins`);
            }
        });
        Object.keys(Cronos.cmdApps).forEach(app => {
            if (!Cronos.cmdApps[app].isFree) {
                CMD.log(cmd.window, `${app} - ${Cronos.cmdApps[app].price} DigiCoins`);
            }
        });

        CMD.log(cmd.window, "<br>");

        CMD.log(cmd.window, "---Items---");
        Object.keys(items).forEach(item => {
            CMD.log(cmd.window, `${item} - ${items[item].price} DigiCoins`);
        });
    },
    buy: (tokenized, cmd, system) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }

        const appName = tokenized.shift().value;

        let name = "";
        Object.keys(apps).forEach(app => {
            if (app.toLowerCase() === appName.toLowerCase()) name = app;
        });
        Object.keys(Streamline.cmdApps).forEach(app => {
            if (app.toLowerCase() === appName.toLowerCase()) name = app;
        });
        Object.keys(NeoX.cmdApps).forEach(app => {
            if (app.toLowerCase() === appName.toLowerCase()) name = app;
        });
        Object.keys(Cronos.cmdApps).forEach(app => {
            if (app.toLowerCase() === appName.toLowerCase()) name = app;
        });
        Object.keys(items).forEach(item => {
            if (item.toLowerCase() === appName.toLowerCase()) name = item;
        });

        const app = apps[name] || Streamline.cmdApps[name] || NeoX.cmdApps[name] || Cronos.cmdApps[name];
        const item = items[name];

        if (!app && !item) {
            CMD.error(cmd.window, "App or item not found");
            return;
        }

        if (app) {
            if (player.boughtApps[name]) {
                CMD.error(cmd.window, "You have already bought this app");
                return;
            }
    
            if (app.isFree) {
                return;
            }
    
            if (app.price > player.digiCoins) {
                CMD.error(cmd.window, "Not enough DigiCoins to buy app: " + name);
                return;
            }
    
            CMD.log(cmd.window, name + " bought!");
            player.digiCoins -= app.price;
            player.boughtApps[name] = app;
        }

        if (item) {
            if (item.price > player.digiCoins) {
                CMD.error(cmd.window, "Not enough DigiCoins to buy app: " + name);
                return;
            }
    
            CMD.log(cmd.window, name + " bought!");
            player.digiCoins -= item.price;
            player.boughtItems.push(new item());
        }
    },
}

const OS = {
    Streamline: {
        "V": {
            clear: GLOBAL_COMMANDS.clear,
            setuser: GLOBAL_COMMANDS.setuser,
            systeminfo: GLOBAL_COMMANDS.systeminfo,
            help: (tokenized, cmd) => {
                CMD.log(cmd.window, /*html*/`
                    <p>help - Shows basic commands you can use</p>
                    <p>clear - Clears console</p>
                    <p>colorize *bgcolor* *accentcolor* - Sets color scheme to desired colors (note: only hexadecimal values)</p>
                    <p>changepassword *password* - Changes current PC password ( note, if no password is set, the PC will have no password [automatically logs you in] )</p>
                    <p>setuser *name* - Changes current user name</p>
                    <p>systeminfo - Returns system info</p>
                    <p>downapp *app* - Downloads the specified app</p>
                    <p>connectwifi *name* *password* - Connects to given Wifi</p>
                    <p>dirlist - Directory list</p>
                    <p>cdir *path* - Changes directory to selected path</p>
                    <p>createfile *filename* *filetype* - Creates file in current directory</p>
                    <p>createimage *filename* - Creates new image file in current directory</p>
                    <p>deletefile *filename* - Deletes file or image in current directory</p>
                    <p>editfile *filename* - Opens a new instance of Notepad with file edit</p>
                    <p>paint *filename* - Opens new instance of Canvas with file paint</p>
                    <p>createdir *dirname* - Creates new directory (folder) in current directory</p>
                    <p>deletedir *dirname* - Deletes new directory (folder) in current directory</p>
                    <p>pingpc *computer ip* *packet size* *pings* - Pings computer with desired packet size</p>
                    <p>install *appname* - Installs command app</p>
                    <p>watch *wifi ip* *port* *time s* - Watches hashed packets through internet</p>
                    <p>alocate *packets* *command* - Alocates packets with given command</p>
                    <p>codetable - Returns table of code contents</p>
                    <p>forcepassword *wifi ip* - Brute forces the Wifi password and gives 2 outputs</p>
                    <p>shop - Returns shop items</p>
                    <p>buy *appname* - Buys app</p>
                `);
            },
            downapp: async (tokenized, cmd) => {
                await GLOBAL_COMMANDS.downapp(tokenized, cmd, Streamline);
            },
            connectwifi: GLOBAL_COMMANDS.connectwifi,
            dirlist: GLOBAL_COMMANDS.dirlist,
            cdir: GLOBAL_COMMANDS.cdir,
            createfile: GLOBAL_COMMANDS.createfile,
            deletefile: GLOBAL_COMMANDS.deletefile,
            createimage: GLOBAL_COMMANDS.createimage,
            createdir: GLOBAL_COMMANDS.createdir,
            deletedir: GLOBAL_COMMANDS.deletedir,
            pingpc: GLOBAL_COMMANDS.pingpc,
            pcinfo: GLOBAL_COMMANDS.pcinfo,
            colorize: GLOBAL_COMMANDS.colorize,
            install: async (tokenized, cmd) => {
                await GLOBAL_COMMANDS.install(tokenized, cmd, Streamline);
            },
            changepassword: GLOBAL_COMMANDS.changepassword,
            editfile: GLOBAL_COMMANDS.editfile,
            watch: GLOBAL_COMMANDS.watch,
            alocate: GLOBAL_COMMANDS.alocate,
            codetable: GLOBAL_COMMANDS.codetable,
            forcepassword: GLOBAL_COMMANDS.forcepassword,
            paint: GLOBAL_COMMANDS.paint,
            shop: GLOBAL_COMMANDS.shop,
            buy: GLOBAL_COMMANDS.buy,
        },
        "X": {
            info: GLOBAL_COMMANDS.systeminfo,
        },
        "XI": {
            info: GLOBAL_COMMANDS.systeminfo,
        },
        "Head": {
            sysinfo: GLOBAL_COMMANDS.systeminfo,
        }
    },
    NeoX: {
        "Ease": {
            systemconfig: GLOBAL_COMMANDS.systeminfo,
        },
        "Slim": {
            config: GLOBAL_COMMANDS.systeminfo,
        }
    },
    Cronos: {
        "1.0": {
            system: GLOBAL_COMMANDS.systeminfo,
        },
        "1.1": {
            system: GLOBAL_COMMANDS.systeminfo,
        },
        "2.0": {
            sys: GLOBAL_COMMANDS.systeminfo,
        },
        "2.1": {
            sys: GLOBAL_COMMANDS.systeminfo,
        },
        "2.2": {
            sys: GLOBAL_COMMANDS.systeminfo,
        }
    }
}