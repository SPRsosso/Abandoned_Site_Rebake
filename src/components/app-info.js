export class AppInfo extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                div {
                    border: 1px solid var(--accent-color);
                    padding: 2px;

                    background-color: var(--bg-color);

                    font-size: 14px;
                }
            </style>
            <div>
                <slot></slot>
            </div>
        `;
    }
}
customElements.define("app-info", AppInfo);
