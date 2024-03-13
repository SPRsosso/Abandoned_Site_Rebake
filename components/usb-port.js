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

            let isTheSameUsb = false;

            let usbInterval;
            usbs.forEach(usb => {
                if (usb.getAttribute("usb-id") == this.usbId) {
                    isTheSameUsb = true;
                    clearInterval(usbInterval);
                    usb.remove();
                }
            });

            if (!isTheSameUsb) {
                const usb = document.createElement("usb-component");
                usb.style.position = "absolute";
                usbInterval = setInterval(() => {
                    usb.style.left = this.shadow.host.getBoundingClientRect().right + "px";
                    usb.style.top = this.shadow.host.getBoundingClientRect().top + "px";
                }, 0);
                usb.setAttribute("usb-id", this.usbId);
                document.body.append(usb);
            }
        });
    }
}

customElements.define("usb-port", UsbPort);