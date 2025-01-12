import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

import './app-panel.css';

export const UserApplicationPanel = ({className, panelContent, appPage}) => {
    const navigate = useNavigate();

    const handleApplyClick = (e) => {
        e.preventDefault();
        navigate(appPage);
    }

    return (
        <div className={`${className}-app-panel-container app-panel-container`}>
            <div className={`${className}-app-panel-content app-panel-content`}>
                {panelContent}
                <Button 
                    variant='contained'
                    color='primary'
                    className='app-panel-apply-button' 
                    onClick={handleApplyClick}
                >
                    Apply Now
                </Button>
            </div>
        </div>
    )
}