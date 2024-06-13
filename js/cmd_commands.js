function isFlag(flag) {
    return flag.type == TokenType.Flag;
}

const GLOBAL_COMMANDS = {
    clear: (tokenized, mainScreen) => {
        mainScreen.innerHTML = "";
    },
    setuser: (tokenized, mainScreen) => {
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
    breakwifi: async (tokenized, mainScreen, cmd) => {
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
    connectwifi: (tokenized, mainScreen, cmd) => {
        const wifiArr = [];
        while (tokenized.shift()) {
            if (tokenized.length > 0)
                wifiArr.push(tokenized[0].value);
        }
        Wifi.connectToWifi(cmd.window, wifiArr[0], wifiArr[1]);
    },
    dirlist: (tokenized, mainScreen, cmd) => {
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
    cdir: (tokenized, mainScreen, cmd) => {
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
    createfile: (tokenized, mainScreen, cmd) => {
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
        
        const fileType = FileTypes[typedFileType.toLowerCase()];

        if (fileType) {
            Apartment.activeApartment.pc.get(cmd.path.replace("/", "")).push(new ComputerFile(fileName, fileType));
        } else {
            CMD.error(cmd.window, "Unknown file type: " + typedFileType);
        }
    },
    deletefile: (tokenized, mainScreen, cmd) => {
        tokenized.shift();

        let fileName = tokenized.shift().value;

        if (cmd.path === ""){
            CMD.error(cmd.window, "Cannot delete file in this path");
            return;
        }

        let files = Apartment.activeApartment.pc.get(cmd.path.replace("/", ""));
        let index = files.findIndex(file => {
            return file.name === fileName && Object.getPrototypeOf(file).constructor.name === "ComputerFile";
        });
        if (index !== -1)
            files.splice(index, 1);
        else 
            CMD.error(cmd.window, "File " + fileName + " not found");
    },
    createdir: (tokenized, mainScreen, cmd) => {
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

        Apartment.activeApartment.pc.get(cmd.path.replace("/", "")).push(new Folder(dirName));
    },
    deletedir: (tokenized, mainScreen, cmd) => {
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
    pingpc: async (tokenized, mainScreen, cmd) => {
        tokenized.shift();

        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        const pingTo = tokenized.shift().value;
        const packetSize = tokenized.shift().value;

        const pingedPc = PC.getByIP(pingTo);

        if (!pingedPc) {
            CMD.error(cmd.window, "Cannot find PC");
            return;
        }

        const pingedApartment = Apartment.getByPC(pingedPc);
        const wifi = pingedApartment.router.connectedWifi;
        const currentWifi = Apartment.activeApartment.router.connectedWifi
        if (wifi.ip !== currentWifi.ip || !currentWifi || !wifi) {
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

        for (let i = 0; i < 10; i++) {
            packetTime_ms *= randomInt(1, 5) / 10 + 0.75;
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
    }
}

const OS = {
    Streamline: {
        "V": {
            clear: GLOBAL_COMMANDS.clear,
            setuser: GLOBAL_COMMANDS.setuser,
            help: (tokenized, mainScreen) => {
                mainScreen.innerHTML += /*html*/`
                    <p>help - Shows basic commands you can use</p>
                    <p>clear - Clears console</p>
                    <p>setuser *name* - Changes current user name</p>
                    <p>downapp *app* - Downloads the specified app</p>
                    <p>connectwifi *name* *password* - Connects to given Wifi</p>
                    <p>dirlist - directory list</p>
                    <p>cdir *path* - changes directory to selected path</p>
                    <p>createfile *filename* - creates file in current directory</p>
                    <p>deletefile *filename* - deletes file in current directory</p>
                    <p>pingpc *computer ip* *packet size* - pings computer with desired packet size</p>
                `;
            },
            downapp: async (tokenized, mainScreen, cmd) => {
                let string = "";
                while (tokenized.length > 0) {
                    tokenized.shift();

                    if (tokenized.length > 0)
                        string += tokenized[0].value;

                    if (tokenized[1])
                        string += " ";
                }
                Object.keys(apps).forEach(( key ) => {
                    if (string == key || string.toLowerCase() == key.toLowerCase() || string.toUpperCase() == key.toUpperCase()) {
                        string = key;
                        return;
                    }
                });
                if (apps[string])
                    await App.downloadApp(cmd.window, string);
                else
                    CMD.error(cmd.window, "App does not exist: " + string);
            },
            breakwifi: async (tokenized, mainScreen, cmd) => {
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
            connectwifi: GLOBAL_COMMANDS.connectwifi,
            dirlist: GLOBAL_COMMANDS.dirlist,
            cdir: GLOBAL_COMMANDS.cdir,
            createfile: GLOBAL_COMMANDS.createfile,
            deletefile: GLOBAL_COMMANDS.deletefile,
            createdir: GLOBAL_COMMANDS.createdir,
            deletedir: GLOBAL_COMMANDS.deletedir,
            pingpc: GLOBAL_COMMANDS.pingpc
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