export const areItemsEqual = (item1, item2) => {
    if (!item1.id || !item2.id) {
        return false;
    }
    return item1.id === item2.id;
}