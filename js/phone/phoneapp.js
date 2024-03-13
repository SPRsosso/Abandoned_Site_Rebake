class PhoneApp {
    static screen = document.querySelector("phone-component").shadowRoot.querySelector("#phone");
    constructor(window) {
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = `
            <span slot="name">Default phone app ( not modded )</span>
        `;

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneApp(appComponent));
    }

    static showAppIcons(app) {
        const grid = app.querySelector("#app-grid");

        grid.innerHTML = "";
        Object.keys(phoneApps).forEach(phoneApp => {
            grid.innerHTML += `<phone-app-icon icon-path="./icons/${phoneApp}.png" app-name="${phoneApp}"></phone-app-icon>`;
        });
    }

    static closeAllApps() {
        while (openedPhoneApps[0]) {
            openedPhoneApps[0].window.remove();
            openedPhoneApps.shift();
        }
    }
}