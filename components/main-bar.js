class MainBar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
            <style>
                ${styles}

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