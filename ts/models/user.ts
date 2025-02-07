import { apartments } from "../data/apartments.js";
import { shared } from "../shared.js";
import { Apartment } from "./apartment.js";
import { App } from "./app.js";
import { Message } from "./message.js";
import { PC } from "./pc.js";

export class User {
    name: string;
    surname: string;
    fullName: string;
    age: number;
    home: string;
    job: string;
    phoneNumber: string;
    id: string;
    email: string;

    constructor(name: string, surname: string, age: number, home: string, job: string, phoneNumber: string, id: string, email: string) {
        this.name = name;
        this.surname = surname;
        this.fullName = name + " " + surname;
        this.age = age;
        this.home = home;
        this.job = job;
        this.phoneNumber = phoneNumber;
        this.id = id;
        this.email = email;
    }

    static getById(userId: string): User | undefined {
        if (userId === "0") return anonymousUser;

        return apartments.find((apartment: Apartment) => apartment.pc.user.id === userId)?.pc.user;
    }

    sendMessage(toUser_id: string, description: string) {
        const pc = PC.getByUser(toUser_id);
        const currentPc = PC.getByUser(this.id);

        if (pc) {
            let userInsideMessages = pc.messages[this.id];
            
            const message = new Message(this.fullName, description, new Date());
            if (userInsideMessages) {
                if (userInsideMessages.length >= 50) userInsideMessages.shift();

                userInsideMessages.push(message);
            } else {
                pc.messages[this.id] = [];
                pc.messages[this.id].push(message);
            }
        }

        if (currentPc) {
            if (currentPc.messages[toUser_id].length >= 50) currentPc.messages[toUser_id].shift();

            currentPc.messages[toUser_id].push(new Message(this.fullName, description, new Date()));
        }

        MessX.refreshMessages();
        
        if (toUser_id !== shared.activeApartment.pc.user.id) return;
        
        const messageEl = document.createElement("message-component");
        messageEl.innerHTML = /*html*/`
            <h3 slot="name">${this.fullName}</h3>
            <p>${description}</p>
        `;
        App.screen.append(messageEl);

        if (isInteracted) {
            const notificationSound = new Audio("./sounds/Notification.mp3");
            notificationSound.volume = 1;
            notificationSound.play();
        }
    }
}