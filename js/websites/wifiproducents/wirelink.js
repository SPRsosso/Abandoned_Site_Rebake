class WireLink {
    static ip = wifiCompanies[5].adminPanelIp;
    static dns = wifiCompanies[5].adminPanelIp;
    static port = 1005;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[5].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[5].name} Admin Panel</h3>
            </nav>
            <div class="main">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="">Log in</button>
            </div>
        </div>
    `;
}