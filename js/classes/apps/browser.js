class BrowserUser {
    constructor(nickname, password, name, surname, age, description = null, residence = null) {
        this.nickname = nickname;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.description = description;
        this.residence = residence;
    }
}

class Browser extends App {
    static users = [
        new BrowserUser("test123", "123", "Test", "123", 24, "Welcome to my Fit!", "Chive Apartment 301"),
        new BrowserUser("test456", "456", "Test", "456", 24, "Welcome to my Fit!", "Chive Apartment 301"),
    ];

    constructor(window) {
        super();

        this.window = window;
        this.historyPointer = 0;
        this.history = [""];
        this.activePort = 0;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <link rel="stylesheet" href="./styles/browser.css">
            <span slot="name">Browser</span>
            <div id="browser">
                <nav>
                    <button id="back" class="inactive"><</button>
                    <button id="forward" class="inactive">></button>
                    <input id="link" type="text" placeholder="Link...">
                </nav>
                <div class="main">

                </div>
            </div>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const browser = new Browser(appComponent);
        openedApps.push(browser);

        Browser.updateActivePorts();

        const linkEl = appComponent.querySelector("#link");
        let isLoading = false;
        linkEl.addEventListener("keydown", async ( e ) => {
            if (e.keyCode === 13 && !isLoading) {
                isLoading = true;
                
                const link = await browser.navigate(linkEl.value.trim());

                browser.historyPointer++;
                browser.history[browser.historyPointer] = link;
                browser.history.splice(browser.historyPointer + 1, browser.history.length);
                browser.changeInactiveButtons();

                linkEl.value = link;

                isLoading = false;
            }
        });

        const backBtn = appComponent.querySelector("#back");
        const forwardBtn = appComponent.querySelector("#forward");

        backBtn.addEventListener("click", async () => {
            if (backBtn.classList.contains("inactive")) return;
            if (isLoading) return;

            browser.historyPointer--;

            isLoading = true;

            const link = await browser.navigate(browser.history[browser.historyPointer]);
            browser.changeInactiveButtons();
            linkEl.value = link;

            isLoading = false;
        });

        forwardBtn.addEventListener("click", async () => {
            if (forwardBtn.classList.contains("inactive")) return;
            if (isLoading) return;

            browser.historyPointer++;

            isLoading = true;
                
            const link = await browser.navigate(browser.history[browser.historyPointer]);
            browser.changeInactiveButtons();
            linkEl.value = link;

            isLoading = false;
        });
    }

    changeInactiveButtons() {
        const previousLink = this.history[this.historyPointer - 1];
        const nextLink = this.history[this.historyPointer + 1];

        const backBtn = this.window.querySelector("#back");
        const forwardBtn = this.window.querySelector("#forward");

        if (previousLink || previousLink === "") backBtn.classList.remove("inactive");
        else backBtn.classList.add("inactive");

        if (nextLink || nextLink === "") forwardBtn.classList.remove("inactive");
        else forwardBtn.classList.add("inactive"); 
    }

    async navigate(link) {
        const mainWindow = this.window.querySelector(".main");

        mainWindow.innerHTML = "";

        const loading = document.createElement("div");
        loading.classList.add("loading");

        const site = document.createElement("site-component");

        const currentWifi = Apartment.activeApartment.router.connectedWifi
        let loadingTime_ms = 3000;
        if (!currentWifi) {
            mainWindow.append(loading);
            await wait(loadingTime_ms);
            loading.remove();

            site.innerHTML = Error404.site;
            mainWindow.append(site);

            this.activePort = null;

            Browser.updateActivePorts();
            
            return link;
        }

        let dns, port;
        Object.keys(websites).forEach(key => {
            const website = websites[key];

            if (website.ip === link || website.dns === link) {
                dns = website.dns;
                site.innerHTML = website.site;
                port = website.port;
            }
        });

        if (!dns && dns !== "") {
            mainWindow.append(loading);
            await wait(loadingTime_ms);
            loading.remove();

            site.innerHTML = Error404.site;
            mainWindow.append(site);

            this.activePort = null;

            Browser.updateActivePorts();

            return link;
        }

        loadingTime_ms -= 500;
        loadingTime_ms /= currentWifi.strength;
        mainWindow.append(loading);
        await wait(loadingTime_ms);
        loading.remove();

        const load = new Event("custom:load", { bubbles: false, cancelable: false });
        site.addEventListener("custom:load", (e) => {
            Perfit.checkIfUserIsLogged(e.target?.querySelector("#perfit"));
        })
        site.dispatchEvent(load);

        mainWindow.append(site);

        this.activePort = port;

        Browser.updateActivePorts();

        return dns;
    }

    static login(nickname, password) {
        const foundUser = Browser.users.find(user => {
            return user.nickname === nickname && user.password === password;
        });

        if (!foundUser) return false;
        
        Apartment.activeApartment.pc.browser.loggedAs = foundUser;
        return true;
    }

    static logout() {
        Apartment.activeApartment.pc.browser.loggedAs = null;
    }

    static register(nickname, password, name, surname, age) {
        const foundUser = Browser.users.find(user => user.nickname === nickname);

        if (foundUser) return false;
        if (password.length < 3 || nickname.length < 3) return false;
        if (name.length < 1 || surname.length < 1 || age.length < 1) return false;

        Browser.users.push(new BrowserUser(nickname, password, name, surname, parseInt(age)));
        return true;
    }

    static save(password, name, surname, age, residence, description) {
        const loggedUser = Apartment.activeApartment.pc.browser.loggedAs;
        const foundUser = Browser.users.find(user => user.nickname === loggedUser.nickname);

        if (!foundUser) return false;
        if (password.length < 3) return false;
        if (name.length < 1 || surname.length < 1 || age.length < 1) return false;
    
        loggedUser.password = password;
        loggedUser.name = name;
        loggedUser.surname = surname;
        loggedUser.age = age;
        loggedUser.residence = residence;
        loggedUser.description = description;

        return true;
    }

    static closeApp(app) {
        app.remove();

        let openedAppIndex = openedApps.findIndex(openedApp => openedApp.window == app);
        openedApps.splice(openedAppIndex, 1);
    
        Browser.updateActivePorts();
    }

    static updateActivePorts() {
        const activePorts = [];
        openedApps.forEach(openedApp => {
            if (openedApp.constructor.name !== "Browser") return;

            const foundPort = activePorts.find(activePort => activePort === openedApp.activePort)
            if (foundPort !== null && foundPort !== undefined) return;

            activePorts.push(openedApp.activePort);
        });

        Apartment.activeApartment.pc.browser.activePorts = activePorts;
    }
}