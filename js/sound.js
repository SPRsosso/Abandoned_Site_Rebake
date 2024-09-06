addEventListener("mousedown", () => {
    const click = new Audio("./sounds/ClickDown.mp3");
    click.volume = 0.5;
    click.play();
});

addEventListener("mouseup", () => {
    const click = new Audio("./sounds/ClickUp.mp3");
    click.volume = 0.2;
    click.play();
});

let keyPressed = {
    keyCode: null
};
addEventListener("keydown", (e) => {
    if(!isInteracted) return;

    if (keyPressed.keyCode === e.keyCode) return;

    const key = new Audio("./sounds/KeyDown.mp3");
    key.volume = 0.5;
    key.play();

    keyPressed.keyCode = e.keyCode;
});

addEventListener("keyup", () => {
    if(!isInteracted) return;
    
    const key = new Audio("./sounds/KeyUp.mp3");
    key.volume = 0.7;
    key.play();

    keyPressed.keyCode = null;
});