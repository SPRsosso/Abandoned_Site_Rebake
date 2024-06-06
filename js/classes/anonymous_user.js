const anonymousUser = new User("Anonymous", "User", undefined, undefined, undefined, undefined, "0", "anonymous_user@an.an");
let anonymousUserChooseOptions = null;

function setAnonymousOptions(options) {
    anonymousUserChooseOptions = options;
    MessX.refreshMessages();
}

async function sendToAnonymousUser(option) {
    const id = Apartment.activeApartment.pc.user.id;
    switch(option) {
        case "Sure!":
            await wait(2000);
            anonymousUser.sendMessage(id, "Love that decision!");
            await wait(7000);
            anonymousUser.sendMessage(id, "You are one of the best hackers i've known before, that's why you are the chosen one, don't fuck this up, the police is on track with every move.");
            await wait(5000);
            anonymousUser.sendMessage(id, "Mission: unknown");
            break;
        case "Who are you?":
            await wait(5000);
            anonymousUser.sendMessage(id, "You don't need to know, are you in?");
            setAnonymousOptions([ "Sure!", "What is HPS?" ])
            break;
        case "What is HPS?":
            await wait(5000);
            anonymousUser.sendMessage(id, "HPS stands for Hacker Protected Secure, it's organisation that gives money for hacking and retrieving data from other users, are you in?");
            setAnonymousOptions([ "Sure!", "Who are you?" ])
            break;
    }
}