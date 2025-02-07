export class Message {
    user: string;
    description: string;
    date: Date;

    constructor(user: string, description: string, date: Date) {
        this.user = user;
        this.description = description;
        this.date = date;
    }
}