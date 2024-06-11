const wifiCount = 10;
for (let i = 0; i < wifiCount; i++)
    wifis.push(new Wifi());

apartments.forEach(apartment => {
    apartment.wifis = wifis.map(a => Object.setPrototypeOf( Object.assign( {}, a ), Wifi.prototype ));

    for (let i = 0; i < wifiCount; i++) {
        apartment.wifis[i].changeStrength(apartment.router.strength);
    }
    
    apartment.router.connectedWifi = apartment.wifis[randomInt(0, wifiCount - 1)];
});

// console.log(apartments[1].router.connectedWifi.name, apartments[1].pc.ip);

// Apartment.activeApartment.router.connectedWifi = Apartment.activeApartment.wifis[randomInt(0, wifiCount - 1)];
document.querySelector("sticky-note").innerHTML = `<p style="color: black;">Wifi: ${ Apartment.activeApartment.router.connectedWifi.name }<br>Pwd: ${ Apartment.activeApartment.router.connectedWifi.password }</p>`;
