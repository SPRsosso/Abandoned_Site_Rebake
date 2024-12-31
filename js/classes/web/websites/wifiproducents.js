class Wifiproducents extends Website {
    static ip = "198.32.15.143";
    static dns = "wifiproducents.com";
    static info = {
        state: "public"
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>Wifi producent list</h3>
            </nav>
            <div class="main">
                <ul>
                    <li>Company name - Admin panel IP - Admin panel nickname</li>
                    ${Wifiproducents.getProducentsList()}
                </ul>
            </div>
        </div>
    `;

    static getProducentsList() {
        let list = "";
        wifiCompanies.forEach(company => {
            list += `<li>${company.name} - ${company.adminPanelIp} - ${company.adminPanelNickname}</li>`;
        });
        
        return list;
    }
}