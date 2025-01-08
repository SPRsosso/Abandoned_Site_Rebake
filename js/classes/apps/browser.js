class Browser extends App {
    static isFree = true;

    constructor(window = null) {
        super();

        this.window = window;
        this.historyPointer = 0;
        this.history = [""];
        this.port = null;

        this.loading = false;

        this.observer;
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
            browser.observer = new MutationObserver(browserObserver);
            browser.observer.observe(browser.window, { subtree: true, childList: true, attributes: false });

            const linkEl = appComponent.querySelector("#link");
            linkEl.addEventListener("keydown", async ( e ) => {
                if (e.keyCode === 13 && !browser.loading) {
                    browser.browse(linkEl.value.trim(), apartment);
                }
            });
    
            const backBtn = appComponent.querySelector("#back");
            const forwardBtn = appComponent.querySelector("#forward");
    
            backBtn.addEventListener("click", async () => {
                if (backBtn.classList.contains("inactive") && browser.loading) return;
    
                browser.historyPointer--;
    
                browser.navigate(browser.history[browser.historyPointer]);
            });
    
            forwardBtn.addEventListener("click", async () => {
                if (forwardBtn.classList.contains("inactive") && browser.loading) return;
    
                browser.historyPointer++;
                    
                browser.navigate(browser.history[browser.historyPointer]);
            });
        } else {
            browser = new Browser();
        }

        apartment.pc.openedApps.push(browser);
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

    async browse(link, apartment) {
        await this.navigate(link, apartment);
    
        this.historyPointer++;
        this.history[this.historyPointer] = link;
        this.history.splice(this.historyPointer + 1, this.history.length);
    }

    async navigate(link, apartment = Apartment.activeApartment) {
        if (this.loading) return;

        let mainWindow;
        if (apartment == Apartment.activeApartment) {
            this.window.querySelector("#link").value = link;
            mainWindow = this.window.querySelector(".main");
        }

        if (mainWindow) mainWindow.innerHTML = "";

        const loading = document.createElement("div");
        loading.classList.add("loading");

        let site = document.createElement("site-component");

        if (link.trim() === "") {
            site.innerHTML = BlankPage.site;
            if (mainWindow) mainWindow.append(site);
            
            return;
        }
        
        if (mainWindow) mainWindow.append(loading);
        const factorizedLink = Web.factorLink(link);
        const toLink = factorizedLink.link;
        const path = factorizedLink.path;

        this.loading = true;

        if (this.port) {
            await Web.closeConnection(this.port);
        }

        const response = await Web.sendConnectionRequest(toLink, apartment);

        switch (response.status) {
            case Web.Status.OK:
                this.port = response.port;
                
                let error = false;
                await Web.GET(response.port, path, this, ( packet ) => {
                    if (packet.status === Web.Status.Error) {
                        error = true;
                        return;
                    }

                    if (packet.status === Web.Status.End) {
                        site = packet.body;
                        return;
                    }
                }, apartment);

                if (error) {
                    site.innerHTML = Error404.site;
                    if (mainWindow) mainWindow.append(site);

                    this.port = null;
                } else {
                    if (mainWindow) mainWindow.append(site);
                }
                
                break;
            case Web.Status.Error:
                this.port = null;

                break;
        }

        if (!this.port) {
            site.innerHTML = Error404.site;
            if (mainWindow) mainWindow.append(site);
        }

        loading.remove();
        this.changeInactiveButtons();
        this.loading = false;

        return link;
    }

    static closeApp(app, apartment = Apartment.activeApartment) {
        if (app) app.remove();

        let openedAppIndex = apartment.pc.openedApps.findIndex(openedApp => openedApp.window == app);
        const browser = apartment.pc.openedApps.splice(openedAppIndex, 1)[0];
        browser.observer.disconnect();
        Web.closeConnection(browser.port);
    }
}