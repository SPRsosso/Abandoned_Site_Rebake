class PhoneTutorial extends PhoneApp {
    constructor(window) {
        super();
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = `
            <span slot="name">Tutorial</span>
        `;

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneApp(appComponent));
    }
}