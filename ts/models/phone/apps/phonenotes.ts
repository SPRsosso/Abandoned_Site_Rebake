import { PhoneAppComponent } from "../../../components/phone-app-component.js";
import { Note } from "../../note.js";
import { PhoneApp } from "../phoneapp.js";
import { openedPhoneApps } from "../phoneapps.js";

export class PhoneNotes extends PhoneApp {
    static notes: Note[] = [];
    constructor(window: PhoneAppComponent) {
        super(window);
    }

    static openApp() {
        const appComponent = document.createElement("phone-app-component") as PhoneAppComponent;
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

        const noteTitle = appComponent.querySelector(".note-title") as HTMLInputElement;
        const noteContent = appComponent.querySelector(".note-content") as HTMLInputElement;
        appComponent.querySelector("#new")!.addEventListener("click", () => {
            noteTitle.value = "";
            noteContent.value = "";
        });

        let div = document.createElement("div");

        const openBtn = appComponent.querySelector("#open") as HTMLElement;
        appComponent.addEventListener("click", async ( e: MouseEvent ) => {
            if ((e.target as HTMLElement).id === "open") {
                const dropdowns = document.querySelectorAll(".dropdown");
                if (dropdowns.length) return;
    
                div = document.createElement("div");
                
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
    
                this.notes.forEach((note: Note) => {
                    const button = document.createElement("button");
                    button.innerHTML = note.title;
    
                    button.addEventListener("click", () => {
                        noteTitle.value = note.title;
                        noteContent.value = note.content;
                    });
    
                    div.appendChild(button);
                });
    
                document.body.append(div);
            } else {
                div.remove();
            }
        });

        appComponent.querySelector("#save")!.addEventListener("click", () => {
            this.notes.push(new Note(noteTitle.value, noteContent.value));
        });

        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneNotes(appComponent));
    }
}