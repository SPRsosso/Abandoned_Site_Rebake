// Apartment
Apartment.activeApartment = apartments[0];
Apartment.activeApartment.pc.on = true;
Apartment.activeApartment.pc.loggedIn = true;

// Downloaded apps
Apartment.activeApartment.pc.downloadedApps = {
    CMD,
    FileExplorer,
    Calculator,
    MessX,
    Browser,
    Notepad,
    WiTracker,
    HomeDefence,
    HashMap,
    Personide,
}

// True setup
// Apartment.activeApartment.router.connectedWifi = null;
// Apartment.activeApartment.pc.os.system = null;
// Apartment.activeApartment.pc.os.version = null;

const routers = Apartment.activeApartment.routers;

document.querySelector("sticky-note").innerHTML = `<p style="color: black;">Wifi: ${ Apartment.activeApartment.wifis[0].name }<br>Pwd: ${ Apartment.activeApartment.wifis[0].password }</p>`;

if (Apartment.activeApartment.pc.on) {
    openComputer();
}
