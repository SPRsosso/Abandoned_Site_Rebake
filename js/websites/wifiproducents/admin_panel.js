class AdminPanel {
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

    static login(btnEl) {
        const main = btnEl.parentElement;

        const elements = main.querySelectorAll("input");
        const nicknameEl = elements[0];
        const passwordEl = elements[1];
        const errEl = main.querySelector("#err");

        if (!wifiCompanies.find(company => company.adminPanelNickname === nicknameEl.value)
            ||
            passwordEl.value !== Apartment.activeApartment.router.connectedWifi.adminPanelPassword) {

            errEl.innerHTML = "Nickname or password is incorrect!";
            return;
        }

        var new_element = main.cloneNode(true);
        main.parentNode.replaceChild(new_element, main);

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
    }

    static keydownLogin(obj) {
        console.log("loaded!");
        let keyPushed = false;
        obj.addEventListener("keydown", (e) => {
            if (e.keyCode !== 13 || keyPushed) return;

            keyPushed = true;

            const button = obj.querySelector("button");
            console.log(button);
            this.login(button);
        });

        obj.addEventListener("keyup", (e) => {
            if (e.keyCode !== 13) return;
            
            keyPushed = false;
        });
    }
}