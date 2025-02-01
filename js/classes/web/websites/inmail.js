class InMail extends Website {
    static ip = "102.99.10.255";
    static dns = "inmail.com";
    static info = {
        state: "public"
    };
    static site = /*html*/`
        <div id="inmail">
            <nav>
                <h3>In-Mail</h3>
                <div>
                    
                </div>
            </nav>
            <div class="main">
                
            </div>
        </div>
    `;

    static GET(path, browser, apartment = Apartment.activeApartment) {
        const baseSite = document.createElement("div");
        baseSite.innerHTML = this.site;

        const loggedIn = Web.userLoggedIn(apartment.pc.browser.sessions);
        
        if (!loggedIn) {
            
        } else {
            
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
}