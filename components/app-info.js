class AppInfo extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    
        this.shadow.innerHTML = `
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