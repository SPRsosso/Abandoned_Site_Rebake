import { PhoneApp } from "../phoneapp.js";
import { openedPhoneApps } from "../phoneapps.js";
export class PhoneCalculator extends PhoneApp {
    constructor(window) {
        super(window);
    }
    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #calculator {
                    width: 100%;
                    height: 100%;

                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;

                    padding: 10px;
                }

                #calculator #output {
                    width: 100%;
                    height: 100%;

                    padding: 5px;
                    border: 1px solid var(--accent-color);

                    display: flex;
                    align-items: center;

                    grid-column: 1 / span 4;
                    overflow-x: auto;
                    overflow-y: hidden;

                    word-wrap: normal;

                    font-size: 32px;
                }

                #calculator #output:focus {
                    outline: none;
                }

                #calculator button {
                    font-size: 24px;
                }

                .col-span-2 {
                    grid-column: span 2;
                }
            </style>
            <span slot="name">Calculator</span>
            <div id="calculator">
                <span id="output" type="text" contentEditable></span>

                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>+</button>

                <button>4</button>
                <button>5</button>
                <button>6</button>
                <button>-</button>

                <button>7</button>
                <button>8</button>
                <button>9</button>
                <button>*</button>

                <button>(</button>
                <button>0</button>
                <button>)</button>
                <button>/</button>

                <button class="col-span-2">=</button>
                <button><</button>
                <button>C</button>
            </div>
        `;
        this.screen.prepend(appComponent);
        const calculator = new PhoneCalculator(appComponent);
        openedPhoneApps.push(calculator);
        appComponent.querySelectorAll("#calculator button").forEach((button) => {
            button.addEventListener("click", () => {
                calculator.writeNumber(button);
            });
        });
        const output = appComponent.querySelector("#output");
        output.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                const button = document.createElement("button");
                button.innerHTML = "=";
                calculator.writeNumber(button);
            }
        });
    }
    writeNumber(obj) {
        const value = obj.innerHTML;
        const output = this.window.querySelector("#calculator #output");
        switch (value) {
            case "=":
                try {
                    const result = eval(output.innerHTML);
                    output.innerHTML = result;
                }
                catch (ex) {
                    output.innerHTML = "Wrong format";
                }
                break;
            case "C":
                output.innerHTML = "";
                break;
            case "&lt;":
                output.innerHTML = output.innerHTML.slice(0, output.innerHTML.length - 1);
                break;
            default:
                if (output.innerHTML == "Wrong format")
                    output.innerHTML = "";
                output.innerHTML += value;
                break;
        }
    }
}
