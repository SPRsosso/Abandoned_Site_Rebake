class AdminPanel {
    static getConnectedPCs(apartment = Apartment.activeApartment) {
        const connectedIPs = [];
        apartments.forEach(apartment => {
            if (apartment.router.connectedWifi.ip === apartment.router.connectedWifi.ip)
                connectedIPs.push(apartment.pc.ip);
        });

        return {
            currentIp: apartment.pc.ip,
            connectedIPs: connectedIPs,
        }
    }
}