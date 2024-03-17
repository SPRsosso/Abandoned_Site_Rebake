class FileExplorer extends App {
    constructor(window) {
        super();
        this.window = window;

        this.currentFolderIndex = 0;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = `
            <style>
                #file-explorer {
                    width: 100%;
                    height: 100%;

                    overflow-y: auto;

                    display: flex;
                    flex-direction: column;
                }

                #file-explorer #folder-options {
                    padding: 10px;
                    border-bottom: 1px solid var(--accent-color);
                    
                    display: flex;
                    gap: 10px;
                }

                #file-explorer button {
                    background-color: var(--bg-color);
                    border: 1px solid var(--accent-color);

                    width: 20px;
                    height: 20px;
                    padding: 2px;
                    margin: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    cursor: pointer;
                }

                #file-explorer button:hover {
                    background-color: var(--bg-color-faded);
                }

                #file-explorer button img {
                    width: 90%;
                }

                #file-explorer ul {
                    list-style-type: none;
                    margin: 0;
                    padding: 20px;
                }

                #file-explorer ul li {
                    width: 100%;

                    padding: 5px;

                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                #file-explorer ul li:hover {
                    background-color: var(--bg-color-faded);
                    cursor: pointer;
                }

                #file-explorer ul li img {
                    width: 20px;
                    height: 20px;
                }

                #file-explorer .disabled {
                    background-color: var(--bg-color-faded);
                    cursor: default;
                }
            </style>
            <span slot="name">File Explorer</span>
            <div id="file-explorer">
                <div id="folder-options">
                    <button id="backward" class="disabled"><img src="./icons/LeftArrow.png"></button>
                    <button id="forward" class="disabled"><img src="./icons/RightArrow.png"></button>
                    <p id="directory">Documents/</p>
                </div>
                <div id="inside-folder">

                </div>
            </div>
        `;

        
        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const fileexplorer = new FileExplorer(appComponent);
        openedApps.push(fileexplorer);

        const backward = appComponent.querySelector("#backward");
        backward.addEventListener("click", () => {
            if (fileexplorer.currentFolderIndex > 0) {
                fileexplorer.currentFolderIndex--;
                fileexplorer.getInsideFolder(appComponent, Apartment.activeApartment.pc);

                //if (fileexplorer.currentFolderIndex == 0)
                //    backward.classList.add("disabled");
                
            } else {
                backward.classList.add("disabled");
            }
        });

        fileexplorer.getInsideFolder(appComponent, Apartment.activeApartment.pc);
    }

    getInsideFolder(app, pc) {
        const insideFolder = app.querySelector("#inside-folder");
        const directory = app.querySelector("#directory");
        let list = "<ul>";
        Object.keys(pc.get(this.currentFolderIndex)).forEach(( key ) => {
            if (key == "folder")
                list += `<li class="folder"><img src="./icons/Folder.png">${pc.get(this.currentFolderIndex)[key].name}</li>`;
            else if (key == "files")
                pc.get(this.currentFolderIndex)[key].forEach(( file ) => {
                    list += `<li><img src="./icons/File.png">${file.name}</li>`
                });
        });
        list += "</ul>";
        insideFolder.innerHTML = list;

        let dir = "Documents/";
        for (let i = 0; i <= this.currentFolderIndex; i++)
            dir += pc.get(i).name ? pc.get(i).name + "/" : "";
        directory.innerHTML = dir;

        insideFolder.querySelectorAll(".folder").forEach(folder => {
            folder.addEventListener("dblclick", () => {
                this.currentFolderIndex++;
                this.getInsideFolder(app, pc);
                app.querySelector("#backward").classList.remove("disabled");
            });
        });
    }
}
