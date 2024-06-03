class PhoneTutorial extends PhoneApp {
    constructor(window) {
        super();
        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = /*html*/`
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

                #main-tutorial h2 {
                    margin: 20px 0;
                }
                
                #main-tutorial #navigation {
                    width: 100%;
                    height: 50px;

                    border-bottom: 1px solid var(--accent-color);

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                #main-tutorial #content {
                    width: 100%;
                    height: calc(100% - 50px);

                    padding: 10px;
                }

                #main-tutorial small {
                    color: gray;
                }
            </style>
            <span slot="name">Tutorial</span>
            <div id="main-tutorial">
                <div id="navigation">
                    <button id="apps-components-btn">Apps & Components</button>
                    <button id="commands-btn">Commands</button>
                </div>
                <div id="content">
                    ${tutorialAppsAndComponents}
                </div>
            <div>
        `;

        appComponent.querySelector("#apps-components-btn").addEventListener("click", () => {
            this.changeTutorial(appComponent, tutorialAppsAndComponents);
        });

        appComponent.querySelector("#commands-btn").addEventListener("click", () => {
            this.changeTutorial(appComponent, tutorialCommands);
        });

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneTutorial(appComponent));
    }

    static changeTutorial(app, tutorial) {
        app.querySelector("#content").innerHTML = tutorial;
    }
}