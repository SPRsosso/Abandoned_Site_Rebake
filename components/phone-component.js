class PhoneComponent extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.barHeight = 50;
        this.shadow.innerHTML = /*html*/`
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
                    <button onclick="PhoneApp.closeAllApps()" id="close-btn"></button>
                </div>
            </div>
        `;
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
            PhoneApp.showAppIcons(this.shadow);
        }, time);
    }
}

customElements.define("phone-component", PhoneComponent);