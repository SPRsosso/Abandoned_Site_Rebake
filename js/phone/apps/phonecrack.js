class PhoneCrack extends PhoneApp {
    constructor(window) {
        super();
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");

        appComponent.innerHTML = `
            <style>
                ${styles}

                #crack {
                    padding: 10px;

                    text-align: center;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            <span slot="name">Crack</span>
            <div id="crack">
                
            </div>
        `;

        this.crackUi(appComponent);

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneTutorial(appComponent));
    }

    static wait(waitTime) {
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    static crackUi(appComponent) {
        const crack = appComponent.querySelector("#crack");

        if (!crack)
            return;

        crack.innerHTML = "";

        if (usb.inserted) {
            const button = document.createElement("button");
            button.innerHTML = "Crack PC";

            button.addEventListener("click", async () => {
                let tmpString = "";
                let string = "";
                for (let i = 0; i < Apartment.activeApartment.pc.password.length; i++) {
                    for (let j = 0; j < 25; j++) {
                        const char = Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
                        string = tmpString;
                        string += char;

                        crack.innerHTML = "---Password---<br>" + string;

                        await this.wait(50);
                    }
                    tmpString += Apartment.activeApartment.pc.password[i];
                    crack.innerHTML = "---Password---<br>" + tmpString;
                }
            });

            crack.append(button);
        } else {
            crack.innerHTML = `
                <p>No Pendrive connected</p>
            `;
        }
    }
}