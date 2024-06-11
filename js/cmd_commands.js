function isFlag(flag) {
    return flag.type == TokenType.Flag;
}

const GLOBAL_COMMANDS = {
    clear: (tokenized, mainScreen) => {
        mainScreen.innerHTML = "";
    },
    setuser: (tokenized, mainScreen) => {
        const user = Apartment.activeApartment.pc.user;

        var string = "";
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
        var string = "";
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
        if (cmd.pathIndex != -1) {
            const filesDir = Apartment.activeApartment.pc.get(cmd.pathIndex).files;
            for (let i = 0; i < filesDir.length; i++) {
                CMD.log(cmd.window, filesDir[i].name + " ");
            }
        }
        if (Apartment.activeApartment.pc.get(cmd.pathIndex + 1))
            CMD.log(cmd.window, Apartment.activeApartment.pc.get(cmd.pathIndex + 1).name);
    },
    cdir: (tokenized, mainScreen, cmd) => {
        tokenized.shift();
        while(tokenized.length > 0) {
            const folder = Apartment.activeApartment.pc.get(cmd.pathIndex + 1);

            if (tokenized[0].value == ".." && cmd.pathIndex > -1)
                cmd.pathIndex--;

            if (cmd.pathIndex == -1)
                cmd.path = "";

            if (folder)
                if (folder.name == tokenized[0].value)
                    cmd.pathIndex++;
                
            cmd.path = "";
            for (let i = 0; i <= cmd.pathIndex; i++)
                cmd.path += "/" + Apartment.activeApartment.pc.get(i).name;

            tokenized.shift();
        }
    },
    createfile: (tokenized, mainScreen, cmd) => {
        tokenized.shift();
        if (tokenized.length < 2) {
            CMD.error(cmd.window, "Needs at least 2 arguments!");
            return;
        }

        var fileName = tokenized[0].value;
        const fileType = FileTypes[tokenized[1].value.toLowerCase()];

        if (cmd.pathIndex != -1) {
            if (fileType) {
                Apartment.activeApartment.pc.get(cmd.pathIndex).files.push({ name: fileName, type: fileType });
            } else {
                CMD.error(cmd.window, "Unknown file type: " + tokenized[1].value);
            }
        } else {
            CMD.error(cmd.window, "Cannot create file in this path");
        }

        tokenized.splice(0, 2);
    },
    deletefile: (tokenized, mainScreen, cmd) => {
        tokenized.shift();
        var fileName = tokenized[0].value;

        if (this.pathIndex != -1) {
            var filesArr = Apartment.activeApartment.pc.get(cmd.pathIndex).files;
            var index = filesArr.findIndex(file => file.name == fileName);
            if (index != -1)
                filesArr.splice(index, 1);
            else 
                CMD.error(cmd.window, "File " + fileName + " not found");
        } else {
            CMD.error(cmd.window, "Cannot delete file in this path");
        }
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

        let packetTime_ms = 1000;
        packetTime_ms *= Math.floor(Math.sqrt(packetSize));
        packetTime_ms /= ( wifi.strength +  currentWifi.strength ) / 2;

        for (let i = 0; i < 10; i++) {
            packetTime_ms *= randomInt(0, 10) / 10 + 0.5;
            packetTime_ms = Math.floor(packetTime_ms * 10) / 10;
            await wait(packetTime_ms);
            if (packetTime_ms > 8000)
                CMD.log(cmd.window, "Timed out");
            else
                CMD.log(cmd.window, "Time: " + packetTime_ms + "ms");
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
                var string = "";
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
                var string = "";
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