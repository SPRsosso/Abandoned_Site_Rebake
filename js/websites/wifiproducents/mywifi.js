class Mywifi {
    static ip = wifiCompanies[4].adminPanelIp;
    static dns = wifiCompanies[4].adminPanelIp;
    static port = 1004;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[4].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[4].name} Admin Panel</h3>
            </nav>
            <div class="main">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="">Log in</button>
            </div>
        </div>
    `;
}