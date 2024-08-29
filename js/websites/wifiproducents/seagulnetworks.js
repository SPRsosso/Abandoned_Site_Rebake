class SeagulNetworks {
    static ip = wifiCompanies[3].adminPanelIp;
    static dns = wifiCompanies[3].adminPanelIp;
    static port = 1003;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[3].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[3].name} Admin Panel</h3>
            </nav>
            <div class="main">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="">Log in</button>
            </div>
        </div>
    `;
}