class Perfit extends Website {
    static ip = "196.92.211.11";
    static dns = "perfit.com";
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

    static GET(path, browser, apartment = Apartment.activeApartment) {
        const baseSite = document.createElement("div");
        baseSite.innerHTML = Perfit.site;

        const loggedIn = Web.userLoggedIn(apartment.pc.browser.sessions);
        
        if (!loggedIn) {
            baseSite.querySelector(".main").innerHTML = /*html*/`
                <p>You need to log in to see other Fits</p>
            `;

            baseSite.querySelector("nav > div").innerHTML = /*html*/`
                <ul>
                    <li><button class="perfit-login">Log in</button></li>
                    <li><button class="perfit-register">Register</button></li>
                </ul>
            `;

            baseSite.querySelector(".perfit-login").addEventListener("click", () => {
                browser.browse(this.dns + "/login", apartment);
            });

            baseSite.querySelector(".perfit-register").addEventListener("click", () => {
                browser.browse(this.dns + "/register", apartment);
            });
        } else {
            baseSite.querySelector("nav > div").innerHTML = /*html*/`
                <ul>
                    <li><button class="perfit-logout">Log out</button></li>
                    <li><button class="perfit-settings">Settings</button></li>
                </ul>
            `;

            const logoutBtn = baseSite.querySelector(".perfit-logout");
            logoutBtn.addEventListener("click", ( e ) => {
                if (logoutBtn.classList.contains("inactive")) {
                    return;
                }
                Perfit.logout(logoutBtn, browser, apartment);
            });

            baseSite.querySelector(".perfit-settings").addEventListener("click", () => {
                browser.browse(this.dns + "/settings", apartment);
            });

            Perfit.showFits(baseSite);
        }

        switch (path) {
            case "":
                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };

            case "login":
                if (loggedIn) {
                    return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };
                }

                baseSite.querySelector(".main").innerHTML = /*html*/`
                    <div class="form">
                        <h3>Log in</h3>
                        <input id="nickname" type="text" placeholder="Nickname...">
                        <input id="password" type="password" placeholder="Password...">
                        <button class="perfit-login-btn">Log in</button>
                        <p class="error"></p>
                    </div>
                `;

                const formLogin = baseSite.querySelector(".form");
                const loginBtn = baseSite.querySelector(".perfit-login-btn");
                formLogin.addEventListener("keydown", function(e) {
                    if (loginBtn.classList.contains("inactive")) {
                        return;
                    }

                    if (e.keyCode === 13) Perfit.login(loginBtn, browser, apartment);
                });

