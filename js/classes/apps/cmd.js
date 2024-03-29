class CMD extends App {
    constructor(window) {
        super();

        this.window = window;
        this.mode = "standby";

        this.selectedLine = 0;
        this.lines = [""];
    
        this.pathIndex = -1;
        this.path = "";
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        const shadow = appComponent.shadowRoot;
        const mainOptions = shadow.querySelector("main-options");

        appComponent.innerHTML = `
            <style>
                ${styles}

                #cmd {
                    width: 100%;
                    height: 100%;

                    overflow-y: auto;

                    cursor: text;

                    padding: 10px;

                    display: flex;
                    flex-direction: column;
                }

                #cmd span {
                    width: 100%;
                }

                #cmd [contentEditable] {
                    outline: none;
                }

                #cmd .alert {
                    color: red;
                }

                #cmd .log {
                    color: gray;
                }
            </style>

            <span slot="name">Console</span>
            <div id="cmd">
                <p>${Apartment.activeApartment.pc.user}:/<span contentEditable="true"></span></p>
            </div>
        `;

        const mainScreen = appComponent.querySelector("#cmd");

        let editable = mainScreen.querySelector("[contentEditable]");
        mainScreen.addEventListener("click", () => {
            editable = mainScreen.querySelector("[contentEditable]");
            if (editable) {
                editable.blur();
                editable.focus();
            }
        });

        mainScreen.addEventListener("keydown", ( event ) => {
            if (event.keyCode == 13) {
                event.preventDefault();

                const openedApp = openedApps[openedApps.findIndex(openedApp => openedApp.window == appComponent)];
                editable = mainScreen.querySelector("[contentEditable]");
                openedApp.executeCommand(editable.innerText);
            }

            if (event.keyCode == 38) {
                event.preventDefault();

                const openedApp = openedApps[openedApps.findIndex(openedApp => openedApp.window == appComponent)];
                if (openedApp.selectedLine >= openedApp.lines.length - 1)
                    return;

                openedApp.selectedLine++;
                editable = mainScreen.querySelector("[contentEditable]");
                editable.innerText = openedApp.lines[openedApp.selectedLine];

                const range = document.createRange();
                range.selectNodeContents(editable);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }

            if (event.keyCode == 40) {
                event.preventDefault();
                
                const openedApp = openedApps[openedApps.findIndex(openedApp => openedApp.window == appComponent)];
                if (openedApp.selectedLine <= 0)
                    return;

                openedApp.selectedLine--;
                editable = mainScreen.querySelector("[contentEditable]");
                editable.innerText = openedApp.lines[openedApp.selectedLine];

                const range = document.createRange();
                range.selectNodeContents(editable);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        openedApps.push(new CMD(appComponent));
    }

    async executeCommand(command) {
        const mainScreen = this.window.querySelector("#cmd");
        
        this.lines.shift();
        this.lines.unshift(command);
        this.lines.unshift("");
        if (this.mode == "breakwifi")
            return;

        const shadow = this.window.shadowRoot;
        this.removeEditable();
        
        // Commands
        let tokenized = tokenize(command);
        let token;
        while (token = tokenized[0]) {
            let tokenVal = token.value;

            switch(tokenVal) {
                case "clear":
                    mainScreen.innerHTML = "";
                    break;
                case "setuser":
                    var string = "";
                    while (tokenized.length > 0) {
                        tokenized.shift();

                        if (tokenized.length > 0)
                            string += tokenized[0].value;

                        if (tokenized[1])
                            string += " ";
                    }

                    Apartment.activeApartment.pc.user = string;
                    break;
                case "help":
                    mainScreen.innerHTML += `
                        <p>help - Shows basic commands you can use</p>
                        <p>clear - Clears console</p>
                        <p>setuser *name* - Changes current user name</p>
                        <p>downapp *app* - Downloads the specified app</p>
                        <p>ccodetab - Shows char code table</p>
                        <p>connectwifi *name* *password* - Connects to given Wifi</p>
                        <p>dirl - directory list</p>
                    `;
                    break;
                case "downapp":
                    var string = "";
                    while (tokenized.length > 0) {
                        tokenized.shift();

                        if (tokenized.length > 0)
                            string += tokenized[0].value;

                        if (tokenized[1])
                            string += " ";
                    }
                    Object.keys(apps).forEach(( key ) => {
                        if (string == key || string == key.toLowerCase() || string == key.toUpperCase()) {
                            string = key;
                            return;
                        }
                    });
                    if (apps[string])
                        await App.downloadApp(this.window, string);
                    else
                        CMD.error(this.window, "App does not exist: " + string);
                    break;
                case "breakwifi":
                    var string = "";
                    while (tokenized.length > 0) {
                        tokenized.shift();

                        if (tokenized.length > 0)
                            string += tokenized[0].value;

                        if (tokenized[1])
                            string += " ";
                    }
                    if (wifis.find(wifi => wifi.name == string)) {
                        this.mode = "breakwifi";
                        await Wifi.breakWifi(this.window, string);
                    } else {
                        CMD.error(this.window, "Cannot find Wifi: " + string);
                    }
                    break;
                case "ccodetab":
                    for (let i = 0; i < Wifi.possibleChars.length; i++) {
                        mainScreen.innerHTML += `${i}.${Wifi.possibleChars[i]} `;
                        if (i % 9 == 0 && i != 0)
                            mainScreen.innerHTML += "<br>";
                    }
                    break;
                case "connectwifi":
                    const wifiArr = [];
                    while (tokenized.shift()) {
                        if (tokenized.length > 0)
                            wifiArr.push(tokenized[0].value);
                    }
                    Wifi.connectToWifi(this.window, wifiArr[0], wifiArr[1]);
                    break;
                case "dirl":
                    if (this.pathIndex != -1) {
                        const filesDir = Apartment.activeApartment.pc.get(this.pathIndex).files;
                        for (let i = 0; i < filesDir.length; i++) {
                            CMD.log(this.window, filesDir[i].name + " ");
                        }
                    }
                    CMD.log(this.window, Apartment.activeApartment.pc.get(this.pathIndex + 1).name);
                    break;
                default:
                    CMD.error(this.window, "Unknown command: " + tokenized[0].value);
                    break;
            }
            
            tokenized.shift();
        }
        
        this.mode = "standby";
        this.selectedLine = 0;
        this.getStartLine();
    }

    removeEditable() {
        const contentEditable = this.window.querySelectorAll("[contentEditable]");
        contentEditable.forEach(element => {
            element.removeAttribute("contentEditable");
        });
    }

    getStartLine() {
        const mainScreen = this.window.querySelector("#cmd");
        mainScreen.innerHTML += `<p>${Apartment.activeApartment.pc.user}${this.path}:/<span contentEditable="true"></span></p>`;

        const editable = mainScreen.querySelector("[contentEditable]");
        this.window.focus();
        editable.focus();
    }

    static error(app, err) {
        const mainScreen = app.querySelector("#cmd");
        mainScreen.innerHTML += `<span class="alert">${err}</span>`
    }

    static log(app, text) {
        const mainScreen = app.querySelector("#cmd");
        mainScreen.innerHTML += `<span class="log">${text}</span>`;
    }
}