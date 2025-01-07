export const areItemsEqual = (item1, item2) => {
    if (!item1.id || !item2.id) {
        return false;
    }
    return item1.id === item2.id;
}

export const objectIsEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export const areObjectsEqual = (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    } else if (Object.values(obj1).length !== Object.values(obj2).length) {
        return false;
    }

    let objectsAreEqual = true;
    for (let i = 0; i < Object.keys(obj1).length; i++) {
        const [key1, value1] = Object.entries(obj1)[i];
        const [key2, value2] = Object.entries(obj2)[i];

        if (key1 !== key2 || value1 !== value2) {
            objectsAreEqual = false;
            break;
        }
    }

    return objectsAreEqual;
}