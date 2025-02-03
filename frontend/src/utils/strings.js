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