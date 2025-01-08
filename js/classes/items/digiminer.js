class DigiMiner {
    static price = 19.99;
    constructor() {
        this.mining = true;
        this.mine();
    }

    async mine() {
        while (true) {
            if (!this.mining) break;

            player.digiCoins += 0.001;

            await wait((tps * trojanMultiplier) * ticks * 4); // Mines every 4 seconds with trojan virus delay
        }
    }
}