class WiTracker extends App {
    constructor(window) {
        super();

        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        const shadow = appComponent.shadowRoot;
        const mainOptions = shadow.querySelector("main-options");

        appComponent.innerHTML = `
            <style>
                ${styles}

                #witracker {
                    width: 100%;
                    height: 100%;

                    display: flex;
                }

                #witracker #list {
                    width: 50%;
                    height: 100%;
                    overflow-y: auto;

                    border-right: 1px solid var(--accent-color);
                }

                #witracker #info {
                    width: 50%;
                    height: 100%;
                }

                #witracker #list, #witracker #info {
                    padding: 10px;
                }

                #witracker ul {
                    width: 100%;
                    padding: 0;
                    margin: 0;

                    list-style-type: none;
                }

                #witracker ul li {
                    width: 100%;
                    padding: 5px;

                    position: relative;

                    cursor: pointer;
                }

                #witracker ul li:hover {
                    background-color: var(--bg-color-faded);
                }

                #witracker li.active {
                    background-color: var(--accent-color-faded);
                }

                #witracker #refresh-btn {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                }

                #witracker img {
                    height: 100%;

                    position: absolute;
                    top: 0;
                    right: 0;
                }

                #witracker #filter {
                    width: 100%;
                    padding: 5px;
                    
                    border-bottom: 1px solid var(--accent-color);
                    margin-bottom: 10px;
                    padding: 5px 0;

                    display: flex;
                }
            </style>

            <span slot="name">WiTracker</span>
            <div id="witracker">
                <div id="list">
                </div>
                <div id="info">
                    <p id="name"></p>
                    <p id="strength"></p>
                    <p id="connected-pcs"></p>
                    <button id="refresh-btn">Refresh</button>
                </div>
            </div>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        openedApps.push(new WiTracker(appComponent));

        WiTracker.showWifis(appComponent);

        appComponent.querySelector("#refresh-btn").addEventListener("click", () => {
            WiTracker.showWifis(appComponent);
        });
    }

    static showWifis(appComponent) {
        const list = appComponent.querySelector("#witracker #list");
        
        let filteredWifis = [...wifis];
        let option = list.querySelector("#sort");
        if (option) {
            option = option.value;

            if (option != "none") {
                if (option == "name")
                    filteredWifis = filteredWifis.sort(( a, b ) => a[option].localeCompare(b[option], undefined, { numeric: true, sensitivity: 'base' }));
                else
                    filteredWifis = filteredWifis.sort(( a, b ) => b[option] - a[option]);
            }
        }
        
        const options = [
            { name: "--none--", value: "none" },
            { name: "name", value: "name" },
            { name: "strength", value: "strength" }
        ]

        let listOptions = `<div id="filter"><p>Sort by: <select id="sort">`;
        for (let i = 0; i < options.length; i++)
            if (options[i].name == option)
                listOptions += `<option value="${options[i].value}" selected>${options[i].name}</option>`;
            else
                listOptions += `<option value="${options[i].value}">${options[i].name}</option>`;
                
        listOptions += `</select></p></div>`;
        list.innerHTML = listOptions;


        const ul = document.createElement("ul");
        ul.innerHTML = ``;

        for (let i = 0; i < wifiCount; i++)
            if (Apartment.activeApartment.router.connectedWifi) {
                if (Apartment.activeApartment.router.connectedWifi.name == filteredWifis[i].name)
                    ul.innerHTML += `<li class="active">${filteredWifis[i].name} <img src="./icons/level${filteredWifis[i].strength}.png"></img></li>`;
                else
                    ul.innerHTML += `<li>${filteredWifis[i].name} <img src="./icons/level${filteredWifis[i].strength}.png"></img></li>`;
            } else
                ul.innerHTML += `<li>${filteredWifis[i].name} <img src="./icons/level${filteredWifis[i].strength}.png"></img></li>`;
        
        const li = ul.querySelectorAll("li");
        const app = openedApps.find(app => app.window == appComponent);
        for (let i  = 0; i < li.length; i++) {
            const element = li[i];
            element.addEventListener("click", () => {
                app.showInfo(element);
            });
        }
        
        list.append(ul);
    }

    showInfo(element) {
        const name = element.innerText;

        const info = this.window.querySelector("#witracker #info");
        const nameBox = info.querySelector("#name");
        const strengthBox = info.querySelector("#strength");
        const connectedPcsBox = info.querySelector("#connected-pcs");

        const wifi = wifis.find(wifi => wifi.name == name);
        nameBox.innerHTML = "Name: " + wifi.name;
        strengthBox.innerHTML = "Strength: " + wifi.strength;
    }
}