addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.remove();
    });
});

addEventListener("mousedown", () => {
    isInteracted = true;
});