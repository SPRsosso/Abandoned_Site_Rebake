function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateIP(objs) {
    const firstNum = randomInt(1, 255);
    const secondNum = randomInt(0, 255);
    const thirdNum = randomInt(0, 255);
    const fourthNum = randomInt(0, 255);

    const ip = `${firstNum}.${secondNum}.${thirdNum}.${fourthNum}`;

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];

        if (obj.ip === ip) return generateIP(objs);
    }

    return ip;
}