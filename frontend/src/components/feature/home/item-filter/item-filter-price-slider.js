import React from 'react';

import { Box, Slider, InputLabel } from '@mui/material';

import './item-filter.css';
import { useSelector } from 'react-redux';

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
    const { value, onChange, className, sliderAriaLabel} = props;
    const isMobile = useSelector(state => state.global.isMobile);

    const sliderStyles = isMobile ? { marginLeft: 0, width: "100%" } : { marginLeft: "10px", width: "92%" };
    const headerStyles = isMobile ? { margin: 0 } : { marginBottom: "5px", marginLeft: "-5px" };
    
    return (
        <Box className={className}>
            <InputLabel id={`${className}-label-el`} className={`${className}-label`} aria-label={sliderAriaLabel} sx={headerStyles}>Price</InputLabel>
            <Slider
                className={`${className}-slider`}
                size='small'
                aria-labelledby={`${className}-label-el`}
                value={value}
                valueLabelDisplay="auto"
                marks={isMobile ? undefined : marks}
                onChange={onChange}
                max={200}
                valueLabelFormat={(value) => `$${value}`}
                sx={sliderStyles}
            />
        </Box>
      );
}