export class SiteComponent extends HTMLElement {
    shadow: ShadowRoot;
    
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                :host {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <slot></slot>
        `;
    }
}

customElements.define("site-component", SiteComponent);