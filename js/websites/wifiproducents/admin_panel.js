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

        const nicknameEl = main.querySelector("#nickname");
        const passwordEl = main.querySelector("#password");
        const errEl = main.querySelector("#err");

        console.log(this.name);

        if (nicknameEl.value !== wifiCompanies.find(company => company.name === this.name).adminPanelNickname 
            ||
            passwordEl.value !== Apartment.activeApartment.router.connectedWifi.adminPanelPassword) {
            
            errEl.innerHTML = "Nickname or password is incorrect!";
            return;
        }

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
}