class SiteComponent extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = /*html*/`
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