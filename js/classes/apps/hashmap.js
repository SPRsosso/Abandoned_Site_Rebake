class HashMap extends App {
    static informations = [
        { value: FileTypes.firewall, title: "Firewall", description: "Firewall is great for securing your computer from standard attacks, for example via Wifi network or via pendrive" },
        { value: FileTypes.authorized, title: "Authorized", description: "Authorized security is great for securing your computer from unnoticed attacks, for example via computer merging or via computer scanning" },
        { value: FileTypes.transmission, title: "Transmission", description: "Transmission security is great for securing your computer from loud attacks, for example via message cloning or via computer wiretapping"},
    ];

    constructor(window = null) {
        super();

        this.window = window;
    }

    static openApp(apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");
        
        if (apartment = Apartment.activeApartment) {
            appComponent.innerHTML = /*html*/`
                <style>
                    ${styles}

                    #hashmap {
                        width: 100%;
                        height: 100%;

                        padding: 10px;

                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    #hashmap .cards {
                        width: 60%;
                        height: 100%;

                        border-right: 1px solid var(--accent-color);
                        padding-right: 10px;

                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                    }

                    #hashmap .card {
                        width: 75px;
                        height: 75px;

                        border-radius: 10px;
                        padding: 5px;

                        cursor: pointer;
                    }

                    #hashmap .card:hover {
                        background-color: var(--accent-color-faded);
                    }

                    #hashmap .card.active {
                        background-color: var(--accent-color-faded);
                    }

                    #hashmap .card img {
                        width: 100%;
                        height: 100%;
                    }

                    #hashmap .information {
                        width: 40%;
                        height: 100%;
                        padding: 10px;

                        position: relative;
                    }

                    #hashmap .download-btn {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }

                    #hashmap .information h3 {
                        text-align: center;
                    }
                </style>
                <span slot="name"># Map</span>
                <div id="hashmap">
                    
                </div>
            `;

            HashMap.ui(appComponent);

            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);
            apartment.pc.openedApps.push(new HashMap(appComponent));
        } else {
            apartment.pc.openedApps.push(new HashMap());
        }
        
    }

    static ui(app) {
        const hashmap = app.querySelector("#hashmap");

        if (!hashmap)
            return;

        if (!usb.inserted) {
            hashmap.innerHTML = /*html*/`
                <p>Pendrive is not inserted</p>
            `;
        } else {
            hashmap.innerHTML = /*html*/`
                <div class="cards">
                    <div class="card">
                        <img src="icons/level5.png">
                    </div>
                    <div class="card">
                        <img src="icons/UserImage.png">
                    </div>
                    <div class="card">
                        <img src="icons/TransmissionSecurity.png">
                    </div>
                </div>
                <div class="information">
                    
                </div>
            `;
        }

        hashmap.querySelectorAll(".card").forEach(( card, index ) => {
            card.addEventListener("click", () => {
                HashMap.getInformation(app, card, index);
            });
        });
    }

    static getInformation(app, obj, index) {
        const information = app.querySelector(".information");
        if (!information) return;

        app.querySelectorAll(".card").forEach(card => {
            card.classList.remove("active");
        });
        obj.classList.add("active");

        information.innerHTML = /*html*/`
            <h3>${HashMap.informations[index].title}</h3>
            <p>
                ${HashMap.informations[index].description}
            </p>
            <button class="download-btn">Download</button>
        `;

        const downloadButton = information.querySelector(".download-btn");
        downloadButton.addEventListener("click", () => {
            const cover = document.createElement("div");
            const hashmap = app.querySelector("#hashmap");

            cover.style.width = hashmap.offsetWidth + "px";
            cover.style.height = hashmap.offsetHeight + "px";
            cover.style.position = "absolute";
            cover.style.zIndex = "10000000";
            cover.style.cursor = "wait";

            document.body.append(cover);

            HashMap.downloadAttackSimplification(downloadButton, index, { cover, interval: setInterval(() => { cover.style.left = `${hashmap.getBoundingClientRect().left}px`; cover.style.top = `${hashmap.getBoundingClientRect().top}px` }, 25) });
        });
    }

    static async downloadAttackSimplification(component, index, attr) {
        await Component.download(component, 10000);

        usb.additionalProgram = HashMap.informations[index].value;

        attr.cover.remove();
        clearInterval(attr.interval);
    }
}