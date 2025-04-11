import React from "react";
import { useSelector } from 'react-redux';

import { Tabs, Tab, Box } from "@mui/material";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function SimpleTabs({ tabs, className, ariaLabel }) { // tabs = [{ label: string, content: JSXElement }]
    const [value, setValue] = React.useState(0);
    const isMobile = useSelector(state => state.global.isMobile);
    
    const verticalTabStyles = {
        flexGrow: 2,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        width: "100%"
    };

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            className={className}
            sx={isMobile ? { width: '100%', bgcolor: "background.paper", } : verticalTabStyles}
        >
            <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                variant={isMobile ? "fullWidth" : "scrollable"}
                value={value}
                onChange={handleChange}
                aria-label={ariaLabel}
                sx={isMobile ? undefined : { borderRight: 1, borderColor: "divider" }}
            >
                {tabs.map((tab, index) => <Tab label={tab.label} {...a11yProps(index)} />)}
            </Tabs>
            {tabs.map((tab, index) => <TabPanel value={value} index={index}>{tab.content}</TabPanel>)}
        </Box>
    );
}