                loginBtn.addEventListener("click", () => {
                    if (loginBtn.classList.contains("inactive")) {
                        return;
                    }

                    Perfit.login(loginBtn, browser, apartment);
                });

                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };

            case "register":
                baseSite.querySelector(".main").innerHTML = /*html*/`
                    <div class="form">
                        <h3>Register</h3>
                        <input id="nickname" type="text" placeholder="Nickname...">
                        <input id="password" type="password" placeholder="Password...">
                        <input id="name" type="text" placeholder="Name...">
                        <input id="surname" type="text" placeholder="Surname...">
                        <input id="age" type="number" min="1" max="120" placeholder="Age...">
                        <button class="perfit-register-btn">Register</button>
                        <p class="error"></p>
                    </div>
                `;

                const formRegister = baseSite.querySelector(".form");
                const registerBtn = baseSite.querySelector(".perfit-register-btn");
                formRegister.addEventListener("keydown", function(e) {
                    if (registerBtn.classList.contains("inactive")) {
                        return;
                    }

                    if (e.keyCode === 13) Perfit.register(registerBtn, browser, apartment);
                });

                registerBtn.addEventListener("click", () => {
                    if (registerBtn.classList.contains("inactive")) {
                        return;
                    }

                    Perfit.register(registerBtn, browser, apartment);
                });

                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };

            case "settings":
                if (!loggedIn) {
                    return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };
                }
                
                const main = baseSite.querySelector(".main");

                let residence = "";
                let description = "";
                if (loggedIn.residence) residence = loggedIn.residence;
                if (loggedIn.description) description = loggedIn.description;
                main.innerHTML = /*html*/`
                    <div class="settings">
                        <h3>Settings</h3>
                        <input id="password" type="password" placeholder="Password..." value="${loggedIn.password}">
                        <input id="name" type="text" placeholder="Name..." value="${loggedIn.name}">
                        <input id="surname" type="text" placeholder="Surname..." value="${loggedIn.surname}">
                        <input id="age" type="number" min="1" max="120" placeholder="Age..." value="${loggedIn.age}">
                        <input id="residence" type="text" placeholder="residence" value="${residence}">
                        <p>Description: </p>
                        <textarea id="description">${description}</textarea>
                        <div>
                            <button class="discard-perfit-btn">Discard changes</button>
                            <button class="save-perfit-btn">Save</button>
                        </div>
                        <p class="error"></p>
                    </div>
                `;

                const discardBtn = baseSite.querySelector(".discard-perfit-btn");
                const saveBtn = baseSite.querySelector(".save-perfit-btn");

                discardBtn.addEventListener("click", () => {
                    Perfit.discard(discardBtn, browser, apartment);
                });

                saveBtn.addEventListener("click", () => {
                    if (saveBtn.classList.contains("inactive")) {
                        return;
                    }

                    Perfit.save(saveBtn, browser, apartment);
                });
                
                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };

            default:
                return { status: Web.Status.Error };
        }
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

        Web.users.forEach(user => {
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

    static async login(element, browser, apartment = Apartment.activeApartment) {
        const perfit = getParentById("perfit", element);

        const errorEl = perfit.querySelector(".error");
        const nicknameEl = perfit.querySelector("#nickname");
        const passwordEl = perfit.querySelector("#password");
        if (nicknameEl.value.length === 0 || passwordEl.value.length === 0) {
            errorEl.innerHTML = "Fill all fields!";
            return;
        }

        
        element.classList.add("inactive");
        const post = await Web.POST(browser.port, { type: "login", nickname: nicknameEl.value, password: passwordEl.value }, browser, apartment);
        element.classList.remove("inactive");

        if (post.status === Web.Status.Error) {
            errorEl.innerHTML = post.message;
            return;
        }

        browser.browse(this.dns, apartment);
    }

    static async logout(element, browser, apartment = Apartment.activeApartment) {
        element.classList.add("inactive");
        const post = await Web.POST(browser.port, { type: "logout" }, browser, apartment);
        element.classList.remove("inactive");

        if (post.status === Web.Status.Error) {
            return;
        }

        browser.browse(this.dns, apartment);
    }

    static async register(element, browser, apartment = Apartment.activeApartment) {
        if (!Apartment.activeApartment.router.connectedWifi) return;

        const perfit = getParentById("perfit", element);
        const errorEl = perfit.querySelector(".error");
        const nickname = perfit.querySelector("#nickname").value;
        const password = perfit.querySelector("#password").value;
        const name = perfit.querySelector("#name").value;
        const surname = perfit.querySelector("#surname").value;
        const age = perfit.querySelector("#age").value;

        let errorMessage = "";

        if (password.length < 3) 
            errorMessage += "Password must be at least 3 characters long<br>";
        if (nickname.length === 0 || name.length === 0 || surname.legth === 0)
            errorMessage += "Every field must be filled<br>";
        if (age < 13)
            errorMessage += "You must be at least 13 years old to register";

        if (errorMessage.length > 0) {
            errorEl.innerHTML = errorMessage;
            return;
        }

        element.classList.add("inactive");
        const post = await Web.POST(browser.port, {
            type: "register",
            nickname,
            password,
            name,
            surname,
            age,
        }, browser, apartment);
        element.classList.remove("inactive");

        if (post.status === Web.Status.Error) {
            errorEl.innerHTML = post.message;
            return;
        }

        browser.browse(this.dns, apartment);
    }

    static save(element, browser, apartment = Apartment.activeApartment) {
        const perfit = getParentById("perfit", element);
        const errorEl = perfit.querySelector(".error");
        const password = perfit.querySelector("#password").value;
        const name = perfit.querySelector("#name").value;
        const surname = perfit.querySelector("#surname").value;
        const age = perfit.querySelector("#age").value;
        const residence = perfit.querySelector("#residence").value;
        const description = perfit.querySelector("#description").value;

        let errorMessage = "";

        if (password.length < 3) 
            errorMessage += "Password must be at least 3 characters long<br>";
        if (name.length === 0 || surname.legth === 0)
            errorMessage += "Every field must be filled<br>";
        if (age < 13)
            errorMessage += "You must be at least 13 years old to register";

        if (errorMessage.length > 0) {
            errorEl.innerHTML = errorMessage;
            return;
        }

        const post = Web.POST(browser.port, {
            type: "save",
            password,
            name,
            surname,
            age,
            residence,
            description,
        }, browser, apartment);

        if (post.status === Web.Status.Error) {
            errorEl.innerHTML = post.message;
            return;
        }

        browser.browse(this.dns, apartment);
    }
    
    static discard(element, browser, apartment = Apartment.activeApartment) {
        browser.browse(this.dns, apartment);
    }
}