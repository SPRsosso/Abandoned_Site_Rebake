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