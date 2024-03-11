class App {
    static screen = document.querySelector("main-screen");
    constructor(window) {
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = `
            <span slot="name">Default app (not modded yet)</span>
        `;

        this.screen.prepend(appComponent);
        openedApps.push(new App(appComponent));
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
    }
    
    static closeApp(app) {
        app.remove();

        let openedAppIndex = openedApps.findIndex(openedApp => openedApp.window == app);
        openedApps.splice(openedAppIndex, 1);
    }

    static showName(appIcon, name) {
        const appInfo = document.createElement("app-info");
        appInfo.innerHTML = name;
        appInfo.style.bottom = `${barHeight}px`;
        appInfo.style.left = `${appIcon.offsetLeft - this.screen.offsetLeft + appIcon.offsetWidth / 2}px`;
        appInfo.style.transform = "translate(-50%)";

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

    static getAppIcons() {
        const mainBar = document.querySelector("main-bar");
        mainBar.innerHTML = "";
        Object.keys(downloadedApps).forEach(downloadedApp => {
            mainBar.innerHTML += `<app-icon icon-path="./icons/${downloadedApp}.png" app-name="${downloadedApp}"></app-icon>`;
        });
    }

    static downloadApp(app, appName) {
        if (!Apartment.activeApartment.router.connectedWifi) {
            CMD.error(app, "No Wifi connected!");
            return;
        }

        const appSize = 20000 / Apartment.activeApartment.router.connectedWifi.strength;
        return new Promise(async ( resolve, reject ) => {
            await App.wait(app, appSize);
            Apartment.activeApartment.pc.downloadedApps[appName] = apps[appName];
            App.getAppIcons();

            resolve();
        });
    }

    static wait(app, time) {
        app = app.querySelector("#cmd");
        return new Promise(( resolve, reject ) => {
            app.innerHTML += `
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
                    app.querySelector("#download").innerHTML += "|";
                    const percentage = Math.round((100 * (time / waitMaxLines) * waitLines) / time);
                    app.querySelector("#percentage").innerHTML = `${percentage}%`;
                    lineCounter = 0;
                }

                if (counter >= time) {
                    clearInterval(waitInterval);
                    app.querySelector("#download").remove();
                    app.querySelector("#percentage").remove();

                    resolve();
                }

                counter += intervalTime;
                lineCounter += intervalTime;

                
            }, intervalTime);
        });
    }

    static closeAllApps() {
        while (openedApps[0]) {
            openedApps[0].window.remove();
            openedApps.shift();
        }
    }
}