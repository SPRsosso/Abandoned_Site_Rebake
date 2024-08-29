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

    constructor(window = null) {
        super();

        this.window = window;
        this.historyPointer = 0;
        this.history = [""];
        this.activePort = 0;
    }

    static openApp(apartment = Apartment.activeApartment) {
        let browser;

        const appComponent = document.createElement("app-component");
        if (apartment == Apartment.activeApartment) {
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
                        ${BlankPage.site}
                    </div>
                </div>
            `;
    
            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);

            browser = new Browser(appComponent);

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
        } else {
            browser = new Browser();
        }

        apartment.pc.openedApps.push(browser);
        Browser.updateActivePorts(apartment);
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

    async navigate(link, apartment = Apartment.activeApartment) {
        let mainWindow
        if (apartment == Apartment.activeApartment) {
            mainWindow = this.window.querySelector(".main");
        }

        if (mainWindow) mainWindow.innerHTML = "";

        const loading = document.createElement("div");
        loading.classList.add("loading");

        const site = document.createElement("site-component");

        const currentWifi = apartment.router.connectedWifi
        let loadingTime_ms = 3000 * trojanMultiplier;
        if (!currentWifi) {
            if (mainWindow) mainWindow.append(loading);
            await wait(loadingTime_ms);
            if (mainWindow) loading.remove();

            if (mainWindow) site.innerHTML = Error404.site;
            if (mainWindow) mainWindow.append(site);

            this.activePort = null;

            Browser.updateActivePorts(apartment);
            
            return link;
        }

        if (link.trim() === "") {
            if (mainWindow) mainWindow.append(loading);
            await wait(loadingTime_ms);
            if (mainWindow) loading.remove();

            if (mainWindow) site.innerHTML = BlankPage.site;
            if (mainWindow) mainWindow.append(site);

            this.activePort = BlankPage.port;

            Browser.updateActivePorts(apartment);
            return link;
        }

        let dns, port;
        Object.keys(websites).forEach(key => {
            const website = websites[key];

            if (website.ip !== link && website.dns !== link || link === "") return;

            let canAccess = true;
            if (website.info.state === "private") {
                switch(website.info.access) {
                    case "wificompany":
                        canAccess = currentWifi.company.name === website.info.company
                        break;
                    default:
                        canAccess = false;
                        break;
                }
            }

            if (canAccess) {
                dns = website.dns;
                site.innerHTML = website.site;
                port = website.port;
            }
        });

        if (!dns && dns !== "") {
            if (mainWindow) mainWindow.append(loading);
            await wait(loadingTime_ms);
            if (mainWindow) loading.remove();

            if (mainWindow) site.innerHTML = Error404.site;
            if (mainWindow) mainWindow.append(site);

            this.activePort = null;

            Browser.updateActivePorts(apartment);

            return link;
        }

        loadingTime_ms -= 500;
        loadingTime_ms /= currentWifi.strength;
        if (mainWindow) mainWindow.append(loading);
        await wait(loadingTime_ms);
        if (mainWindow) loading.remove();

        const load = new Event("custom:load", { bubbles: false, cancelable: false });
        site.addEventListener("custom:load", (e) => {
            Perfit.checkIfUserIsLogged(e.target?.querySelector("#perfit"));
        })
        if (mainWindow) site.dispatchEvent(load);

        if (mainWindow) mainWindow.append(site);

        this.activePort = port;

        Browser.updateActivePorts(apartment);

        return dns;
    }

    static login(nickname, password, apartment = Apartment.activeApartment) {
        const foundUser = Browser.users.find(user => {
            return user.nickname === nickname && user.password === password;
        });

        if (!foundUser) return false;
        
        apartment.pc.browser.loggedAs = foundUser;
        return true;
    }

    static logout(apartment = Apartment.activeApartment) {
        apartment.pc.browser.loggedAs = null;
    }

    static register(nickname, password, name, surname, age) {
        const foundUser = Browser.users.find(user => user.nickname === nickname);

        if (foundUser) return false;
        if (password.length < 3 || nickname.length < 3) return false;
        if (name.length < 1 || surname.length < 1 || age.length < 1) return false;

        Browser.users.push(new BrowserUser(nickname, password, name, surname, parseInt(age)));
        return true;
    }

    static save(password, name, surname, age, residence, description, apartment = Apartment.activeApartment) {
        const loggedUser = apartment.pc.browser.loggedAs;
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

    static closeApp(app, apartment = Apartment.activeApartment) {
        if (app) app.remove();

        let openedAppIndex = apartment.pc.openedApps.findIndex(openedApp => openedApp.window == app);
        apartment.pc.openedApps.splice(openedAppIndex, 1);
    
        Browser.updateActivePorts(apartment);
    }

    static updateActivePorts(apartment = Apartment.activeApartment) {
        const activePorts = [];
        apartment.pc.openedApps.forEach(openedApp => {
            if (openedApp.constructor.name !== "Browser") return;

            const foundPort = activePorts.find(activePort => activePort === openedApp.activePort);
            if (foundPort) return;

            activePorts.push(openedApp.activePort);
        });

        apartment.pc.browser.activePorts = activePorts;

        wifis.forEach(wifi => {
            const wifiActivePorts = [];
            apartments.forEach(tApartment => {
                if (tApartment.router.connectedWifi.ip !== wifi.ip) return;
                
                tApartment.pc.openedApps.forEach(openedApp => {
                    if (openedApp.constructor.name !== "Browser") return;
        
                    const foundPort = wifiActivePorts.find(portInfo => portInfo.port === openedApp.activePort);
                    
                    if (foundPort) {
                        const foundPC = foundPort.pcIPs.find(pcInfo => pcInfo === tApartment.pc.ip);
                        
                        if (!foundPC) foundPort.pcIPs.push({ 
                            pcIP: tApartment.pc.ip,
                            packets: null,
                            packetIndex: 0
                        });
                        return;
                    }
                    
                    wifiActivePorts.push({ port: openedApp.activePort, pcIPs: [{
                        ip: tApartment.pc.ip,
                        packets: null,
                        packetIndex: 0
                    }]});
                });
            })
            
            wifi.activePorts = wifiActivePorts;
    
            wifi.activePorts.forEach(activePort => {
                activePort.pcIPs.forEach(pc => {
                    if (pc.packets) pc.packets = pc.packets;
                    else {
                        let packets = "";
                        Object.keys(websites).forEach(website => {
                            if (websites[website].port !== activePort.port) return;
    
                            const parsedSite = websites[website].site.replace(/[^A-Za-z0-9]+/g, " ");
                                
                            packets = `site ${parsedSite} wifipassword ${wifi.password} wifiname ${wifi.name}`;
                        });
                        pc.packets = packets;
                    }
    
                    pc.packetIndex = pc.packetIndex;
                });
            });
        });
    }
}