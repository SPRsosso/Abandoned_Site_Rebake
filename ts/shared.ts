import { Apartment } from "./models/apartment.js";

class Shared {
    activeApartment!: Apartment;
}

export const shared = new Shared();