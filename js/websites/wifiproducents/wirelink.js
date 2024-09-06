class WireLink extends AdminPanel {
    static ip = wifiCompanies[5].adminPanelIp;
    static dns = wifiCompanies[5].adminPanelIp;
    static port = null;
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
            <div class="main" onload="WireLink.keydownLogin(this)">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="WireLink.login(this)">Log in</button>
                <p id="err"></p>
            </div>
        </div>
    `;
}