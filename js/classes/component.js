class Component {
    static download(component, time) {
        if (!Apartment.activeApartment.router.connectedWifi) {
            return;
        }

        const downloader = document.createElement("div");
        downloader.style.backgroundColor = "var(--accent-color)";
        downloader.style.width = component.offsetWidth + "px";
        downloader.style.height = component.offsetHeight + "px";
        downloader.style.position = "absolute";
        downloader.style.transform = `scaleX(0)`;
        downloader.style.transformOrigin = "left";
        downloader.style.zIndex = "10000000";

        document.body.append(downloader);

        time = time / Apartment.activeApartment.router.connectedWifi.strength;
        return new Promise(( resolve, reject ) => {
            const waitMaxLines = 30;
            const intervalTime = 10;
            let counter = 0;
            let lineCounter = 0;
            let waitLines = 0;

            const waitInterval = setInterval(() => {
            
                downloader.style.top = component.getBoundingClientRect().top + "px";
                downloader.style.left = component.getBoundingClientRect().left + "px";

                if (lineCounter >= time / waitMaxLines) {
                    waitLines++;
                    const percentage = Math.round((100 * (time / waitMaxLines) * waitLines) / time);
                    downloader.style.transform = `scaleX(${percentage}%)`;
                    lineCounter = 0;
                }

                if (counter >= time) {
                    clearInterval(waitInterval);
                    downloader.remove();

                    resolve();
                }

                counter += intervalTime;
                lineCounter += intervalTime;
                
            }, intervalTime);
        });
    }
}