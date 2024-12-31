function browserObserver(mutations) {
    for (const mutation of mutations) {
        for (let addedNode of mutation.addedNodes) {
            if (addedNode.tagName?.toLowerCase() !== "site-component") continue;

            const main = addedNode.querySelector(".main");
            if (main?.classList?.contains("admin-panel")) {
                websites[main.getAttribute("data-panel")].keydownLogin(main);
            }
        }
    }
}