import React, { useState } from 'react';
import moment from 'moment';

import { DesktopDatePicker as DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FormControl, FormLabel, TextField } from '@mui/material';

import '../inputs.css';
import './date-picker.css';

export default function ScreeningDatePicker({ className, label, handleChange }) {
    const [value, setValue] = useState(moment());

    const defaultHandleChange = (newValue) => {
        setValue(newValue);
        handleChange(newValue);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <FormControl className={`${className} screening-date-picker-control`}>
                <FormLabel className={`screening-label ${className}-label`}>{label}</FormLabel>
                <DatePicker 
                    className={`${className}-date-picker screening-date-picker`} 
                    inputFormat='MM/DD/yyyy'
                    onChange={defaultHandleChange} 
                    renderInput={(params) => <TextField {...params} />}
                    value={value}
                />
            </FormControl>
        </LocalizationProvider>
    )
}