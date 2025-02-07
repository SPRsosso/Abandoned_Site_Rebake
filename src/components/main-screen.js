import { barHeight } from "../variables.js";
export class MainScreenComponent extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #screen {
                    height: calc(100% - 50px);
                    width: 100%;

                    position: relative;
                    
                    overflow: hidden;
                }

                #desktop {
                    width: 100%;
                    height: calc(100% - ${barHeight}px);
                }
            </style>
            <div id="screen">
                <div id="desktop">
                    <slot></slot>
                </div>
                <slot name="bar"></slot>
            </div>
        `;
    }
}
customElements.define("main-screen", MainScreenComponent);
