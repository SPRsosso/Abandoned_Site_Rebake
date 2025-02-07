export class MessageComponent extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                :host {
                    position: absolute;
                    bottom: 65px;
                    right: 0;
                    
                    translate: 100% 0;

                    animation: slideIn forwards 0.5s;

                    z-index: 9999;
                }

                .message {
                    width: 350px;
                    min-height: max-content;
                    background-color: var(--bg-color);
                    border: 1px solid var(--accent-color);
                    padding: 10px;
                }

                .message .line {
                    width: 100%;
                    height: 1px;
                    background-color: var(--accent-color);
                    margin: 5px 0;
                }
            </style>
            <div class="message">
                <slot name="name"></slot>
                <div class="line"></div>
                <slot></slot>
            </div>
        `;
        setTimeout(() => {
            setTimeout(() => {
                this.shadow.host.remove();
            }, 500);
        }, 5000);
    }
}
customElements.define("message-component", MessageComponent);
