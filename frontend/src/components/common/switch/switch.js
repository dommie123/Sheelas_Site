import React, { useEffect } from 'react'

import { Box, InputLabel, Switch } from '@mui/material';

import './switch.css';

export default function SwitchWithLabel(props) {
    const { className, onChange, label, wide } = props;

    useEffect(() => {
        const switchInputEl = document.getElementsByClassName("PrivateSwitchBase-input")[0];
        switchInputEl.setAttribute("aria-labelledby", `${className}-label`);
    }, [])

    return (
        <Box sx={{ width: wide ? "100%" : "95%" }} className={`${className}-component switch-component`}>
            <InputLabel className={`${className}-label switch-label`} id={`${className}-label`}>{label}</InputLabel>
            <Switch className={`${className}-switch switch`} aria-labelledby={`${className}-label`} onChange={onChange} />
        </Box>
    )
}