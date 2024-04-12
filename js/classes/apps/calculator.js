class Calculator extends App {
    constructor(window) {
        super();

        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = `
            <style>
                ${styles}

                #calculator {
                    width: 100%;
                    height: 100%;

                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;

                    padding: 10px;
                }

                #calculator #output {
                    width: 100%;
                    height: 100%;

                    grid-column: 1 / span 5;
                    overflow-x: scroll;

                    font-size: 32px;
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
                <input id="output" type="text" readonly>

                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>+</button>
                <button>-</button>

                <button>4</button>
                <button>5</button>
                <button>6</button>
                <button>*</button>
                <button>/</button>

                <button>7</button>
                <button>8</button>
                <button>9</button>
                <button>(</button>
                <button>)</button>

                
                <button>0</button>
                
                

                <button class="col-span-2">=</button>
                <button><</button>
                <button>C</button>
            </div>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const calculator = new Calculator(appComponent);
        openedApps.push(calculator);

        appComponent.querySelectorAll("#calculator button").forEach(button => {
            button.addEventListener("click", () => {
                calculator.writeNumber(button);
            });
        });
    }

    writeNumber(obj) {
        const value = obj.innerHTML;
        const output = this.window.querySelector("#calculator #output");

        switch(value) {
            case "=":
                try {
                    const result = eval(output.value);
                    output.value += "=" + result;
                } catch(ex) {
                    output.value = "Wrong format";
                }
                break;
            case "C":
                output.value = "";
                break;
            case "&lt;":
                output.value = output.value.slice(0, output.value.length - 1);
                break;
            default:
                if (output.value == "Wrong format")
                    output.value = "";
                output.value += value;
                break;
        }
    }
}