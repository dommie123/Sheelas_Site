import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { objectIsEmpty } from '../utils/objects';

export const useAuthNavigate = (allowSellers = false) => {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const navigate = useNavigate();

    const allowedUserRoles = [1];  // 1 = ADMIN, 2 = BUYER, 3 = SELLER
    if (allowSellers) {
        allowedUserRoles.push(3);
    }

    return (endpoint) => {
        // If there is no user logged in, navigate them to the error page.
        if (objectIsEmpty(loggedInUser)) {
            navigate("/error");
        }

        // If this user is not allowed access to this endpoint, navigate them to the error page.
        if (!allowedUserRoles.includes(loggedInUser.role)) {
            navigate("/error");
        }

        navigate(endpoint);
    }
}