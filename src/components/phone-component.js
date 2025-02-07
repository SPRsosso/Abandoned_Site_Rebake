const { PhoneApp } = await import("../models/phone/phoneapp.js");
export class PhoneComponent extends HTMLElement {
    shadow;
    barHeight = 50;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #phone {
                    width: 300px;
                    aspect-ratio: 9 / 16;

                    border: 1px solid var(--accent-color);
                    border-radius: 10px;

                    background-color: var(--bg-color);
                
                    position: relative;
                }

                #bar {
                    width: 100%;
                    height: ${this.barHeight}px;

                    position: absolute;
                    bottom: 0;
                    left: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #close-btn {
                    width: 40px;
                    height: 40px;

                    background-color: var(--bg-color);
                    border: 1px solid var(--accent-color);
                    border-radius: 50%;
                }

                #close-btn:hover {
                    background-color: var(--accent-color-faded);

                    cursor: pointer;
                }

                #app-grid {
                    width: 100%;

                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));

                    overflow-y: auto;
                }
            </style>
            <div id="phone">
                <div id="app-grid">

                </div>
                <div id="bar">
                    <button id="close-btn"></button>
                </div>
            </div>
        `;
        PhoneApp.screen = this.shadow.querySelector("#phone");
        PhoneApp.screen.querySelector("#close-btn")?.addEventListener("click", PhoneApp.closeAllApps);
        let time = 300;
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i))
            time = 500;
        setTimeout(() => {
            PhoneApp.showAppIcons(this.shadow.host);
        }, time);
    }
}
customElements.define("phone-component", PhoneComponent);
