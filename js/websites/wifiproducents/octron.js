class Octron extends AdminPanel {
    static ip = wifiCompanies[1].adminPanelIp;
    static dns = wifiCompanies[1].adminPanelIp;
    static port = null;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[1].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[1].name} Admin Panel</h3>
            </nav>
            <div class="main" onload="Octron.keydownLogin(this)">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="Octron.login(this)">Log in</button>
                <p id="err"></p>
            </div>
        </div>
    `;
}