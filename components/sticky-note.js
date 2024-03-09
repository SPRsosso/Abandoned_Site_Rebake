class StickyNote extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });

        this.shadow.innerHTML =  `
            <style>
                #sticky-note {
                    width: 150px;
                    aspect-ratio: 1;

                    background-color: yellow;
                    color: black;

                    transform: rotateZ(30deg);
                }
            </style>
            <div id="sticky-note">
                <slot></slot>
            </div>
        `;
    }

    connectedCallback() {
        setTimeout(() => {
            const main = document.querySelector("main");
            this.shadow.host.style.left = main.offsetLeft - 60 + "px";
            this.shadow.host.style.top = ( main.offsetTop + main.offsetHeight - 75 ) + "px";
            this.shadow.host.style.display = "block";
        }, 0);
    }
}

customElements.define("sticky-note", StickyNote);