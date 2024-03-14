const openPhone = document.querySelector("#open-phone")

openPhone.addEventListener("click", () => {
    const phone = document.querySelector("phone-component");
    phone.classList.toggle("open");
    phone.classList.remove("close");
    
    if (phone.classList.contains("open"))
        openPhone.querySelector("img").src = "./icons/ClosePhone.png";
    else {
        phone.classList.add("close");
        openPhone.querySelector("img").src = "./icons/OpenPhone.png";
    }
});