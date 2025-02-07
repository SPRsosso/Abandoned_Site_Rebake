export class FullscreenWindow {
    static isFullscreen = false;

    static maximizeWindow() {
        !FullscreenWindow.isFullscreen ? document.querySelector("main")!.requestFullscreen() : document.exitFullscreen();
        FullscreenWindow.isFullscreen = !FullscreenWindow.isFullscreen;
    }
}