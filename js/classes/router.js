class Router {
    constructor(name, x, y, spanX, spanY) {
        this.name = name;
        this.pos = {
            x,
            y
        }
        this.spanX = spanX;
        this.spanY = spanY;
        this.connectedWifi = null
    }
}