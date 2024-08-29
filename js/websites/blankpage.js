class BlankPage {
    static ip = "1.0.0.0";
    static dns = "";
    static port = 0;
    static site = /*html*/`
        <style>
            .center {
                width: 100%;
                height: 100%;

                display: block;
                text-align: center;
                align-content: center;
            }
        </style>
        <div class="center">
            <div>
                <h3>Welcome!</h3>
                <p>
                    You can check the internet here, <br>
                    Just type the link in *Link...* input, and you are done
                </p>
            </div>

        </div>
    `;
}