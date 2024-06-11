class Apartment {
    static activeApartment;
    constructor(roomNumber) {
        this.wifis = [];

        this.routers = [];
        Apartment.generateRouters(this.routers);

        this.roomNumber = roomNumber;
        this.router = this.routers[this.routers.length - 1];
        this.pc = new PC(this);
    }

    static getByPC(pc) {
        return apartments.find(apartment => apartment.pc === pc);
    }

    static generateRouters(routers) {
        const x = [];
        const y = [];
        const spanX = [];
        const spanY = [];
        let allCellsAreNotFilled = true;

        let loopCount = 0;
        while (allCellsAreNotFilled) {
            let flag = false;
            let xs, ys, spanXs, spanYs;
            do {
                if (loopCount < 3) {
                    const randomNum = Math.random();
                    if (randomNum < 0.5) {
                        xs = genrand(1, 2);
                        ys = genrand(1, 4);
                    } else {
                        xs = genrand(1, 3);
                        ys = genrand(1, 3);
                    }
                    
                    if (randomNum < 0.5) {
                        spanXs = genrand(2, 3 - xs);
                        spanYs = 1;
                    } else {
                        spanXs = 1;
                        spanYs = genrand(2, 4 - ys);
                    }
                } else {
                    xs = genrand(1, 3);
                    ys = genrand(1, 4);
                    spanXs = genrand(1, 3 - xs);
                    spanYs = genrand(1, 4 - ys);
                }
                for (let i = 0; i < x.length; i++) {
                    if (xs + (spanXs - 1) >= x[i] &&
                        xs <= x[i] + (spanX[i] - 1) &&
                        ys + (spanYs - 1) >= y[i] &&
                        ys <= y[i] + (spanY[i] - 1)) {
                        flag = true;
                        break;
                    } else {
                        flag = false;
                    }
                }
            } while (flag)

            x.push(xs);
            y.push(ys);
            spanX.push(spanXs);
            spanY.push(spanYs);
            loopCount++;

            let sum = 0;
            for (let i = 0; i < x.length; i++) {
                sum += spanX[i] * spanY[i];
            }
            if (sum >= 12)
                allCellsAreNotFilled = false;
        }

        for (let i = 0; i < x.length; i++) {
            routers.push(new Router("r" + (i + 1), x[i], y[i], spanX[i], spanY[i]));
        }
    }
}

function genrand(from, to, excluding = []) {
    let num = Math.floor(Math.random() * (to - from + 1 )) + from;
    return excluding.find(ex => ex == num) ? genrand(from, to, excluding) : num;
}