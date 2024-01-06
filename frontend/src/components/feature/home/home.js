import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';

import ItemList from './item-list/item-list';

import { styled } from '@mui/material/styles';
import './home.css';

const CustomIconButton = styled(IconButton)({
    backgroundColor: 'greenyellow',
    padding: '15px'
})

export default function HomePage() {
    const navigate = useNavigate();

    const handleAddItem = () => {
        navigate('/sell');
    }

    return (
        <div className='home-container'>
            <ItemList />
            <CustomIconButton className='add-item-button' onClick={handleAddItem}>
                <Add />
            </CustomIconButton>
        </div>
    )
}