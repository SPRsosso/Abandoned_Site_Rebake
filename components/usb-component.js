class UsbComponent extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
            <style>
                ${ styles }

                #usb {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #dongle {
                    width: 10px;
                    height: calc(var(--usb-height) - 15px);

                    border: 1px solid var(--accent-color);
                }

                #main {
                    width: 100px;
                    height: var(--usb-height);

                    border-radius: 5px;
                    border: 1px solid var(--accent-color);
                }
            </style>
            <div id="usb">
                <div id="dongle"></div>
                <div id="main"></div>
            </div>
        `;
    }
}

customElements.define("usb-component", UsbComponent);