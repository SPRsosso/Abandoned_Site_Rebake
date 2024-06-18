class Notepad extends App {
    constructor(window) {
        super();

        this.window = window;
    }

    static openApp(file = null) {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <link rel="stylesheet" href="./styles/notepad.css">
            <span id="title" slot="name">Notepad</span>
            <div id="notepad">
                <textarea id="content"></textarea>
            </div>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const notepad = new Notepad(appComponent);
        openedApps.push(notepad);

        const contentEl = appComponent.querySelector("#content")
        contentEl.addEventListener("keydown", function( e ) {
            if (e.key == 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                this.value = this.value.substring(0, start) +
                  "\t" + this.value.substring(end);
                
                this.selectionStart =
                  this.selectionEnd = start + 1;
              }
        });

        if (!file) return;

        appComponent.querySelector("#title").innerText = `Editing ${file.name} file...`;
        contentEl.innerHTML = file.content.replace(/\n/g, '\n');;

        contentEl.addEventListener("input", ( e ) => {
            file.content = contentEl.value;
        });
    }
}