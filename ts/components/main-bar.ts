import { barHeight } from "../variables.js";

export class MainBar extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                :host {
                    z-index: 1;
                }

                #bar {
                    width: 100%;
                    height: ${barHeight}px;

                    border-top: 1px solid var(--accent-color);

                    display: flex;
                    align-items: center;
                    gap: 7px;

                    padding: 20px;
                }
            </style>
            <div id="bar">
                <input type="text" placeholder="Search...">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("main-bar", MainBar);