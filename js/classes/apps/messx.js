class MessX extends App {
    constructor(window) {
        super();
        this.window = window;
        this.userId = null;
    }

    static openApp() {
        const appComponent = document.createElement("app-component");
        appComponent.innerHTML = /*html*/`
            <style>
                ${styles}

                #messx {
                    width: 100%;
                    height: 100%;

                    overflow: hidden;

                    position: relative;
                }

                #messx .menu {
                    width: 50px;
                    height: 100%;
                    padding: 5px;

                    background-color: var(--bg-color);

                    border-right: 1px solid var(--accent-color);

                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                }

                #messx .hamburger-btn, 
                #messx .close-btn {
                    width: 100%;
                    aspect-ratio: 1;

                    background: none;
                    border: none;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    cursor: pointer;
                }

                #messx button.inactive {
                    display: none;
                }

                #messx .hamburger-btn:hover, 
                #messx .close-btn:hover {
                    background-color: var(--accent-color-faded);
                }

                #messx .hamburger-btn img, 
                #messx .close-btn img {
                    width: 100%;
                }

                #messx .users {
                    width: 200px;
                    height: 100%;

                    background-color: var(--bg-color);

                    padding: 10px;

                    position: absolute;
                    left: -200px;

                    overflow-y: auto;
                    z-index: 1;
                }

                #messx .user {
                    padding: 5px;
                    width: 100%;
                    height: 40px;

                    display: flex;
                    align-items: center;
                    gap: 10px;

                    cursor: pointer;
                }

                #messx .user:hover {
                    background-color: var(--accent-color-faded);
                }

                #messx .user img {
                    height: 100%;
                }

                #messx .messages-holder {
                    width: calc(100% - 50px);
                    height: 100%;

                    float: right;
                }

                #messx .menu-user-title {
                    width: 100%;
                    height: 30px;
                    padding: 7px;

                    display: flex;
                    align-items: center;

                    border-bottom: 1px solid var(--accent-color);
                }

                #messx .messages {
                    padding: 10px;

                    width: 100%;
                    height: calc(100% - 30px - 50px);

                    overflow-y: auto;
                    
                    display: flex;
                    flex-direction: column;
                    gap: 20px;

                    position: relative;
                }

                #messx .message {
                    width: 100%;

                    display: flex;
                    gap: 10px;
                }

                #messx .message-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                #messx .message img {
                    width: 40px;
                    height: 40px;
                }

                #messx .name-date {
                    display: flex;
                    gap: 10px;
                }

                #messx .name-date small {
                    color: gray;
                }

                #messx .textbox {
                    width: 100%;
                    height: 50px;
                    padding: 10px;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                #messx .textbox.inactive {
                    display: none;
                }

                #messx .textbox input {
                    flex-grow: 1;
                }

                #messx .option-box {
                    width: 100%;
                    height: 40px;

                    display: flex;
                    gap: 30px;

                    padding: 0 20px;
                }

                #messx .option-box.inactive {
                    display: none;
                }
                
                #messx .option-box button {
                    flex: 1;
                }
            </style>
            <span slot="name">MessX</span>
            <div id="messx">
                <div class="users">
                    
                </div>
                <div class="menu">
                    <button class="hamburger-btn"><img src="./icons/Hamburger.png"></button>
                    <button class="close-btn inactive"><img src="./icons/CloseButton.png"></button>
                </div>
                <div class="messages-holder">
                    <div class="menu-user-title">

                    </div>
                    <div class="messages">

                    </div>
                    <div class="option-box inactive">

                    </div>
                    <div class="textbox inactive">
                        <input type="text" class="textInput">
                        <button class="send-btn">></button>
                    </div>
                </div>
            </div>
        `;

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const messx = new MessX(appComponent);
        openedApps.push(messx);

        const hamburgerBtn = appComponent.querySelector(".hamburger-btn");
        const closeBtn = appComponent.querySelector(".close-btn");
        const usersDiv = appComponent.querySelector(".users");
        const menuDiv = appComponent.querySelector(".menu");

        function showUsers() {
            hamburgerBtn.classList.add("inactive");
            closeBtn.classList.remove("inactive");

            menuDiv.animate([ { left: "0" }, { left: "200px" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
            usersDiv.animate([ { left: "-200px" }, { left: "0" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
        }
        hamburgerBtn.addEventListener("click", showUsers);

        function hideUsers() {
            closeBtn.classList.add("inactive");
            hamburgerBtn.classList.remove("inactive");

            menuDiv.animate([ { left: "200px" }, { left: "0" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
            usersDiv.animate([ { left: "0" }, { left: "-200px" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
        }
        closeBtn.addEventListener("click", hideUsers);

        MessX.refreshMessages();

        const sendBtn = appComponent.querySelector(".send-btn");
        const textInput = appComponent.querySelector(".textInput");

        sendBtn.addEventListener("click", () => {
            MessX.sendMessage(messx, textInput.value, textInput)
        });
        textInput.addEventListener("keypress", ( e ) => {
            if (e.keyCode === 13) MessX.sendMessage(messx, textInput.value, textInput);
        });
    }

    static refreshMessages() {
        openedApps.forEach(openedApp => {
            const appComponent = openedApp.window;

            const messx = appComponent.querySelector("#messx");
            if (!messx) return;
            
            function getMessages(messages) {
                messagesEl.innerHTML = "";
    
                messages.forEach(message => {
                    const month = (message.date.getMonth() + 1) < 10 ? "0" + (message.date.getMonth() + 1) : (message.date.getMonth() + 1).toString();
                    const day =  message.date.getDate() < 10 ? "0" + message.date.getDate() : message.date.getDate();
                    const year = message.date.getFullYear();
                    const hours = message.date.getHours() < 10 ? "0" + message.date.getHours() : message.date.getHours();
                    const minutes = message.date.getMinutes() < 10 ? "0" + message.date.getMinutes() : message.date.getMinutes();
                    const seconds = message.date.getSeconds() < 10 ? "0" + message.date.getSeconds() : message.date.getSeconds();
    
                    messagesEl.innerHTML += /*html*/`
                        <div class="message">
                            <img src="./icons/UserImage.png">
                            <div class="message-wrapper">
                                <div class="name-date">
                                    <h5>${message.user}</h5>
                                    <small>${day}.${month}.${year} ${hours}:${minutes}:${seconds}</small>
                                </div>
                                <div class="description">
                                    <p>${message.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
    
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            function hideUsers() {
                closeBtn.classList.add("inactive");
                hamburgerBtn.classList.remove("inactive");
    
                menuDiv.animate([ { left: "200px" }, { left: "0" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
                usersDiv.animate([ { left: "0" }, { left: "-200px" } ], { duration: 500, fill: "forwards", easing: "ease-out" });
            }

            const hamburgerBtn = appComponent.querySelector(".hamburger-btn");
            const closeBtn = appComponent.querySelector(".close-btn");
            const usersDiv = appComponent.querySelector(".users");
            const menuDiv = appComponent.querySelector(".menu");
            
            const messagesEl = appComponent.querySelector(".messages");
            const messages = Apartment.activeApartment.pc.messages;
            usersDiv.innerHTML = "";
            Object.keys(messages).forEach(key => {
                const div = document.createElement("div");
                div.classList.add("user");
                div.innerHTML = /*html*/`
                    <img src="./icons/UserImage.png"> 
                    <h4>${User.getById(key).fullName}</h4>
                `;

                div.addEventListener("dblclick", () => {
                    appComponent.querySelector(".menu-user-title").innerHTML = /*html*/`<h4>${User.getById(key).fullName}</h4>`

                    openedApp.userId = key;
                    MessX.refreshMessages();
                    
                    hideUsers();

                    appComponent.querySelector(".textbox").classList.remove("inactive");
                });

                usersDiv.append(div)
            });

            messagesEl.style.height = "calc(100% - 30px - 50px)";
            const optionBox = appComponent.querySelector(".option-box");
            if (anonymousUserChooseOptions && openedApp.userId === "0") {
                optionBox.classList.remove("inactive");
                optionBox.innerHTML = "";

                messagesEl.style.height = `${messagesEl.offsetHeight - 40}px`;

                anonymousUserChooseOptions.forEach(option => {
                    const button = document.createElement("button");
                    button.classList.add("option");
                    button.innerHTML = option;

                    button.addEventListener("click", () => {
                        anonymousUserChooseOptions = null;
                        messagesEl.style.height = `${messagesEl.offsetHeight + 40}px`;
                        optionBox.classList.add("inactive");

                        sendToAnonymousUser(option);

                        MessX.sendMessage(openedApp, option);
                    });

                    optionBox.appendChild(button);
                });
            }

            if (openedApp.userId) {
                getMessages(messages[openedApp.userId]);
            }

            if (!anonymousUserChooseOptions) optionBox.classList.add("inactive");
        });
    }

    static sendMessage(messx, description, textInput = null) {
        const user = Apartment.activeApartment.pc.user;
        user.sendMessage(messx.userId, description);

        MessX.refreshMessages();

        if (textInput) textInput.value = "";
    }
}