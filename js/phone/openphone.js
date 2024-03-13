const openPhone = document.querySelector("#open-phone")

openPhone.addEventListener("click", () => {
    const phone = document.querySelector("phone-component");
    phone.classList.toggle("open");
    
    if (phone.classList.contains("open"))
        openPhone.querySelector("img").src = "./icons/ClosePhone.png";
    else {
        phone.classList.toggle("close");
        openPhone.querySelector("img").src = "./icons/OpenPhone.png";
    }
});