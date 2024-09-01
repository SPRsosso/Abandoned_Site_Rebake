class HomeDefence extends App {
    static isFree = false;
    static price = 14.99;
    constructor(window = null) {
        super();

        this.window = window;
        this.selectedRouter = Apartment.activeApartment.router;
    }

    static async openApp(apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");

        if (apartment == Apartment.activeApartment) {
            let rous = ``;
            let stys = ``;
            routers.forEach(router => {
                stys += `#${ router.name } { 
                    grid-column: ${ router.pos.x } / span ${ router.spanX }; 
                    grid-row:  ${ router.pos.y } / span ${ router.spanY };
                }`
                rous += `<div id="${ router.name }" class="router">${ router.name.toUpperCase() }</div>`;
            });
    
            appComponent.innerHTML = `
                <style>
                    ${styles}
    
                    #homedefence {
                        width: 100%;
                        height: 100%;
    
                        position: relative;
    
                        padding: 50px;
                    }
    
                    #homedefence button {
                        position: absolute;
                        bottom: 10px;
                        right: 10px;
                    }
    
                    #homedefence .router {
                        --width: 65px;
                        --height: 65px;
                        border: 1px solid var(--accent-color);
    
                        display: flex;
                        align-items: center;
                        justify-content: center;
    
                        cursor: pointer;
                    }
    
                    #homedefence .router:hover {
                        background-color: var(--accent-color-faded);
                    }
    
                    #router-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: repeat(4, 1fr);
                        gap: 20px;
    
                        width: 100%;
                        height: 100%;
                    }
    
                    ${stys}
    
                    #homedefence .active {
                        background-color: var(--accent-color-faded);
                    }
                </style>
    
                <span slot="name">Home Defence</span>
                <div id="homedefence">
                    <div id="router-grid">
                        ${rous}
                    </div>
                    <button>Connect</button>
                </div>
            `;
    
            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);
            const homedefence = new HomeDefence(appComponent);
            apartment.pc.openedApps.push(homedefence);
            
    
            const mainScreen = appComponent.querySelector("#homedefence");
            HomeDefence.refreshRouters(appComponent);
    
            const routersEl = mainScreen.querySelectorAll(".router");
            routersEl.forEach(router => {
                router.addEventListener("click", () => {
                    homedefence.selectedRouter = routers.find(router1 => router1.name == router.id);
                    HomeDefence.refreshRouters(appComponent);
                });
            });
    
            const button = mainScreen.querySelector("button");
            button.addEventListener("click", async () => {
                if (homedefence.selectedRouter.name == Apartment.activeApartment.router.name)
                    return;
    
                await HomeDefence.wait(appComponent, 5000);
                Apartment.activeApartment.router = routers.find(router => router.name == homedefence.selectedRouter.name);
                HomeDefence.refreshRouters(appComponent);
                Apartment.activeApartment.wifis.forEach(wifi => {
                    wifi.changeStrength(Apartment.activeApartment.router.strength);
                })
            });
        } else {
            apartment.pc.openedApps.push(new HomeDefence());
        }
        
    }

    static wait(app, time) {
        return new Promise(( resolve, reject ) => {
            const div = document.createElement("div");
            const coverDiv = document.createElement("div");
            coverDiv.style.width = "100%";
            coverDiv.style.height = "100%";
            coverDiv.style.background = "none";
            coverDiv.style.position = "absolute";
            coverDiv.style.top = "0";
            coverDiv.style.left = "0";
            coverDiv.style.cursor = "progress";

            div.style.width = "100%";
            div.style.height = "100%";
            div.style.backgroundColor = "var(--accent-color)";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = "0";
            div.style.transform = "scaleX(0)";
            div.style.transformOrigin = "left";
            div.style.cursor = "progress";

            const mainScreen = app.querySelector("#homedefence");
            mainScreen.append(coverDiv);
            mainScreen.append(div);

            const intervalTime = 50;
            let counter = 0;
            const waitInterval = setInterval(() => {
                if (counter >= time) {
                    div.remove();
                    coverDiv.remove();
                    clearInterval(waitInterval);

                    resolve();
                    return;
                }

                const percentage = 100 * counter  / time;
                div.style.transform =  `scaleX(${percentage}%)`

                counter += intervalTime;
            }, intervalTime);
        });
    }

    static refreshRouters(app, apartment = Apartment.activeApartment) {
        const homedefence = apartment.pc.openedApps.find(openedApp => openedApp.window == app);
        const mainScreen = app.querySelector("#homedefence");
        const routers = mainScreen.querySelectorAll(".router");

        routers.forEach(router => router.classList.remove("active"));
        mainScreen.querySelector(`#${Apartment.activeApartment.router.name}`).classList.add("active");

        mainScreen.querySelector(`#${homedefence.selectedRouter.name}`).classList.add("active");
    }
}