class Web {
    static users = [
        new BrowserUser(0, "test123", "123", "Test", "123", 24, "Welcome to my Fit!", "Chive Apartment 301"),
        new BrowserUser(1, "test456", "456", "Test", "456", 24, "Welcome to my Fit!", "Chive Apartment 301"),
    ];

    static sessions = [];

    static Status = {
        Error: "Error",
        OK: "OK",
        End: "End",
    };
    
    static websites = {
        BlankPage,
        Perfit,
        Wifiproducents,
        Netfinity,
        Octron,
        EasyConnect,
        SeagulNetworks,
        Mywifi,
        WireLink,
        InMail,
    };

    static connections = [];
    
    constructor() {}

    static factorLink(link) {
        const factorizedLink = link.split("/");
        const retLink = factorizedLink.shift();
        const path = factorizedLink.join("/");

        return { link: retLink, path };
    }

    static async sendConnectionRequest(link, apartment = Apartment.activeApartment) {
        const wifi = apartment.router.connectedWifi;
        return new Promise(async ( resolve, reject ) => {
            let requestWait = 3000;
            if (!wifi) {
                await wait(requestWait);
                resolve({ status: Web.Status.Error });
                return;
            }

            if (link.trim() === "") {
                return;
            }
            
            requestWait -= (requestWait - 500) / (6 - wifi.strength);
            let websiteFound = false;
            Object.values(Web.websites).forEach(async ( website ) => {
                if (website.dns === link || website.ip === link) {
                    websiteFound = true;

                    await wait(requestWait);
                    
                    const MAX_PORT = 2000;
                    let port = randomInt(0, MAX_PORT);
                    while (Web.connections.some(conn => conn.port === port)) {
                        port = randomInt(0, MAX_PORT);
                    }
                    Web.connections.push(new Connection(apartment.pc.ip, website.ip, port));
                    resolve({ status: Web.Status.OK, port: port, link: website.dns });
                }
            });

            if (!websiteFound) {
                await wait(requestWait);
                resolve({ status: Web.Status.Error });
                return;
            }

            return;
        });
    }

    static async GET(port, path, browser, callback = ( packet ) => {}, apartment = Apartment.activeApartment) {
        const PACKET_SENDING_SIZE = 10;

        const wifi = apartment.router.connectedWifi;
        const connection = Web.connections.find(conn => conn.port === port && conn.sender === apartment.pc.ip);
        let foundServer = Object.values(Web.websites).find(web => web.ip === connection?.receiver);
    
        return new Promise(async ( resolve, reject ) => {
            while (true) {
                let PACKET_SENDING_TIME = 25;

                if (!wifi || !connection || !foundServer) {
                    await wait(PACKET_SENDING_TIME);
    
                    Web.closeConnection(port, apartment);
    
                    callback(new Packet(Web.Status.Error));
                    resolve();
                    return;
                }

                const server = foundServer.GET(path, browser, apartment);

                if (server.status === Web.Status.Error) {
                    await wait (PACKET_SENDING_TIME);

                    Web.closeConnection(port, apartment);

                    callback(new Packet(Web.Status.Error));
                    resolve();
                    return;
                }

                PACKET_SENDING_TIME -= (PACKET_SENDING_TIME - 5) / (6 - wifi.strength);  

                await wait(PACKET_SENDING_TIME);

                if (connection.packetIndex >= server.siteFragment.length) {
                    callback(new Packet(Web.Status.End, server.site));
                    resolve();
                    return;
                }
    
                const part = server.siteFragment.substr(connection.packetIndex, PACKET_SENDING_SIZE);
                connection.packetIndex += PACKET_SENDING_SIZE;
                const packet = new Packet(Web.Status.OK, part);

                callback(packet);
            }
        });
    }

    static async POST(port, data, browser, apartment = Apartment.activeApartment) {
        let PACKET_SENDING_TIME = 45;

        const wifi = apartment.router.connectedWifi;
        const connection = Web.connections.find(conn => conn.port === port && conn.sender === apartment.pc.ip);
        let foundServer = Object.values(Web.websites).find(web => web.ip === connection?.receiver);

        return new Promise(async (resolve, reject) => {
            if (!wifi || !connection || !foundServer) {
                await wait(PACKET_SENDING_TIME);

                resolve(new Packet(Web.Status.Error, null, "Something went wrong, check your internet connection"));
                return;
            }

            PACKET_SENDING_TIME -= (PACKET_SENDING_TIME - 5) / (6 - wifi.strength);
            
            const server = await foundServer.POST(data, browser, apartment);
            
            await wait(PACKET_SENDING_TIME);
            
            if (server.status === Web.Status.Error) {
                resolve(new Packet(Web.Status.Error, null, server.message));
                return;
            }

            resolve(new Packet(Web.Status.OK, null, server.message));
        });
    }

    static async closeConnection(port, apartment = Apartment.activeApartment) {
        let CLOSING_CONNECTION_TIME = 500;

        const wifi = apartment.router.connectedWifi;
        const connection = Web.connections.find(conn => conn.port === port && conn.sender === apartment.pc.ip);
        let foundServer = Object.values(Web.websites).find(web => web.ip === connection?.receiver);

        return new Promise(async ( resolve, reject ) => {
            if (!wifi || !foundServer) {
                Web.connections = Web.connections.filter(conn => conn != connection);
                resolve({ status: Web.Status.Error, port: null });

                return;
            }

            CLOSING_CONNECTION_TIME -= (CLOSING_CONNECTION_TIME - 50) / (6 - wifi.strength);
            await wait(CLOSING_CONNECTION_TIME);

            Web.connections = Web.connections.filter(conn => conn != connection);

            resolve({ status: Web.Status.OK, port: null });
        });
    }

    static userLoggedIn(sessionIDs) {
        let session;
        sessionIDs.forEach(sessionID => {
            session = Web.sessions.find(session => {
                return session.sessionID === sessionID;
            });
        })

        return Web.users.find(user => user.id === session?.userID);
    }
}