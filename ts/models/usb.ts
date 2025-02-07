export class Usb {
    inserted: boolean;

    constructor() {
        this.inserted = false;
    }
}

export const usb = new Usb();