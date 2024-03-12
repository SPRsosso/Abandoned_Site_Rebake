class HashMap extends App {
    constructor() {
        super();
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = `
            <span slot="name"># Map</span>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        openedApps.push(new App(appComponent));
    }
}