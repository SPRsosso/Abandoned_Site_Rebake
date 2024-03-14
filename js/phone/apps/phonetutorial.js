class PhoneTutorial extends PhoneApp {
    constructor(window) {
        super();
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = `
            <style>
                ${styles}

                #main-tutorial p {
                    padding: 0;
                    margin: 0;

                    margin-bottom: 30px;
                }

                #main-tutorial h3 {
                    padding: 0;
                    margin: 0;
                    margin-bottom: 5px;
                }

                #main-tutorial {
                    padding: 10px;
                }
            </style>
            <span slot="name">Tutorial</span>
            <div id="main-tutorial">
                <h3>USB port connector</h3>
                <p>It's located on right side of your monitor, you can plug USB devices into it, such as Pendrive</p>
                
                <h3>Pendrive</h3>
                <p>It is used to crack into PCs, you can download additional program that will help you with hacking PCs</p>

                <h3>Console</h3>
                <p>You can do many things using this powerful app, you can change user name, break wifis, connect into wifis, open apps, delete or create files</p>

                <h3>WiTracker</h3>
                <p>PC app that you can track Wifis nearby: getting their name, strength and connected PCs</p>

                <h3>Home Defence</h3>
                <p>PC app that gets your apartment, checks your router stability and allows you to change routers remotely</p>

                <h3># Map</h3>
                <p>Allows you to download program onto Pendrives</p>
            <div>
        `;

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneTutorial(appComponent));
    }
}