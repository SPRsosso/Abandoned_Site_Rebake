class User {
    constructor(name, surname, age, home, job, phoneNumber, id, email) {
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

    static getById(userId) {
        return apartments.find(apartment => apartment.pc.user.id === userId)?.pc.user;
    }

    sendMessage(toUser_id, description) {
        const pc = PC.getByUser(toUser_id);

        let userInsideMessages = pc.messages[this.id];
        const message = new Message(this.fullName, description, new Date());
        if (userInsideMessages) {
            userInsideMessages.push(message);
        } else {
            pc.messages[this.id] = [];
            pc.messages[this.id].push(message);
        }
        
        const messageEl = document.createElement("message-component");
        messageEl.innerHTML = /*html*/`
            <h3 slot="name">${this.fullName}</h3>
            <p>${description}</p>
        `;
        App.screen.append(messageEl);
    }
}