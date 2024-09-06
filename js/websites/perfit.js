class Perfit {
    static ip = "196.92.211.11";
    static dns = "perfit.com";
    static port = null;
    static info = { 
        state: "public"
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/perfit.css">
        <div id="perfit">
            <nav>
                <h3>Perfit</h3>
                <div>
                    
                </div>
            </nav>
            <div class="main">
                
            </div>
        </div>
    `;

    static checkIfUserIsLogged(perfit) {
        if (!Apartment.activeApartment.router.connectedWifi) return;
        if (!perfit) return;

        const main = perfit.querySelector(".main");
        const nav = perfit.querySelector("nav > div");

        if (!Apartment.activeApartment.pc.browser.loggedAs) {
            main.innerHTML = /*html*/`
                <p>You need to log in to see other Fits</p>
            `
            nav.innerHTML = /*html*/`
                <ul>
                    <li><button onclick="Perfit.showLogin(this)">Log in</button></li>
                    <li><button onclick="Perfit.showRegister(this)">Register</button></li>
                </ul>
            `;
            return;
        }
        
        nav.innerHTML = /*html*/`
            <ul>
                <li><button onclick="Perfit.logout(this)">Log out</button></li>
                <li><button onclick="Perfit.showSettings(this)">Settings</button></li>
            </ul>
        `;
        Perfit.showFits(perfit);
    }

    static showLogin(element, err = "") {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);
        const main = perfit.querySelector(".main");

        main.innerHTML = /*html*/`
            <div class="form">
                <h3>Log in</h3>
                <input id="nickname" type="text" placeholder="Nickname...">
                <input id="password" type="password" placeholder="Password...">
                <button onclick="Perfit.login(this)">Log in</button>
                <p class="error">${err}</p>
            </div>
        `;

        const form = main.querySelector(".form");
        form.addEventListener("keydown", function(e) {
            if (e.keyCode === 13) Perfit.login(this);
        });
    }

    static showRegister(element, err = "") {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);
        const main = perfit.querySelector(".main");

        main.innerHTML = /*html*/`
            <div class="form">
                <h3>Register</h3>
                <input id="nickname" type="text" placeholder="Nickname...">
                <input id="password" type="password" placeholder="Password...">
                <input id="name" type="text" placeholder="Name...">
                <input id="surname" type="text" placeholder="Surname...">
                <input id="age" type="number" min="1" max="120" placeholder="Age...">
                <button onclick="Perfit.register(this)">Register</button>
                <p class="error">${err}</p>
            </div>
        `;

        const form = main.querySelector(".form");
        form.addEventListener("keydown", function(e) {
            if (e.keyCode === 13) Perfit.register(this);
        });
    }

    static showSettings(element, err = "") {
        if (!Apartment.activeApartment.router.connectedWifi) return;
        const perfit = getParentById("perfit", element);
        const main = perfit.querySelector(".main");

        const loggedUser = Apartment.activeApartment.pc.browser.loggedAs;

        let residence = "";
        let description = "";
        if (loggedUser.residence) residence = loggedUser.residence;
        if (loggedUser.description) description = loggedUser.description;
        main.innerHTML = /*html*/`
            <div class="settings">
                <h3>Settings</h3>
                <input id="password" type="password" placeholder="Password..." value="${loggedUser.password}">
                <input id="name" type="text" placeholder="Name..." value="${loggedUser.name}">
                <input id="surname" type="text" placeholder="Surname..." value="${loggedUser.surname}">
                <input id="age" type="number" min="1" max="120" placeholder="Age..." value="${loggedUser.age}">
                <input id="residence" type="text" placeholder="residence" value="${residence}">
                <p>Description: </p>
                <textarea id="description">${description}</textarea>
                <div>
                    <button onclick="Perfit.discard(this)">Discard changes</button>
                    <button onclick="Perfit.save(this)">Save</button>
                </div>
                <p class="error">${err}</p>
            </div>
        `;
    }

    static showFits(perfit) {
        const main = perfit.querySelector(".main");
        main.innerHTML = "";

        Browser.users.forEach(user => {
            const card = document.createElement("div");
            card.classList.add("card");

            let residence = "";
            let description = "";
            if (user.residence) residence = user.residence;
            if (user.description) description = user.description;

            card.innerHTML = /*html*/`
                <img src="./icons/UserImage.png">
                <div class="title">
                    <h3>${user.name} ${user.surname}</h3>
                    <small>${user.age}</small>
                    <small>${residence}</small>
                </div>
                <div class="description">
                    <p>${description}</p>
                </div>
            `;

            main.append(card);    
        });
    }

    static login(element) {
        if (!Apartment.activeApartment.router.connectedWifi) return;
        
        const perfit = getParentById("perfit", element);
        const nickname = perfit.querySelector("#nickname").value;
        const password = perfit.querySelector("#password").value;

        if (!Browser.login(nickname, password)) {
            Perfit.showLogin(element, "Wrong nickname or password!");
            return;
        }

        Perfit.checkIfUserIsLogged(perfit);
    }

    static logout(element) {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);

        Browser.logout();
        Perfit.checkIfUserIsLogged(perfit);
    }

    static register(element) {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);
        const nickname = perfit.querySelector("#nickname").value;
        const password = perfit.querySelector("#password").value;
        const name = perfit.querySelector("#name").value;
        const surname = perfit.querySelector("#surname").value;
        const age = perfit.querySelector("#age").value;

        if (!Browser.register(nickname, password, name, surname, age)) {
            Perfit.showRegister(element, "User is not available, password and nickname must be at least 3 characters long, and all fields must be at least 1 character long!");
            return;
        }

        Perfit.checkIfUserIsLogged(perfit);
    }

    static save(element) {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);
        const password = perfit.querySelector("#password").value;
        const name = perfit.querySelector("#name").value;
        const surname = perfit.querySelector("#surname").value;
        const age = perfit.querySelector("#age").value;
        const residence = perfit.querySelector("#residence").value;
        const description = perfit.querySelector("#description").value;

        if (!Browser.save(password, name, surname, age, residence, description)) {
            Perfit.showSettings(element, "Cannot change values, password must be at least 3 characters long, and all fields must be at least 1 character long!");
            return;
        }

        Perfit.checkIfUserIsLogged(perfit);
    }
    
    static discard(element) {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);

        Perfit.checkIfUserIsLogged(perfit);
    }
}