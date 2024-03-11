const wifis = [];
const wifiCount = 10;
for (let i = 0; i < wifiCount; i++)
    wifis.push(new Wifi());

for (let i = 0; i < wifiCount; i++)
    wifis[i].changeStrength(Apartment.activeApartment.router.strength);

document.querySelector("sticky-note").innerHTML = `<p style="color: black;">Wifi: ${ wifis[0].name }<br>Pwd: ${ wifis[0].password }</p>`;