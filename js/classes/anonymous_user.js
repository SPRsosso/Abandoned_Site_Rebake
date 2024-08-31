const anonymousUser = new User("Anonymous", "User", undefined, undefined, undefined, undefined, "0", "anonymous_user@an.an");
let startChooseOptions = [ "Sure!", "Who are you?", "What is HPS?"];
let anonymousUserChooseOptions = null;

let anonymousUserMessages = [
    {
        "5000": "Hey!"
    },
    {
        "7000": `Do you want to take part in HPS? There isn't any "no" option. You are in, or you are done.`,
        chooseOptions: startChooseOptions
    }
];

function setAnonymousOptions(options) {
    anonymousUserChooseOptions = options;
    MessX.refreshMessages();
}

async function sendToAnonymousUser(option) {
    anonymousUserMessageTick = 0;

    switch(option) {
        case "Sure!":
            anonymousUserMessages = [
                {
                    "2000": "Good decision."
                },
                {
                    "7000": "You are one of the best hackers i've known before, that's why you are the chosen one. Be careful! The police is on track with every move."
                },
                {
                    "5000": "Let's test your knowledge of hacking"
                }
            ];
            break;
        case "Who are you?":
            startChooseOptions = startChooseOptions.filter(startOption => startOption !== option);
            anonymousUserMessages = [
                {
                    "5000": "You don't need to know, are you in?",
                    chooseOptions: startChooseOptions
                }
            ];
            
            break;
        case "What is HPS?":
            startChooseOptions = startChooseOptions.filter(startOption => startOption !== option);
            anonymousUserMessages = [
                {
                    "5000": "HPS stands for 'Hackers, Protect and Secure', it's organisation that gives money for hacking and retrieving data from other users, are you in?",
                    chooseOptions: startChooseOptions
                }
            ];
            break;
    }
}