const styles = `
    * {
        margin: 0;
    }

    *:not(div) {
        user-select: none;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
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

        cursor: pointer;
    }

    button:hover {
        background-color: var(--accent-color-faded);
    }
`

const barHeight = 65;