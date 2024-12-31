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
    Canvas,
    WiTracker,
    HomeDefence,
    Personide,
}

// True setup
// Apartment.activeApartment.router.connectedWifi = null;
// Apartment.activeApartment.pc.os.system = null;
// Apartment.activeApartment.pc.os.version = null;

const routers = Apartment.activeApartment.routers;

let wifiIndex = 0;
Apartment.activeApartment.wifis.forEach(( wifi, index ) => {
    if (Apartment.activeApartment.wifis[wifiIndex].strength > wifi.strength) wifiIndex = index;
});
const worstWifi = Apartment.activeApartment.wifis[wifiIndex];

document.querySelector("sticky-note").innerHTML = `<p style="color: black;">Wifi: ${ worstWifi.name }<br>Pwd: ${ worstWifi.password }</p>`;

if (Apartment.activeApartment.pc.on) {
    openComputer();
}