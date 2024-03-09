class MainOptions extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
            <style>
                ${styles}
                
                #options {
                    width: 100%;
                    height: 50px;
                    border-bottom: 1px solid var(--accent-color);

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;

                    padding: 20px;
                }

                button {
                    width: 20px;
                    aspect-ratio: 1;

                    border: none;

                    cursor: pointer;
                }

                #green {
                    background-color: var(--accent-color);
                }

                #yellow {
                    background-color: yellow;
                }

                #red {
                    background-color: red;
                }
            </style>
            `
    }

    connectedCallback() {
        let red = this.getAttribute("red");
        let yellow = this.getAttribute("yellow");
        let green = this.getAttribute("green");

        this.shadow.innerHTML += `
            <div id="options">
                <h3 id="name">
                    <slot></slot>
                </h3>
                <div>
                    <button id="green" onclick="${green}"></button>
                    <button id="yellow" onclick="${yellow}"></button>
                    <button id="red" onclick="${red}"></button>
                </div>
            </div>
        `
    }
}

customElements.define("main-options", MainOptions);