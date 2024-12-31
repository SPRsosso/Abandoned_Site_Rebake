class Connection {
    static Type = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
    };

    constructor(sender, receiver, port) {
        this.sender = sender;
        this.receiver = receiver;
        this.port = port;
        this.packetIndex = 0;
    }
}