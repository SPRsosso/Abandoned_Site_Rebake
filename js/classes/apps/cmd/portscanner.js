class PortScanner extends CMDApp {
    static isFree = true;
    constructor() {
        super();
    }

    static async command(tokenized, cmd) {
        tokenized.shift();

        const allowedFlags = [
            { value: "h", output: "help" },
            { value: "help", output: "help" }
        ];
        const flagArray = CMD.getFlags(allowedFlags, tokenized);

        let helpFlag;
        flagArray.forEach(flag => {
            switch (flag) {
                case "help":
                    CMD.log(cmd.window, "portscanner *sender_ip* *from* *to* <br> *sender_ip* - Sender IP to be scanned, sender is the PC/Server that sent connection request <br> *from* - from port <br> *to* - to port");

                    helpFlag = true;
                    break;
            }
        });

        if (helpFlag) return;

        if (tokenized.length < 3) {
            CMD.error(cmd.window, "Needs at least 3 arguments!");
            return;
        }

        const senderIP = tokenized.shift().value;
        const from = tokenized.shift().value;
        const to = tokenized.shift().value;

        if (from > to) {
            CMD.error(cmd.window, "*from* argument should be less than *to* argument");
            return;
        }

        const connection = Web.connections.find(conn => conn.sender === senderIP);

        if (!connection) {
            CMD.error(cmd.window, "Sender IP not found");
            return;
        }

        let i = from;
        let countedTicks = 0;
        await new Promise(async ( resolve, reject ) => {
            CMD.log(cmd.window, "Started scanning...");
        
            const timeInterval = setInterval(() => {
                countedTicks++;
            }, tps);

            while (true) {
                if (i > to) {
                    clearInterval(timeInterval);
                    CMD.log(cmd.window, `Finished in ${tickstoms(countedTicks)}ms`);
                    resolve();
                    break;
                }

                if (connection.port === i) CMD.log(cmd.window, i);

                i++;

                await wait(tps * trojanMultiplier);
            }
        });
    }
}