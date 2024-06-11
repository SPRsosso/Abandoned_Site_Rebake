function wait(waitTime_ms) {
    return new Promise(( resolve, reject ) => {
        setTimeout(() => resolve(), waitTime_ms);
    });
}

function checkIfPCIsOpen() {
    return new Promise(( resolve, reject ) => {
        const checkIfPCIsOpenInterval = setInterval(() => {
            if (Apartment.activeApartment.pc.loggedIn) {
                clearInterval(checkIfPCIsOpenInterval);
                resolve();
            }
        }, 200);
    });
}

let startChooseOptions = [ "Sure!", "Who are you?", "What is HPS?"];
async function messagesAfterLogin() {
    await checkIfPCIsOpen();

    const id = Apartment.activeApartment.pc.user.id

    await wait(5000);
    await checkIfPCIsOpen();

    anonymousUser.sendMessage(id, "Hey!");
    
    await wait(7000);
    await checkIfPCIsOpen();

    anonymousUserChooseOptions = startChooseOptions;
    anonymousUser.sendMessage(id, `Do you want to take part in HPS? There isn't any "no" option. You are in, or you are done.`);
}