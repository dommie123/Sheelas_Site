export const toCurrencyFormat = (currency) => {
    return `$${Number.parseFloat(currency).toFixed(2)}`
}

export const fromCurrencyFormat = (currency) => {
    return Number.parseFloat(currency.split("$")[1]);
}

export const capitalize = (string) => {
    if (typeof string !== "string") {
        console.error(`ERROR: ${string} is not a string!`);
        return;
    }

    const firstLetter = string.charAt(0).toUpperCase();
    const restOfString = string.substring(1).toLowerCase();
    
    return `${firstLetter}${restOfString}`;
}

export const fromCamelCase = (string) => {
    if (typeof string !== "string") {
        console.error(`ERROR: ${string} is not a string!`);
        return;
    }

    let output = '';
    for (let i = 0; i < string.length; i++) {
        if (i === 0) {
            output = output.concat(string.charAt(i).toUpperCase());
        } else if (string.charAt(i) === string.charAt(i).toUpperCase()) {
            output = output.concat(` ${string.charAt(i).toUpperCase()}`);
        } else {
            output = output.concat(string.charAt(i));
        }
    }

    return output;
}