function wait(waitTime_ms) {
    return new Promise(( resolve, reject ) => {
        setTimeout(() => resolve(), waitTime_ms);
    });
}

async function messagesAfterLogin() {
    await wait(3000);
    anonymousUser.sendMessage(Apartment.activeApartment.pc.user.id, "Hey!");
}