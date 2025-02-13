export const isUserSellerOrAdmin = (user) => {
    return user.role !== 2;
}

export const isUserAdmin = (user) => {
    return user.role === 1;
}

export const isUserSeller = (user) => {
    return user.role === 3;
}