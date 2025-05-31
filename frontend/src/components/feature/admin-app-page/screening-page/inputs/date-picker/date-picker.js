import React, { useState } from 'react';
import moment from 'moment';

import { DesktopDatePicker as DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FormControl, FormLabel, TextField } from '@mui/material';

import '../inputs.css';
import './date-picker.css';

export default function ScreeningDatePicker({ className, label, value, disabled, handleChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <FormControl className={`${className} screening-date-picker-control`}>
                <FormLabel className={`screening-label ${className}-label`}>{label}</FormLabel>
                <DatePicker 
                    className={`${className}-date-picker screening-date-picker`} 
                    disabled={disabled}
                    inputFormat='MM/DD/yyyy'
                    onChange={handleChange} 
                    renderInput={(params) => <TextField {...params} />}
                    value={value}
                />
            </FormControl>
        </LocalizationProvider>
    )
}