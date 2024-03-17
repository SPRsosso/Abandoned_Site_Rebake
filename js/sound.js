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