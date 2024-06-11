const anonymousUser = new User("Anonymous", "User", undefined, undefined, undefined, undefined, "0", "anonymous_user@an.an");
let anonymousUserChooseOptions = null;

let firstTimeInTheGame = true;

function setAnonymousOptions(options) {
    anonymousUserChooseOptions = options;
    MessX.refreshMessages();
}

async function sendToAnonymousUser(option) {
    const id = Apartment.activeApartment.pc.user.id;
    switch(option) {
        case "Sure!":
            await wait(2000);
            await checkIfPCIsOpen();

            anonymousUser.sendMessage(id, "Good decision.");
            
            await wait(7000);
            await checkIfPCIsOpen();

            anonymousUser.sendMessage(id, "You are one of the best hackers i've known before, that's why you are the chosen one. Be careful! The police is on track with every move.");
            
            await wait(5000);
            await checkIfPCIsOpen();

            anonymousUser.sendMessage(id, "Let's test your knowledge of hacking");
            break;
        case "Who are you?":
            await wait(5000);
            await checkIfPCIsOpen();

            anonymousUser.sendMessage(id, "You don't need to know, are you in?");
            
            startChooseOptions = startChooseOptions.filter(startOption => startOption !== option);
            setAnonymousOptions(startChooseOptions);
            break;
        case "What is HPS?":
            await wait(5000);
            await checkIfPCIsOpen();

            anonymousUser.sendMessage(id, "HPS stands for 'Hackers, Protect and Secure', it's organisation that gives money for hacking and retrieving data from other users, are you in?");
            startChooseOptions = startChooseOptions.filter(startOption => startOption !== option);
            setAnonymousOptions(startChooseOptions);
            break;
    }
}