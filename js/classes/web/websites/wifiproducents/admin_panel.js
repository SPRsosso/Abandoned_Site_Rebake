class AdminPanel extends Website {
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3 class="title"></h3>
            </nav>
            <div class="main admin-panel" data-panel="Netfinity">
                <input id="nickname" type="text" placeholder="Nickname...">
                <input id="password" type="password" placeholder="Password...">
                <button class="admin-login-btn">Log in</button>
                <p class="error"></p>
            </div>
        </div>
    `;

    static GET(path, browser, apartment = Apartment.activeApartment) {
        if (apartment.router.connectedWifi.company.name.replaceAll(" ", "") !== this.name) {
            return { status: Web.Status.Error };
        }
        
        const baseSite = document.createElement("div");
        baseSite.innerHTML = this.site;

        switch(path) {
            case "":
                baseSite.querySelector(".title").innerHTML = `${this.name} Admin Panel`;
                const loginBtn = baseSite.querySelector(".admin-login-btn");

                baseSite.querySelector(".main").addEventListener("keydown", ( e ) => {
                    if (e.keyCode !== 13 || loginBtn.classList.contains("inactive")) {
                        return;
                    }
                    this.login(loginBtn, browser, apartment);
                });
                loginBtn.addEventListener("click", () => {
                    if (loginBtn.classList.contains("inactive")) {
                        return;
                    }
                    this.login(loginBtn, browser, apartment);
                });
            
                return { siteFragment: baseSite.innerHTML, site: baseSite, status: Web.Status.OK };
            
            default:
                return { status: Web.Status.Error };
        }
    }

    static POST(data, browser, apartment = Apartment.activeApartment) {
        switch(data.type) {
            case "login":
                if (apartment.router.connectedWifi.company.adminPanelNickname !== data.nickname || apartment.router.connectedWifi.adminPanelPassword !== data.password) {
                    return new Packet(Web.Status.Error, null, "Wrong nickname or password");
                }

                const main = data.element.querySelector(".main");
                const connectedPCs = AdminPanel.getConnectedPCs();
                let connectedPCsList = "";
                connectedPCs.connectedIPs.forEach(connectedIP => {
                    connectedPCsList += `<li>${connectedIP}</li>`
                });
                main.innerHTML = /*html*/`
                    <p>Current PC: ${connectedPCs.currentIp}</p>
                    <p>Connected PCs:</p>
                    <ul>
                        ${connectedPCsList}
                    </ul>
                `;
                main.classList.add("pcs");
        
                var new_element = main.cloneNode(true);
                main.parentNode.replaceChild(new_element, main);

                return new Packet(Web.Status.OK, null, "Successfully logged in");
                
                break;
        }
    }

    static getConnectedPCs(apartment = Apartment.activeApartment) {
        const connectedIPs = [];
        apartments.forEach(tApartment => {
            if (tApartment.router.connectedWifi.ip === apartment.router.connectedWifi.ip)
                connectedIPs.push(tApartment.pc.ip);
        });

        return {
            currentIp: apartment.pc.ip,
            connectedIPs: connectedIPs,
        }
    }

    static async login(element, browser, apartment = Apartment.activeApartment) {
        const main = getParentById("wifiproducents", element);

        const nickname = main.querySelector("#nickname").value;
        const password = main.querySelector("#password").value;
        const errorEl = main.querySelector(".error");

        element.classList.add("inactive");
        
        const post = await Web.POST(browser.port, {
            type: "login",
            element: main,
            nickname,
            password,
        }, browser, apartment);
        
        element.classList.remove("inactive");

        if (post.status === Web.Status.Error) {
            errorEl.innerHTML = post.message;
            return;
        }
    }

    static keydownLogin(obj) {
        let keyPushed = false;
        obj.addEventListener("keydown", (e) => {
            if (e.keyCode !== 13 || keyPushed) return;

            keyPushed = true;

            const button = obj.querySelector("button");
            this.login(button);
        });

        obj.addEventListener("keyup", (e) => {
            if (e.keyCode !== 13) return;
            
            keyPushed = false;
        });
    }
}