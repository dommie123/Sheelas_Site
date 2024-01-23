export const toCurrencyFormat = (currency) => {
    return `$${Number.parseFloat(currency).toFixed(2)}`
}

export const fromCurrencyFormat = (currency) => {
    return Number.parseFloat(currency.split("$")[1]);
}