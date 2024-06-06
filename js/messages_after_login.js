function wait(waitTime_ms) {
    return new Promise(( resolve, reject ) => {
        setTimeout(() => resolve(), waitTime_ms);
    });
}

async function messagesAfterLogin() {
    const id = Apartment.activeApartment.pc.user.id
    await wait(15000);
    anonymousUser.sendMessage(id, "Hey!");
    await wait(7000);
    anonymousUserChooseOptions = [ "Sure!", "Who are you?", "What is HPS?"];
    anonymousUser.sendMessage(id, `Do you want to take part in HPS? There isn't any "no" option. You are in, or you are done.`);
}