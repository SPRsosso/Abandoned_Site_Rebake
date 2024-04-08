const TokenType = {
    Number: "Number",
    Identifier: "Identifier",
    Equals: "Equals",
    OpenParen: "OpenParen",
    CloseParen:"CloseParen",
    BinaryOperator: "BinaryOperator",
    Let: "Let",
    Path: "Path"
}

const KEYWORDS = {
    "let": TokenType.Let
}

class Token {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}

function isAlpha(src) {
    return src.toUpperCase() != src.toLowerCase() || src == ".";
}

function isInt(src) {
    const c = src.charCodeAt(0);
    const bounds = [ '0'.charCodeAt(0), '9'.charCodeAt(0) ];

    return ( c >= bounds[0] && c <= bounds[1] );
}

function isPath(src) {
    return src == ".";
}

function isSkippable(src) {
    return src == " " || src == "\n" || src == "\t";
}

function tokenize(sourceCode) {
    const tokens = new Array();
    const src = sourceCode.split("");

    // Build each token until end of file
    while(src.length > 0) {
        if (src[0] == "(")
            tokens.push(new Token(src.shift(), TokenType.OpenParen));
        else if (src[0] == ")")
            tokens.push(new Token(src.shift(), TokenType.CloseParen));
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/")
            tokens.push(new Token(src.shift(), TokenType.BinaryOperator));
        else if (src[0] == "=")
            tokens.push(new Token(src.shift(), TokenType.Equals));
        else {
            // Handle multicharacter tokens

            // if (isInt(src[0])) {
            //     let num = "";
            //     while (src.length > 0 && isInt(src[0])) {
            //         num += src.shift();
            //     }

            //     tokens.push(new Token(num, TokenType.Number));
            // } else 
            if (isPath(src[0])) {
                let ident = "";
                while (src.length > 0 && isPath(src[0])) {
                    ident += src.shift();
                }

                tokens.push(new Token(ident, TokenType.Path));
            } else if (isAlpha(src[0]) || isInt(src[0])) {
                let ident = "";
                while (src.length > 0 && (isAlpha(src[0]) || isInt(src[0]))) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (reserved == undefined)
                    tokens.push(new Token(ident, TokenType.Identifier))
                else
                    tokens.push(new Token(ident, reserved));
            } else if (isSkippable(src[0])) {
                src.shift(); // SKIP THE CURRENT CHARACTER
            } else {
                console.error("Unrecognized character found in source: ", src[0]);
                break;
            }
        }
    }
    
    return tokens;
}