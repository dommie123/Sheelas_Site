import React from 'react'

import { Box, InputLabel, Switch } from '@mui/material';

import './switch.css';

export default function SwitchWithLabel(props) {
    const { className, onChange, label, wide } = props;

    return (
        <Box sx={{ width: wide ? "100%" : "95%" }} className={`${className}-component switch-component`}>
            <InputLabel className={`${className}-label switch-label`}>{label}</InputLabel>
            <Switch className={`${className}-switch switch`} onChange={onChange} />
        </Box>
    )
}