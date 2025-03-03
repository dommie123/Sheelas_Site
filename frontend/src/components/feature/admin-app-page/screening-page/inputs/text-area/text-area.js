import React from 'react';

import { FormControl, FormLabel } from '@mui/material';

import '../inputs.css';
import './text-area.css';

export default function ScreeningTextArea({ className, label, handleChange, formControlProps }) {
    return (
        <FormControl
            {...formControlProps}
            className={`${className} screening-text-area-control`}
        >
            <FormLabel className={`screening-label ${className}-label`}>{label}</FormLabel>
            <textarea className={`screening-text-area ${className}-text-area`} onChange={handleChange} />
        </FormControl>
    )
}