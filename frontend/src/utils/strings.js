export const toCurrencyFormat = (currency) => {
    return `$${Number.parseFloat(currency).toFixed(2)}`
}