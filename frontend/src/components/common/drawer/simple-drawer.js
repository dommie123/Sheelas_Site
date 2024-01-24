import React, { useState } from 'react';

import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    IconButton
} from '@mui/material';

import "./simple-drawer.css";

export default function SimpleDrawer(props) {
    const { anchor, options, drawerIcon, className } = props;   // options = [{ icon: <Icon />, label: "Label" }]
    const [state, setState] = useState({
        top: anchor.top,
        left: anchor.left,
        bottom: anchor.bottom,
        right: anchor.right
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {options.map(({ icon, label, handleSelect }) => (
                    <ListItem key={label} disablePadding>
                        <ListItemButton onClick={handleSelect}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div className={className}>
            <IconButton className={`${className}-button`} onClick={toggleDrawer(anchor, true)}>{drawerIcon}</IconButton>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                className={`${className}-drawer`}
            >
                {list(anchor)}
            </Drawer>
        </div>
    );
}