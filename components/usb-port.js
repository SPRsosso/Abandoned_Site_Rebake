class UsbPort extends HTMLElement {
    constructor() {
        super();

        

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
            <style>
                ${ styles }

                #port {
                    width: 20px;
                    height: var(--usb-height);

                    border: 1px solid var(--accent-color);
                }

                #port:hover {
                    background-color: var(--accent-color-faded);
                    
                    cursor: pointer;
                }
            </style>
            <div id="port">

            </div>
        `;
    }

    connectedCallback() {
        this.usbId = this.shadow.host.getAttribute("usb-id");
        setInterval(() => {
            const main = document.querySelector("main");

            this.shadow.host.style.left = main.getBoundingClientRect().right + "px";
            this.shadow.host.style.top = (main.getBoundingClientRect().top + 20) + "px";
        }, 0);

        this.shadow.host.addEventListener("dblclick", () => {
            const usbs = document.querySelectorAll("usb-component");
            const apps = document.querySelector("phone-component").shadowRoot.querySelectorAll("phone-app-component");

            let isTheSameUsb = false;

            let usbInterval;
            usbs.forEach(usbArr => {
                if (usbArr.getAttribute("usb-id") == this.usbId) {
                    isTheSameUsb = true;
                    clearInterval(usbInterval);
                    usbArr.remove();
                    
                    usb.inserted = false;
                }
            });

            if (!isTheSameUsb) {
                const usbComponent = document.createElement("usb-component");
                usbComponent.style.position = "absolute";
                usbInterval = setInterval(() => {
                    usbComponent.style.left = this.shadow.host.getBoundingClientRect().right + "px";
                    usbComponent.style.top = this.shadow.host.getBoundingClientRect().top + "px";
                }, 0);
                usbComponent.setAttribute("usb-id", this.usbId);
                document.body.append(usbComponent);

                usb.inserted = true;
            }

            if (usb.inserted) {
                apps.forEach(app => {
                    PhoneCrack.crackUi(app);
                });
                
                openedApps.forEach(openedApp => {
                    HashMap.ui(openedApp.window);
                });
            } else {
                apps.forEach(app => {
                    PhoneCrack.crackUi(app);
                });

                openedApps.forEach(openedApp => {
                    HashMap.ui(openedApp.window);
                });
            }
        });
    }
}

customElements.define("usb-port", UsbPort);