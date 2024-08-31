class Decoder extends CMDApp {
    constructor() {

    }

    static async command(tokenized, cmd, system) {
        tokenized.shift();

        if (tokenized.length < 1) {
            CMD.error(cmd.window, "Needs at least 1 argument!");
            return;
        }

        const string = tokenized.shift().value;
        const halfHashes = string.split(":");

        await new Promise(async ( resolve, reject ) => {
            let i = 0;
            const slog = CMD.slog(cmd.window);
            while(true) {
                if (halfHashes.length <= i) {
                    resolve();
                    break;
                }

                const foundChar = Wifi.possibleChars[halfHashes[i]]
                if (!foundChar) CMD.error(cmd.window, "Error in decoding...");
                else CMD.inlog(cmd.window, slog, foundChar);

                i++;

                await wait(tps * trojanMultiplier);
            }
        });
    }
}