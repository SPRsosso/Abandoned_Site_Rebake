class Netfinity extends AdminPanel {
    static ip = wifiCompanies[0].adminPanelIp;
    static dns = wifiCompanies[0].adminPanelIp;
    static port = 1000;
    static info = {
        state: "private",
        access: "wificompany",
        company: wifiCompanies[0].name,
    };
    static site = /*html*/`
        <link rel="stylesheet" href="./styles/websites/wifiproducents.css">
        <div id="wifiproducents">
            <nav>
                <h3>${wifiCompanies[0].name} Admin Panel</h3>
            </nav>
            <div class="main">
                <input type="text" id="nickname" placeholder="Nickname...">
                <input type="password" id="password" placeholder="Password...">
                <button onclick="Netfinity.login(this)">Log in</button>
                <p id="err"></p>
            </div>
        </div>
    `;
}