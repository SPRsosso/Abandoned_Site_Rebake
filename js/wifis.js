const wifis = [];
const wifiCount = 10;
for (let i = 0; i < wifiCount; i++)
    wifis.push(new Wifi());

for (let i = 0; i < wifiCount; i++)
    wifis[i].changeStrength(HomeDefence.router.pos);