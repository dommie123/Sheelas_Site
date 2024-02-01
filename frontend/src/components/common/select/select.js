import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
    const { value, onChange, label, className, options, size } = props; // options = ['option1', 'option2', 'option3']

    return (
        <Box sx={{ minWidth: 120 }} className={`${className}-container`}>
            <FormControl fullWidth>
                <InputLabel size={size} id={`${className}-label`}>{label}</InputLabel>
                <Select
                    size={size}
                    labelId={`${className}-label`}
                    className={className}
                    value={value}
                    label={label}
                    onChange={onChange}
                >
                    {options.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}