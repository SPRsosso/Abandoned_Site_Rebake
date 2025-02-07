export class Logger {
    static error(app, err) {
        const mainScreen = app?.querySelector("#cmd");
        if (!mainScreen)
            return;
        mainScreen.innerHTML += `<span class="alert">${err}</span>`;
        mainScreen.scrollTop = mainScreen.scrollHeight;
    }
    static log(app, text) {
        const mainScreen = app?.querySelector("#cmd");
        if (!mainScreen)
            return;
        mainScreen.innerHTML += `<span class="log">${text}</span>`;
        mainScreen.scrollTop = mainScreen.scrollHeight;
    }
    static slog(app) {
        const mainScreen = app?.querySelector("#cmd");
        if (!mainScreen)
            return;
        const span = document.createElement("span");
        span.classList.add("log", "can-copy");
        function copy(e) {
            e.preventDefault();
            e.clipboardData?.clearData("text/plain");
            e.clipboardData?.setData('text/plain', span.innerText);
        }
        span.addEventListener('copy', copy);
        mainScreen.append(span);
        mainScreen.scrollTop = mainScreen.scrollHeight;
        return span;
    }
    static inlog(app, element, text) {
        const mainScreen = app?.querySelector("#cmd");
        if (!mainScreen)
            return;
        element.innerHTML += text;
        mainScreen.scrollTop = mainScreen.scrollHeight;
    }
}
