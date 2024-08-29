class Calculator extends App {
    constructor(window = null) {
        super();

        this.window = window;
    }

    static openApp(apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");

        if (apartment == Apartment.activeApartment) {
            appComponent.innerHTML = /*html*/`
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

                        padding: 5px;
                        border: 1px solid var(--accent-color);

                        display: flex;
                        align-items: center;

                        grid-column: 1 / span 5;
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
            apartment.pc.openedApps.push(calculator);

            appComponent.querySelectorAll("#calculator button").forEach(button => {
                button.addEventListener("click", () => {
                    calculator.writeNumber(button);
                });
            });
        } else {
            apartment.pc.openedApps.push(new Calculator());
        }
    }

    writeNumber(obj) {
        const value = obj.innerHTML;
        const output = this.window.querySelector("#calculator #output");

        switch(value) {
            case "=":
                try {
                    const result = eval(output.innerHTML);
                    output.innerHTML = result;
                } catch(ex) {
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