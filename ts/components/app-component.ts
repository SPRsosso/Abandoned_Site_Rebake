import { MainOptionsComponent } from "./main-options.js";

export class AppComponent extends HTMLElement {
    shadow: ShadowRoot;
    moves: boolean;

    constructor() {
        super();
    
        this.shadow = this.attachShadow({ mode: "open" });
        this.moves = false;

        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
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
            const mainOptions = this.shadow.querySelector<MainOptionsComponent>("main-options") as MainOptionsComponent;
            const redButton = mainOptions.shadow.querySelector("#red") as MainOptionsComponent;
    
            const host = this.shadow.host as AppComponent;

            const name = host.getAttribute("name");
            redButton.onclick = () => {
                // apps[name].closeApp(host);
            }

            let offset = {
                x: 0,
                y: 0
            }
            mainOptions.addEventListener("mousedown", ( e ) => {
                offset = {
                    x: host.offsetLeft - e.clientX,
                    y: host.offsetTop - e.clientY
                }
                this.moves = true;
                mainOptions.addEventListener("mousemove", ( event: MouseEvent ) => {
                    // if (this.moves)
                        // App.moveApp(this.shadow.host, offset, event.clientX, event.clientY, event);
                });
            });

            addEventListener("mouseup", ( e ) => {
                this.moves = false;
                offset = {
                    x: host.offsetLeft - e.clientX,
                    y: host.offsetTop - e.clientY
                }
            });

            this.shadow.querySelector("#app")?.addEventListener("mousedown", () => {
                // App.moveAppOnTop(host);
            });
        }, 0);
    }
}

customElements.define("app-component", AppComponent);