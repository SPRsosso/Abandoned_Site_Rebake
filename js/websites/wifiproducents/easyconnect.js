class EasyConnect {
    static ip = wifiCompanies[2].adminPanelIp;
    static dns = wifiCompanies[2].adminPanelIp;
    static port = 1002;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[2].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[2].name} Admin Panel</h3>
            </nav>
            <div class="main">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="">Log in</button>
            </div>
        </div>
    `;
}