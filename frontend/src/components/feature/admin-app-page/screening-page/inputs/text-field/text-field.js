import React from 'react';

import { FormControl, FormLabel, TextField } from '@mui/material';

import '../inputs.css';
import './text-field.css';

export default function ScreeningTextField({className, label, type, value, disabled, handleChange, InputProps}) {
    return (
        <FormControl className={`screening-text-field-control ${className}`}>
            <FormLabel className={`screening-label ${className}-label`}>{label}</FormLabel>
            <TextField
                variant='outlined'
                type={type}
                value={value}
                disabled={disabled}
                className={`screening-text-field ${className}-text-field`}
                InputProps={InputProps}
                onChange={handleChange}
            />
        </FormControl>
    )
}