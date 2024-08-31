const apartments = [];

const apartmentCount = 50;
for (let i = 0; i < apartmentCount; i++) {
    let apartNum = i < 10 ? `30${i}` : `3${i}`;
  
    apartments.push(new Apartment("Chive Apartment", apartNum));
}