class MessX extends App {
    constructor(window) {
        super();
        this.window = window;
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
                    
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
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
                }

                #messx .name-date {
                    display: flex;
                    gap: 10px;
                }

                #messx .name-date small {
                    color: gray;
                }

                #messx .messages {
                    width: 100%;
                    height: calc(100% - 30px - 50px);
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

                #messx .textbox input {
                    flex-grow: 1;
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
                    <div class="textbox">
                        <input type="text">
                        <button class="send-btn">></button>
                    </div>
                </div>
            </div>
        `;

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

        const messages = Apartment.activeApartment.pc.messages;
        Object.keys(messages).forEach(key => {
            const div = document.createElement("div");
            div.classList.add("user");
            div.innerHTML = /*html*/`
                <img src="./icons/UserImage.png"> 
                <h4>${key}</h4>
            `;

            div.addEventListener("dblclick", () => {
                appComponent.querySelector(".menu-user-title").innerHTML = /*html*/`<h4>${key}</h4>`
                const messagesEl = appComponent.querySelector(".messages");
                
                messagesEl.innerHTML = "";
                console.log(messages[key]);
                messages[key].forEach(message => {
                    const month = '' + (message.date.getMonth() + 1);
                    const day = '' + message.date.getDate();
                    const year = message.date.getFullYear();
                    const hours = message.date.getHours();
                    const minutes = message.date.getMinutes();
                    const seconds = message.date.getSeconds();

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
                
                hideUsers();
            });

            usersDiv.append(div)
        });

        App.defaultValues(appComponent);
        this.screen.prepend(appComponent);
        const messx = new MessX(appComponent);
        openedApps.push(messx);
    }
}