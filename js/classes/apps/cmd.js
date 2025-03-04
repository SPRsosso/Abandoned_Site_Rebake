class CMD extends App {
    static isFree = true;
    constructor(window = null) {
        super();

        this.window = window;
        this.mode = "standby";

        this.selectedLine = 0;
        this.lines = [""];
    
        this.path = "";
    }

    static openApp(apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");

        if (apartment == Apartment.activeApartment) {
            appComponent.innerHTML = /*html*/`
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

                    #cmd * {
                        overflow-wrap: break-word;
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

                    #cmd .log,
                    #cmd .log * {
                        color: gray;
                    }

                    #cmd .can-copy,
                    #cmd .can-copy * {
                        user-select: text;
                    }
                </style>

                <span slot="name">Console</span>
                <div id="cmd">
                    
                </div>
            `;

            const mainScreen = appComponent.querySelector("#cmd");

            let editable = mainScreen.querySelector("[contentEditable]");
            mainScreen.addEventListener("click", ( e ) => {
                editable = mainScreen.querySelector("[contentEditable]");
                if (editable && !e.target.classList.contains("can-copy")) {
                    editable.blur();
                    editable.focus();
                }
            });

            mainScreen.addEventListener("keydown", ( event ) => {
                if (event.keyCode == 13) {
                    event.preventDefault();

                    const openedApp = apartment.pc.openedApps[apartment.pc.openedApps.findIndex(openedApp => openedApp.window == appComponent)];
                    editable = mainScreen.querySelector("[contentEditable]");
                    openedApp.executeCommand(editable.innerText);
                }

                if (event.keyCode == 38) {
                    event.preventDefault();

                    const openedApp = apartment.pc.openedApps[apartment.pc.openedApps.findIndex(openedApp => openedApp.window == appComponent)];
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

                    mainScreen.scrollTop = mainScreen.scrollHeight;
                }

                if (event.keyCode == 40) {
                    event.preventDefault();
                    
                    const openedApp = apartment.pc.openedApps[apartment.pc.openedApps.findIndex(openedApp => openedApp.window == appComponent)];
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

                    mainScreen.scrollTop = mainScreen.scrollHeight;
                }
            });

            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);
            const cmd = new CMD(appComponent);
            cmd.getStartLine();
            apartment.pc.openedApps.push(cmd);
        } else {
            apartment.pc.openedApps.push(new CMD());
        }
        
    }

    async executeCommand(command) {
        const mainScreen = this.window.querySelector("#cmd");
        
        this.lines.shift();
        this.lines.unshift(command);
        this.lines.unshift("");
        if (this.mode == "breakwifi")
            return;

        this.removeEditable();
        
        // Commands
        let tokenized = tokenize(command);
        let token;
        while (token = tokenized[0]) {
            let tokenVal = token.value;

            const apartmentOs = Apartment.activeApartment.pc.os;

            if (OS[apartmentOs.system][apartmentOs.version][tokenVal])
                await Apartment.activeApartment.pc.os.commands[apartmentOs.system][apartmentOs.version][tokenVal](tokenized, this);
            else
                CMD.error(this.window, "Unknown command: " + tokenVal);
            
            tokenized.shift();
        }

        this.mode = "standby";
        this.selectedLine = 0;
        this.getStartLine();

        mainScreen.scrollTop = mainScreen.scrollHeight;
    }

    removeEditable() {
        const contentEditable = this.window.querySelectorAll("[contentEditable]");
        contentEditable.forEach(element => {
            element.removeAttribute("contentEditable");
        });
    }

    getStartLine() {
        const mainScreen = this.window.querySelector("#cmd");
        mainScreen.innerHTML += `<p>${Apartment.activeApartment.pc.user.fullName}${this.path}:/<span contentEditable="true"></span></p>`;

        const editable = mainScreen.querySelector("[contentEditable]");
        if (document.activeElement === document.body) editable.focus();
    }

    static error(app, err) {
        const mainScreen = app.querySelector("#cmd");
        mainScreen.innerHTML += `<span class="alert">${err}</span>`

        mainScreen.scrollTop = mainScreen.scrollHeight;
    }

    static log(app, text) {
        const mainScreen = app.querySelector("#cmd");
        mainScreen.innerHTML += `<span class="log">${text}</span>`;

        mainScreen.scrollTop = mainScreen.scrollHeight;
    }

    static slog(app) {
        const mainScreen = app.querySelector("#cmd");

        const span = document.createElement("span");
        span.classList.add("log", "can-copy");

        function copy(e) {
            e.preventDefault();
            e.clipboardData.clearData("text/plain");
            e.clipboardData.setData('text/plain', span.innerText);
        }

        span.addEventListener('copy', copy);

        mainScreen.append(span);

        mainScreen.scrollTop = mainScreen.scrollHeight;
        return span;
    }

    static inlog(app, element, text) {
        const mainScreen = app.querySelector("#cmd");
        element.innerHTML += text;

        mainScreen.scrollTop = mainScreen.scrollHeight;
    }

    static getFlags(allowedFlags, tokenized) {
        const tokens = [...tokenized];
        const flagArray = [];
        tokens.forEach(token => {
            if (token.type == TokenType.Flag) {
                const allowedFlag = allowedFlags.find(allowedFlag => allowedFlag.value == token.value)
                if (allowedFlag)
                    flagArray.push(allowedFlag.output);
            }
        });

        return flagArray;
    }
}