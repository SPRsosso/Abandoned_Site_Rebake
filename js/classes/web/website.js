class Website {
    static ip = null;
    static dns = null;
    static info = {
        state: "public" | "private",
    };
    static site = /*html*/``;

    static GET(path, browser, apartment = Apartment.activeApartment) {
        const baseSite = document.createElement("div");
        baseSite.innerHTML = this.site;
        
        switch(path) {
            case "":
                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };
            default:
                return { status: Web.Status.ERROR };
        }
    }

    static POST(data, browser, apartment = Apartment.activeApartment) {
        switch(data.type) {
            case "login":
                const userLogin = Web.users.find(user => user.nickname === data.nickname && user.password === data.password);

                if (userLogin) {
                    const sessionID = Symbol("New session ID");
                    apartment.pc.browser.sessions.push(sessionID);
                    Web.sessions.push({ sessionID, userID: userLogin.id });

                    return new Packet(Web.Status.OK, null, "Successfully logged in");
                }
                
                return new Packet(Web.Status.Error, null, "Cannot log in to user " + data.nickname);

            case "logout":
                const loggedIn = Web.userLoggedIn(apartment.pc.browser.sessions);

                if (loggedIn) {
                    let sessionIDs = [];
                    Web.sessions = Web.sessions.filter(session => {
                        if (session.userID === loggedIn.id) sessionIDs.push(session.sessionID);
                        return session.userID !== loggedIn.id;
                    });

                    sessionIDs.forEach(sessionID => {
                        apartment.pc.browser.sessions = apartment.pc.browser.sessions.filter(session => {
                            return session != sessionID
                        });
                    });

                    return new Packet(Web.Status.OK, null, "Successfully logged out");
                }

                return new Packet(Web.Status.Error, null, "Something went wrong, cannot log out");

            case "register":
                const foundUser = Web.users.find(user => user.nickname === data.nickname);

                if (foundUser) {
                    return new Packet(Web.Status.Error, null, "Nickname already exists")
                }

                Web.users.push(new BrowserUser(Web.users[Web.users.length - 1].id + 1, data.nickname, data.password, data.name, data.surname, data.age));
                return new Packet(Web.Status.OK, null, "Successfully created " + data.nickname + " user");

            case "save":
                const currentUser = Web.userLoggedIn(apartment.pc.browser.sessions);

                if (!currentUser) {
                    return new Packet(Web.Status.Error, null, "Unexpected error");
                }

                currentUser.setAge(data.age);
                currentUser.setPassword(data.password);
                currentUser.setName(data.name);
                currentUser.setSurname(data.surname);
                currentUser.setResidence(data.residence);
                currentUser.setDescription(data.description);

                return new Packet(Web.Status.OK, null, "Successfully updated user");
            
            default:
                return new Packet(Web.Status.Error, null, "Unknown method");
        }
    }
}