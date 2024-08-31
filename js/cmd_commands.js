function isFlag(flag) {
    return flag.type == TokenType.Flag;
}

function removeFlags(tokenized) {
    const flagIndexes = [];
    for (let i = 0; i < tokenized.length; i++)
        if (isFlag(tokenized[i])) flagIndexes.push(i);

    for (let i = flagIndexes.length - 1; i >= 0; i--) {
        tokenized.splice(flagIndexes[i], 1);
    }
}

function downapp(tokenized, cmd, system) {
    
}

const GLOBAL_COMMANDS = {
    clear: (tokenized, cmd) => {
        cmd.window.querySelector("#cmd").innerHTML = "";
    },
    setuser: (tokenized) => {
        const user = Apartment.activeApartment.pc.user;

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
        ]
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
                    user[flag] = string;
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
    breakwifi: async (tokenized, cmd) => {
        let string = "";
        while (tokenized.length > 0) {
            tokenized.shift();

            if (tokenized.length > 0)
                string += tokenized[0].value;

            if (tokenized[1])
                string += " ";
        }
        if (wifis.find(wifi => wifi.name == string)) {
            cmd.mode = "breakwifi";
            await Wifi.breakWifi(cmd.window, string);
        } else {
            CMD.error(cmd.window, "Cannot find Wifi: " + string);
        }
    },
    connectwifi: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        Wifi.connectToWifi(cmd.window, tokenized.shift().value, tokenized.shift().value);
    },
    dirlist: (tokenized, cmd) => {
        const folder = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

        let filesDir;
        if (cmd.path === "")
            filesDir = [ folder ];
        else
            filesDir = folder;

        for (let i = 0; i < filesDir.length; i++) {
            CMD.log(cmd.window, filesDir[i].name + " ");
        }
    },
    cdir: (tokenized, cmd) => {
        tokenized.shift();
        // debugger;
        while(tokenized.length > 0) {
            const path = tokenized[0].value;

            if (path == ".." && cmd.path.length > 0) {
                const pathArray = cmd.path.split("/");
                if (pathArray.length > 1) pathArray.shift();

                cmd.path = "";
                for (let i = 0; i < pathArray.length - 1; i++) {
                    cmd.path += `/${pathArray[i]}`;
                }

                if (cmd.path === "/") cmd.path = "";
            } else {
                const folder = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));

                let foundFolder
                if (cmd.path === "") {
                    if (folder.name === path) foundFolder = folder.name;
                } else {
                    foundFolder = folder.find(document => {
                        return document.name === path && Object.getPrototypeOf(document).constructor.name === "Folder";
                    })?.name;
                }
                    
                if (foundFolder)
                    cmd.path += `/${foundFolder}`;
            }

            tokenized.shift();
        }
    },
    createfile: (tokenized, cmd) => {
        tokenized.shift();
        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        let fileName = tokenized.shift().value;
        const typedFileType = tokenized.shift().value;

        if (cmd.path === "") {
            CMD.error(cmd.window, "Cannot create file in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFile = pathFiles.find(file => {
            return file.name === fileName && file.constructor.name === "ComputerFile";
        });

        if (foundFile) {
            CMD.error(cmd.window, "Cannot create file with duplicate name");
            return;
        }
        
        const fileType = FileTypes[typedFileType.toLowerCase()];

        if (!fileType) {
            CMD.error(cmd.window, "Unknown file type: " + typedFileType);
            return;
        }

        pathFiles.push(new ComputerFile(fileName, fileType));
    },
    deletefile: (tokenized, cmd) => {
        tokenized.shift();

        let fileName = tokenized.shift().value;

        if (cmd.path === ""){
            CMD.error(cmd.window, "Cannot delete file in this path");
            return;
        }

        let files = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        let index = files.findIndex(file => {
            return file.name === fileName && (file.constructor.name === "ComputerFile" || file.constructor.name === "ImageFile");
        });
        if (index !== -1)
            files.splice(index, 1);
        else
            CMD.error(cmd.window, "File " + fileName + " not found");
    },
    createimage: (tokenized, cmd) => {
        tokenized.shift();
        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 arguments!");
            return;
        }

        let fileName = tokenized.shift().value;

        if (cmd.path === "") {
            CMD.error(cmd.window, "Cannot create image in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFile = pathFiles.find(file => {
            return file.name === fileName && file.constructor.name === "ImageFile";
        });

        if (foundFile) {
            CMD.error(cmd.window, "Cannot create image with duplicate name");
            return;
        }

        pathFiles.push(new ImageFile(fileName));
    },
    createdir: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length <= 0) {
            CMD.error(cmd.window, "Need at least 1 argument!");
            return;
        }

        let dirName = tokenized.shift().value;

        if (cmd.path === "") {
            CMD.error(cmd.window, "Cannot create directory in this path");
            return;
        }

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFolder = pathFiles.find(folder => {
            return folder.name === dirName && folder.constructor.name === "Folder";
        });

        if (foundFolder) {
            CMD.error(cmd.window, "Cannot create folder with duplicate name");
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
            await CMDApp.install(cmd.window, string, system);
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
            await App.downloadApp(cmd.window, string, system);
        else
            CMD.error(cmd.window, "App does not exist: " + string);
    },
    paint: (tokenized, cmd) => {
        tokenized.shift();

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }

        const fileName = tokenized.shift().value;

        const pathFiles = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        const foundFile = pathFiles.find(file => {
            return file.name === fileName && file.constructor.name === "ImageFile";
        });

        if (!foundFile) {
            CMD.error(cmd.window, "Cannot find file in this path");
            return;
        }

        Canvas.openApp(foundFile);
    },
}

const OS = {
    Streamline: {
        "V": {
            clear: GLOBAL_COMMANDS.clear,
            setuser: GLOBAL_COMMANDS.setuser,
            help: (tokenized, cmd) => {
                CMD.log(cmd.window, /*html*/`
                    <p>help - Shows basic commands you can use</p>
                    <p>clear - Clears console</p>
                    <p>colorize *bgcolor* *accentcolor* - Sets color scheme to desired colors (note: only hexadecimal values)</p>
                    <p>changepassword *password* - Changes current PC password ( note, if no password is set, the PC will have no password [automatically logs you in] )</p>
                    <p>setuser *name* - Changes current user name</p>
                    <p>downapp *app* - Downloads the specified app</p>
                    <p>connectwifi *name* *password* - Connects to given Wifi</p>
                    <p>dirlist - Directory list</p>
                    <p>cdir *path* - Changes directory to selected path</p>
                    <p>createfile *filename* *filetype* - Creates file in current directory</p>
                    <p>deletefile *filename* - Deletes file in current directory</p>
                    <p>editfile *filename* - Opens a new instance of Notepad with file edit</p>
                    <p>createdir *dirname* - Creates new directory (folder) in current directory</p>
                    <p>deletedir *dirname* - Deletes new directory (folder) in current directory</p>
                    <p>pingpc *computer ip* *packet size* *pings* - Pings computer with desired packet size</p>
                    <p>install *appname* - Installs command app</p>
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
            paint: GLOBAL_COMMANDS.paint,
        },
        "X": {

        },
        "XI": {

        },
        "Head": {

        }
    },
    NeoX: {
        "Ease": {

        },
        "Slim": {

        }
    },
    Cronos: {
        "1.0": {

        },
        "1.1": {

        },
        "2.0": {

        },
        "2.1": {

        },
        "2.2": {

        }
    }
}