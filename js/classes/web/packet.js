class Packet {
    constructor(status, body = null, message = null) {
        this.status = status;
        this.body = body;
        this.message = message;
    }
}