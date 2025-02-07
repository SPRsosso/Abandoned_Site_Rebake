export class MainOptionsComponent extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
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
                    background-color: rgb(25, 211, 0);
                }

                #yellow {
                    background-color: yellow;
                }

                #red {
                    background-color: red;
                }
            </style>
            `;
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
                    <button id="green"></button>
                    <button id="yellow"></button>
                    <button id="red"></button>
                </div>
            </div>
        `;
        if (green)
            this.bindButton("#green", green);
    }
    async bindButton(selector, functionString) {
        if (!functionString)
            return;
        const button = this.shadow.querySelector(selector);
        if (!button)
            return;
        button.addEventListener("click", async () => {
            try {
                // Extract module and function (example: "PC.shutdown()")
                const match = functionString.match(/([\w./]+)\.(\w+)\(\)/);
                if (match) {
                    const modulePath = match[1]; // "PC"
                    const functionName = match[2]; // "shutdown"
                    // Dynamically import the module
                    const module = await import(`../models/${modulePath.toLowerCase()}.js`);
                    // Call the function
                    if (module[modulePath]) {
                        if (module[modulePath][functionName]) {
                            module[modulePath][functionName]();
                        }
                    }
                    else {
                        console.error(`Function ${functionName} not found in module ${modulePath}`);
                    }
                }
                else {
                    console.error("Invalid function string format:", functionString);
                }
            }
            catch (error) {
                console.error("Error executing function:", error);
            }
        });
    }
}
customElements.define("main-options", MainOptionsComponent);
