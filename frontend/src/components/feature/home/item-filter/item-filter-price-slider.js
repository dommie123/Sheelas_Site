import React from 'react';

import { Box, Slider, InputLabel } from '@mui/material';

const marks = [
    {
        value: 0,
        label: "Free"
    },
    {
        value: 200,
        label: "Any"
    }
];

export default function PriceSlider(props) {
    const { value, onChange, className } = props;
    
    return (
        <Box className={className}>
            <InputLabel className={`${className}-label`} sx={{ marginBottom: "5px", marginLeft: "-5px" }}>Price</InputLabel>
            <Slider
                className={`${className}-slider`}
                size='small'
                aria-label="Custom marks"
                value={value}
                valueLabelDisplay="auto"
                marks={marks}
                onChange={onChange}
                max={200}
                valueLabelFormat={(value) => `$${value}`}
                sx={{ marginLeft: "10px", width: "92%" }}
            />
        </Box>
      );
}