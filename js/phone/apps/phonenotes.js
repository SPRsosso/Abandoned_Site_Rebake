class PhoneNotes extends PhoneApp {
    static notes = [];
    constructor(window) {
        super();

        this.window = window;
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <link rel="stylesheet" href="./styles/phonenotes.css">

            <span slot="name">Notes</span>
            <div id="notes">
                <nav>
                    <button id="new">New</button>
                    <button id="open">Open</button>
                    <button id="save">Save</button>
                </nav>
                <div class="body">
                    <input type="text" placeholder="Note title..." class="note-title">
                    <textarea class="note-content" placeholder="Note content..."></textarea>
                </div>
            </div>
        `;

        const noteContent = appComponent.querySelector(".note-content");
        const noteTitle = appComponent.querySelector(".note-title");
        appComponent.querySelector("#new").addEventListener("click", () => {
            noteTitle.value = "";
            noteContent.value = "";
        });

        const openBtn = appComponent.querySelector("#open")
        openBtn.addEventListener("click", async () => {
            const dropdowns = document.querySelectorAll(".dropdown");
            if (dropdowns.length) return;

            await wait(10);

            const div = document.createElement("div");
            div.classList.add("dropdown");
            div.style.cssText = /*style*/`
                position: absolute;
                top: ${openBtn.getBoundingClientRect().bottom}px;
                left: ${openBtn.getBoundingClientRect().left + openBtn.offsetWidth / 2}px;
                transform: translateX(-50%);
                min-height: 10px;
                width: 100px;

                display: flex;
                flex-direction: column;

                border: 1px solid var(--accent-color);
                background: var(--bg-color);
                z-index: 100001;
            `;

            this.notes.forEach(note => {
                const button = document.createElement("button");
                button.innerHTML = note.title;

                button.addEventListener("click", () => {
                    noteTitle.value = note.title;
                    noteContent.value = note.content;
                });

                div.appendChild(button);
            });

            document.body.append(div);
        });

        appComponent.querySelector("#save").addEventListener("click", () => {
            this.notes.push(new Note(noteTitle.value, noteContent.value));
        });

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneNotes(appComponent));
    }
}