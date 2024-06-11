class AppComponent extends HTMLElement {
    constructor() {
        super();
    
        this.shadow = this.attachShadow({ mode: "open" });
        this.moves = false;

        this.shadow.innerHTML = /*html*/`
            <style>
                ${styles}

                #app {
                    width: 500px;
                    aspect-ratio: 16/9;

                    border: 1px solid var(--accent-color);
                    background-color: var(--bg-color);
                }
            </style>
            <div id="app">
                <main-options><slot name="name"></slot></main-options>
                <slot></slot>
            </div>
        `;
    }

    connectedCallback() {
        setTimeout(() => {
            const mainOptions = this.shadow.querySelector("main-options");
            const redButton = mainOptions.shadowRoot.querySelector("#red");
    
            redButton.onclick = () => {
                App.closeApp(this.shadowRoot.host);
            }

            let offset = {
                x: 0,
                y: 0
            }
            mainOptions.addEventListener("mousedown", ( e ) => {
                offset = {
                    x: this.shadowRoot.host.offsetLeft - e.clientX,
                    y: this.shadowRoot.host.offsetTop - e.clientY
                }
                this.moves = true;
                mainOptions.addEventListener("mousemove", ( event ) => {
                    if (this.moves)
                        App.moveApp(this.shadowRoot.host, offset, event.clientX, event.clientY, event);
                });
            });

            addEventListener("mouseup", ( e ) => {
                this.moves = false;
                offset = {
                    x: this.shadowRoot.host.offsetLeft - e.clientX,
                    y: this.shadowRoot.host.offsetTop - e.clientY
                }
            });

            this.shadow.querySelector("#app").addEventListener("mousedown", () => {
                App.moveAppOnTop(this.shadowRoot.host);
            });
        }, 0);
    }
}

customElements.define("app-component", AppComponent);