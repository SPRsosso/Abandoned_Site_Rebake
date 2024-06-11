let biosKeyPressed = false;
let biosTimeout;
addEventListener("keyup", ( e ) => {
    if (e.keyCode === 46) biosKeyPressed = true;

    clearTimeout(biosTimeout);
    biosTimeout = setTimeout(() => {
        biosKeyPressed = false;
    }, 250);
});