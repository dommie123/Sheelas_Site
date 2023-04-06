import React from 'react';

import { Modal } from '../../common/modal/modal';

export const RegisterModal = (props) => {
    return (
        <Modal 
            topContent={(<p>Top</p>)}
            centerContent={(<p>Center</p>)}
            bottomContent={(<p>Bottom</p>)}
        />
    )
}