import { generateIP } from "../functions.js";
import { Position } from "./position.js";
import { Wifi } from "./wifi.js";

const allRouters: Router[] = [];

export class Router {
    name: string;
    pos: Position;
    strength: Position;
    connectedWifi: Wifi | null;
    ip: string;

    spanX: number;
    spanY: number;

    constructor(name: string, x: number, y: number, spanX: number, spanY: number) {
        this.name = name;
        this.pos = {
            x,
            y
        }
        this.spanX = spanX;
        this.spanY = spanY;
        // Strength means relative position to wifi position
        this.strength = {
            x: 0,
            y: 0
        }

        const spanXs = this.spanX >= 2 ? this.spanX - 0.5 : this.spanX;
        const spanYs = this.spanY >= 2 ? this.spanY - 0.5 : this.spanY;
        this.strength.x = (( this.pos.x - 2 ) + spanXs - 1) * 10;
        this.strength.y = (( this.pos.y - 2.5 ) + spanYs - 1) * 10;
        this.connectedWifi = null;

        this.ip = generateIP(allRouters);

        allRouters.push(this);
    }
}