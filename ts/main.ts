import { wifis } from "./data/wifis.js";
import { shared } from "./shared.js";

if (shared.activeApartment.pc.loggedIn) isGameStarted = true;

async function gameLoop(): Promise<void> {
    while(true) {
        // Tick operations
        // Current tick resets to 0 when time reaches 1s
        if (currentTick >= ticks) {
            currentTick = 0;
        }
        currentTick++;
        // Global tick counts ticks after the game is started
        if (isGameStarted)
            globalTick++;
        // Tick whilst you are in PC counts when the game is started and user logs in to a computer
        if (isGameStarted && shared.activeApartment.pc.loggedIn)
            insidePCTick++;
        // Anonymous user message tick count when the game is started, you are logged in to a computer and when the anonymous user should message your starting computer
        if (isGameStarted && apartments[0].pc.loggedIn)
            anonymousUserMessageTick++;



        // Game mechanics
        
        // Anonymous user sends messages
        if (anonymousUserMessages[0]) {
            if (parseInt(tickstoms(anonymousUserMessageTick)) >= parseInt(Object.keys(anonymousUserMessages[0])[0])) {
                const id = apartments[0].pc.user.id;

                anonymousUser.sendMessage(id, anonymousUserMessages[0][Object.keys(anonymousUserMessages[0])[0]]);

                if (anonymousUserMessages[0].chooseOptions) setAnonymousOptions(startChooseOptions);

                anonymousUserMessages.shift();
                anonymousUserMessageTick = 0;
            }
        }

        trojanMultiplier = Math.round(trojanMultiplier * 10000) / 10000;
        await wait(tps * trojanMultiplier);
    }
}
gameLoop();

// Check if browser is different than Chrome
if (navigator.userAgent.indexOf("Chrome") === -1)
    alert("You are using other browser than Chromium based browsers (eg. Chrome, Opera, Opera GX), this game may not work properly");