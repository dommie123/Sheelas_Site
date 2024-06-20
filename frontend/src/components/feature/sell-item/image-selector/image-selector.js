import React from "react";

import { FormControl, FormHelperText, FormLabel } from "@mui/material";

import "./image-selector.css";

export const ImageSelector = (props) => {
    const { label, value, handleChange, error, helperText } = props;

    return (
        <FormControl className="image-selector" error={error}>
            <FormLabel className="image-selector-label">{label}</FormLabel>
            <input type="file" value={value} className="image-selector-input" onChange={handleChange} />
            {
                Boolean(helperText) 
                    ? <FormHelperText className="image-selector-helper-text">{helperText}</FormHelperText>
                    : <></>
            }
        </FormControl>
    )
}