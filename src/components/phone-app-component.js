export class PhoneAppComponent extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #app {
                    width: 100%;
                    height: calc(100% - 50px);

                    background-color: var(--bg-color);
                    border-radius: 10px;

                    position: absolute;
                    top: 0;
                    left: 0;
                }

                #app-banner {
                    width: 100%;
                    height; 50px;

                    border-bottom: 1px solid var(--accent-color);
                    padding: 10px;
                }

                #app-content {
                    width: 100%;
                    height: calc(100% - 50px);

                    overflow-y: auto;
                }
            </style>
            <div id="app">
                <div id="app-banner">
                    <h3><slot name="name"></slot></h3>
                </div>
                <div id="app-content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
customElements.define("phone-app-component", PhoneAppComponent);
