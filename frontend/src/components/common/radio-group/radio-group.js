import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioButtonsGroup(props) {
    const { options, label, className, onChange } = props;    // options = [{value: option1, label: 'option1'}, {value: option2, label: 'option2'}]

    return (
        <FormControl>
            <FormLabel id={`${className}-label`}>{label}</FormLabel>
            <RadioGroup
                aria-labelledby={`${className}-label`}
                name={className}
                className={className}
                onChange={onChange}
                role="radiogroup"
            >
                {options.map(option => <FormControlLabel value={option.value} control={<Radio />} label={option.label} role='radio' />)}
            </RadioGroup>
        </FormControl>
    );
}