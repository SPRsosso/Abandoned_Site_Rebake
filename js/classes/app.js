class App {
    static screen = document.querySelector("main-screen");
    static lastAppClassName;
    constructor(window = null) {
        this.window = window;
        App.lastAppClassName = this.constructor.name;
    }

    static openApp(apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");
        if (apartment == Apartment.activeApartment) {
            appComponent.innerHTML = `
                <span slot="name">Default app (not modded yet)</span>
            `;
    
            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);

            apartment.pc.openedApps.push(new App(appComponent));
        } else {
            apartment.pc.openedApps.push(new App());
        }
    }

    static defaultValues(app) {
        const apps = document.querySelectorAll("app-component");

        let maxZIndex = "1";
        if (apps[0])
            maxZIndex = parseInt(apps[0].style.zIndex);
        apps.forEach(appArr => {
            maxZIndex = maxZIndex < parseInt(appArr.style.zIndex) ? appArr.style.zIndex : maxZIndex;
        });

        app.style.zIndex = parseInt(maxZIndex) + 1;
        setTimeout(() => {
            app.setAttribute("name", App.lastAppClassName);
        }, 0);
    }
    
    static closeApp(app, apartment = Apartment.activeApartment) {
        if (app) app.remove();

        let openedAppIndex = apartment.pc.openedApps.findIndex(openedApp => openedApp.window == app);
        apartment.pc.openedApps.splice(openedAppIndex, 1);
    }

    static showName(appIcon, name) {
        const appInfo = document.createElement("app-info");
        appInfo.innerHTML = name;
        appInfo.style.bottom = `${barHeight}px`;
        appInfo.style.left = `${appIcon.offsetLeft - this.screen.offsetLeft + appIcon.offsetWidth / 2}px`;
        appInfo.style.transform = "translate(-50%)";
        appInfo.style.zIndex = "9999";

        appIcon.addEventListener("mouseout", () => {
            appInfo.remove();
        });

        this.screen.append(appInfo);
    }

    static moveApp(app, offset, x, y, event) {
        const screenLeft = this.screen.offsetLeft;
        const screenTop = this.screen.offsetTop;
        const screenRight = this.screen.getBoundingClientRect().right - screenLeft;
        const screenBottom = this.screen.getBoundingClientRect().bottom - screenTop;
        x = (x - screenLeft) + offset.x;
        y = (y - screenTop) + offset.y;
        
        if (x + app.clientWidth <= screenRight &&
            x >= 0 &&
            y + app.clientHeight <= screenBottom - barHeight &&
            y >= 0) {
            app.style.left = `${x}px`;
            app.style.top = `${y}px`;
        } else {
            offset.x = app.offsetLeft - event.clientX;
            offset.y = app.offsetTop - event.clientY;
        }
    }

    static moveAppOnTop(app) {
        const apps = document.querySelectorAll("app-component");

        let maxZIndex = parseInt(apps[0].style.zIndex);
        apps.forEach(appArr => {
            maxZIndex = maxZIndex < parseInt(appArr.style.zIndex) ? appArr.style.zIndex : maxZIndex;
        });

        app.style.zIndex = parseInt(maxZIndex) + 1;
    }

    static getAppIcons(apartment = Apartment.activeApartment) {
        const mainBar = document.querySelector("main-bar");
        mainBar.innerHTML = "";
        let keys = apartment.pc.downloadedApps;
        Object.keys(keys).forEach(downloadedApp => {
            mainBar.innerHTML += `<app-icon icon-path="./icons/${downloadedApp}.png" app-name="${downloadedApp}"></app-icon>`;
        });
    }

    static downloadApp(cmd, appName, system, apartment = Apartment.activeApartment) {
        const app = cmd.window;
        if (!apartment.router.connectedWifi) {
            if (app) CMD.error(app, "No Wifi connected!");
            return;
        }

        if (Object.keys(apartment.pc.downloadedApps).find(app => app === appName)) {
            CMD.error(app, "App already downloaded!");
            return;
        }

        if (!system.apps[appName].isFree) {
            if (!player.boughtApps[appName]) {
                CMD.error(app, "App is not bought!");
                return;
            }
        }

        const appSize = 30000 / apartment.router.connectedWifi.strength;
        return new Promise(async ( resolve, reject ) => {
            await App.wait(app, appSize * trojanMultiplier);

            if (!apartment.pc.openedApps.find(app => app == cmd)) {
                resolve();
                return;
            }

            apartment.pc.downloadedApps[appName] = system.apps[appName];
            App.getAppIcons();

            resolve();
        });
    }

    static wait(app, time) {
        if (app) app = app.querySelector("#cmd");
        return new Promise(( resolve, reject ) => {
            if (app) app.innerHTML += `
                <p id="download"></p>
                <p id="percentage">0%</p>
            `;

            const waitMaxLines = 30;
            const intervalTime = 50;
            let counter = 0;
            let lineCounter = 0;
            let waitLines = 0;

            const waitInterval = setInterval(() => {
                if (lineCounter >= time / waitMaxLines) {
                    waitLines++;
                    if (app) app.querySelector("#download").innerHTML += "|";
                    const percentage = Math.round((100 * (time / waitMaxLines) * waitLines) / time);
                    if (app) app.querySelector("#percentage").innerHTML = `${percentage}%`;
                    lineCounter = 0;
                }

                if (counter >= time) {
                    clearInterval(waitInterval);
                    if (app) app.querySelector("#download").remove();
                    if (app) app.querySelector("#percentage").remove();

                    resolve();
                }

                counter += intervalTime;
                lineCounter += intervalTime;

                app.scrollTop = app.scrollHeight;
            }, intervalTime);
        });
    }

    static closeAllApps(apartment = Apartment.activeApartment) {
        while (apartment.pc.openedApps[0]) {
            apartment.pc.openedApps[0].window.remove();
            apartment.pc.openedApps.shift();
        }
    }
}