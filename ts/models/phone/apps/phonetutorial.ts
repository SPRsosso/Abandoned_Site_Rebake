import { PhoneAppComponent } from "../../../components/phone-app-component.js";
import { PhoneApp } from "../phoneapp.js";
import { openedPhoneApps, phoneApps } from "../phoneapps.js";
import { tutorialAppsAndComponents } from "./tutorial-components/tutorialapps.js";
import { tutorialCommands } from "./tutorial-components/tutorialcommands.js";

export class PhoneTutorial extends PhoneApp {
    constructor(window: PhoneAppComponent) {
        super(window);
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component") as PhoneAppComponent;
        appComponent.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
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

        appComponent.querySelector("#apps-components-btn")!.addEventListener("click", () => {
            this.changeTutorial(appComponent, tutorialAppsAndComponents);
        });

        appComponent.querySelector("#commands-btn")!.addEventListener("click", () => {
            this.changeTutorial(appComponent, tutorialCommands);
        });

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneTutorial(appComponent));
    }

    static changeTutorial(app: PhoneAppComponent, tutorial: string) {
        const content = app.querySelector("#content");
        if (!content) return;

        content.innerHTML = tutorial;
    }
}