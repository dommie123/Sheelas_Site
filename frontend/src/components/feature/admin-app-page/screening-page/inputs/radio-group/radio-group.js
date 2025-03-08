import React from 'react'

import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, capitalize } from '@mui/material';

import '../inputs.css';
import './radio-group.css';

export default function ScreeningRadioGroup({className, label, value, options, handleChange}) {
    return (
        <FormControl className={`${className} screening-radio-group-container`}>
            <FormLabel className={`screening-label ${className}-label`}>{label}</FormLabel>
            <RadioGroup
                name="controlled-radio-buttons-group"
                onChange={handleChange}
                className={`screening-radio-group ${className}-radio-group`}
                value={value}
            >
                {options.map(option => <FormControlLabel 
                    key={option}
                    value={option} 
                    control={<Radio />} 
                    label={capitalize(option)} 
                />)}
            </RadioGroup>
        </FormControl>
    )
}