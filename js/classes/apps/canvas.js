class Canvas extends App {
    static isFree = true;
    static isRubberActive = false;
    static color1 = "#19d300";

    constructor(window) {
        super();

        this.window = window;
    }

    static openApp(file, apartment = Apartment.activeApartment) {
        const appComponent = document.createElement("app-component");
        if (apartment == Apartment.activeApartment) {
            appComponent.innerHTML = /*html*/`
                <link rel="stylesheet" href="./styles/style.css">
                <link rel="stylesheet" href="./styles/canvas.css">
                <span id="title" slot="name">Canvas</span>
                <div id="canvas">
                    <nav>
                        <button id="save" class="inactive">Save</button>
                        <button id="clear">Clear</button>
                        <div class="division"></div>
                        <p>Tools: </p>
                        <button id="rubber">Rubber: off</button>
                        <input type="color" id="color" value="#19d300">
                    </nav>
                    <div class="container">
                        <canvas id="draw-canvas"></canvas>
                    </div>
                </div>
            `;

            Canvas.isRubberActive = false;

            App.defaultValues(appComponent);
            this.screen.prepend(appComponent);
            const canvas = new Canvas(appComponent);
            apartment.pc.openedApps.push(canvas);

            const clearBtn = appComponent.querySelector("#clear");
            const saveBtn = appComponent.querySelector("#save");
            const changeColor = appComponent.querySelector("#color");
            const changeRubber = appComponent.querySelector("#rubber");

            const canvasEl = appComponent.querySelector("#draw-canvas");
            const c = canvasEl.getContext("2d");

            const pixelSize = 12;
            const canvasSize = 16;
            canvasEl.width = canvasSize * pixelSize;
            canvasEl.height = canvasSize * pixelSize;

            const pixels = [];
            for (let y = 0; y < canvasSize; y++) {
                pixels[y] = [];
                for (let x = 0; x < canvasSize; x++) {
                    pixels[y].push("n");
                }
            }

            let mouseDown = false;
            canvasEl.addEventListener("mousedown", ( e ) => {
                mouseDown = true;

                const x = e.clientX - canvasEl.getBoundingClientRect().left;
                const y = e.clientY - canvasEl.getBoundingClientRect().top;

                const pixelX = Math.floor(x / pixelSize);
                const pixelY = Math.floor(y / pixelSize);

                if (!pixels[pixelY]) return;
                if (!pixels[pixelY][pixelX]) return;

                if (Canvas.isRubberActive) pixels[pixelY][pixelX] = "n";
                else pixels[pixelY][pixelX] = Canvas.color1;
                drawImage();
            });

            canvasEl.addEventListener("mouseup", () => {
                mouseDown = false;
            });

            function drawImage() {
                c.clearRect(0, 0, canvasEl.width, canvasEl.height);
                for (let y = 0; y < canvasSize; y++) {
                    for (let x = 0; x < canvasSize; x++) {
                        if (pixels[y][x] === "n") continue;
                        c.beginPath();
                        c.fillStyle = pixels[y][x];
                        c.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
                        c.fill();
                    }
                }
            }

            canvasEl.addEventListener("mousemove", ( e ) => {
                // DRAW PIXELS
                drawImage();

                // HIGHLIGHT
                const x = e.clientX - canvasEl.getBoundingClientRect().left;
                const y = e.clientY - canvasEl.getBoundingClientRect().top;

                const pixelX = Math.floor(x / pixelSize);
                const pixelY = Math.floor(y / pixelSize);

                if (!pixels[pixelY]) return;
                if (!pixels[pixelY][pixelX]) return;

                c.beginPath();
                c.strokeStyle = Canvas.color1;
                c.rect(pixelX * pixelSize, pixelY * pixelSize, pixelSize, pixelSize);
                c.stroke();

                if (!mouseDown) return;

                // DRAWING
                if (Canvas.isRubberActive) pixels[pixelY][pixelX] = "n";
                else pixels[pixelY][pixelX] = Canvas.color1;
                drawImage();

                if (!file) return;

                file.content = "";
            });

            clearBtn.addEventListener("click", () => {
                for (let y = 0; y < canvasSize; y++) {
                    pixels[y] = [];
                    for (let x = 0; x < canvasSize; x++) {
                        pixels[y].push("n");
                    }
                }
                drawImage();
            })

            changeColor.addEventListener("input", () => {
                Canvas.color1 = changeColor.value;
            });

            changeRubber.addEventListener("click", () => {
                Canvas.isRubberActive = !Canvas.isRubberActive;

                if (Canvas.isRubberActive) changeRubber.innerHTML = "Rubber: on";
                else changeRubber.innerHTML = "Rubber: off";
            });

            // FILE SYSTEM
            if (!file) return;

            const title = appComponent.querySelector("#title");
            title.innerText = `Painting ${file.name} image...`;

            const VALUE_SPLITTER = ":";

            saveBtn.classList.remove("inactive");
            saveBtn.addEventListener("click", () => {
                let content = "";
                for (let y = 0; y < canvasSize; y++) {
                    for (let x = 0; x < canvasSize; x++) {
                        content += pixels[y][x];
                        if (x < canvasSize - 1) content += VALUE_SPLITTER;
                    }
                    if (y < canvasSize - 1) content += "\n";
                }

                file.content = content;
            });

            if (!file.content) return;

            const fileRows = file.content.split("\n");

            if (fileRows.length < canvasSize) return;

            for (let y = 0; y < canvasSize; y++) {
                pixels[y] = fileRows[y].split(VALUE_SPLITTER);
            }
            drawImage();
        } else {
            apartment.pc.openedApps.push(new Canvas());
        }
    }
}