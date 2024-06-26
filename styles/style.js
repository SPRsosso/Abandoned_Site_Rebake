const styles = /*css*/`
    * {
        margin: 0;
        --usb-height: 80px;
        
        font-family: 'Courier New', Courier, monospace;
        color: var(--accent-color);

        touch-action: manipulation;
    }

    *:not(div) {
        user-select: none;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;

        touch-action: manipulation;        
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: var(--bg-color);
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--accent-color);
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--accent-color-faded);
    }
    
    input[type="text"] {
        padding: 10px;

        background-color: var(--bg-color);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
        border-radius: 50px;
    }

    input[type="text"]:focus::placeholder {
        color: white;
    }

    input[type="text"]:focus {
        outline: none;
        background-color: var(--accent-color-faded);
    }

    select {
        padding: 2px;
        background-color: var(--bg-color);
    }
    
    select:focus {
        outline: none;
    }

    button {
        padding: 5px 10px;
        background-color: var(--bg-color);
        border: 1px solid var(--accent-color);

        color: var(--accent-color);

        cursor: pointer;
    }

    button:hover {
        background-color: var(--accent-color-faded);
    }

    img {
        user-select: none;
        -webkit-user-drag: none;

        image-rendering: pixelated;
    }

    @keyframes slideIn {
        0% {
            translate: 100% 0;
        }

        100% {
            translate: 0 0;
        }
    }
`

const barHeight = 65;