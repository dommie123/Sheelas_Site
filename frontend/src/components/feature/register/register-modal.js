import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from '../../common/modal/modal';

import './register-modal.css';

export const RegisterModal = (props) => {
    const registerStep = useSelector(state => state.register.step);
    const emailValid = useSelector(state => state.register.emailValid);
    const phoneValid = useSelector(state => state.register.phoneValid);
    const passwordValid = useSelector(state => state.register.passwordValid);
    const dispatch = useDispatch();
    

    return (
        <Modal 
            topContent={(<p>Top</p>)}
            centerContent={(<p>Center</p>)}
            bottomContent={(<p>Bottom</p>)}
        />
    )
}