class Mywifi extends AdminPanel {
    static ip = wifiCompanies[4].adminPanelIp;
    static dns = wifiCompanies[4].adminPanelIp;
    static port = null;
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
            <div class="main" onload="Mywifi.keydownLogin(this)">
                <input type="text" placeholder="Nickname...">
                <input type="password" placeholder="Password...">
                <button onclick="Mywifi.login(this)">Log in</button>
                <p id="err"></p>
            </div>
        </div>
    `;
}