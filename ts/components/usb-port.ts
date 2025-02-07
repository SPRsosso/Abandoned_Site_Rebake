import { PhoneCrack } from "../models/phone/apps/phonecrack.js";
import { usb } from "../models/usb.js";
import { PhoneAppComponent } from "./phone-app-component.js";
import { PhoneComponent } from "./phone-component.js";

export class UsbPort extends HTMLElement {
    shadow: ShadowRoot;
    usbId: number = 0;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/`
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
        const host = this.shadow.host as HTMLElement;
        this.usbId = parseInt(host.getAttribute("usb-id") as string);
        setInterval(() => {
            const main = document.querySelector<HTMLDivElement>("main");

            host.style.left = main!.getBoundingClientRect().right + "px";
            host.style.top = (main!.getBoundingClientRect().top + 20) + "px";
        }, 0);

        host.addEventListener("dblclick", () => {
            const usbs = document.querySelectorAll<HTMLElement>("usb-component");
            const apps = (document.querySelector("phone-component") as PhoneComponent).shadow.querySelectorAll<PhoneAppComponent>("phone-app-component");

            let isTheSameUsb = false;

            let usbInterval: any;
            usbs.forEach((usbArr: HTMLElement) => {
                if (parseInt(usbArr.getAttribute("usb-id") as string) == this.usbId) {
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

            apps.forEach((app: PhoneAppComponent) => {
                PhoneCrack.crackUi(app);
            });
        });
    }
}

customElements.define("usb-port", UsbPort);