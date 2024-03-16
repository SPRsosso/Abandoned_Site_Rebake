const apartments = [];
debugger;

for (let i = 0; i < 15; i++) {
    let apartNum = i < 10 ? `30${i}` : `3${i}`;
    apartments.push(new Apartment(apartNum));
}

Apartment.activeApartment = apartments[0];