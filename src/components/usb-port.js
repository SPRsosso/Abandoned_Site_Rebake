import { PhoneCrack } from "../models/phone/apps/phonecrack.js";
import { usb } from "../models/usb.js";
export class UsbPort extends HTMLElement {
    shadow;
    usbId = 0;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
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
        const host = this.shadow.host;
        this.usbId = parseInt(host.getAttribute("usb-id"));
        setInterval(() => {
            const main = document.querySelector("main");
            host.style.left = main.getBoundingClientRect().right + "px";
            host.style.top = (main.getBoundingClientRect().top + 20) + "px";
        }, 0);
        host.addEventListener("dblclick", () => {
            const usbs = document.querySelectorAll("usb-component");
            const apps = document.querySelector("phone-component").shadow.querySelectorAll("phone-app-component");
            let isTheSameUsb = false;
            let usbInterval;
            usbs.forEach((usbArr) => {
                if (parseInt(usbArr.getAttribute("usb-id")) == this.usbId) {
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
                usbComponent.setAttribute("usb-id", this.usbId.toString());
                document.body.append(usbComponent);
                usb.inserted = true;
            }
            apps.forEach((app) => {
                PhoneCrack.crackUi(app);
            });
        });
    }
}
customElements.define("usb-port", UsbPort);
