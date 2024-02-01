import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Autocomplete, Menu, MenuItem, IconButton, TextField, Button } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import AppsIcon from '@mui/icons-material/Apps';
import ArrowDropdownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { getItems } from "../../slices/item-slice";
import { getItemsByName } from "../../slices/item-slice";
import { logOutUser } from "../../slices/login-slice";

import { Header } from "../common/header/header";

import './navbar.css';
import ShoppingCartDrawer from "../feature/buy-item/shopping-cart/shopping-cart";

export const Navbar = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const filter = createFilterOptions();
    const items = useSelector(state => state.items.allItems);
    const user = useSelector(state => state.login.loggedInUser);

    const [profAnchorEl, setProfAnchorEl] = useState(null);
    const profOpen = Boolean(profAnchorEl);
    const [appsAnchorEl, setAppsAnchorEl] = useState(null);
    const appsOpen = Boolean(appsAnchorEl);

    const handleProfClose = () => {
        setProfAnchorEl(null);
    }

    const handleAppsClose = () => {
        setAppsAnchorEl(null);
    }

    const handleLogout = () => {
        dispatch(logOutUser());
        handleProfClose();
        navigate('/');
    }

    const determineSearchBarFunctionality = (event, newValue) => {
        if (location.pathname === '/home') {
            handleSearchItem(event, newValue);
        }
    }

    const handleSearchItem = (_, newValue) => {
        if (!newValue) {
            dispatch(getItems());
            return;
        }

        const searchTerm = newValue.label;

        if (!searchTerm || searchTerm === '') {
            dispatch(getItems());
        } else {
            dispatch(getItemsByName(searchTerm));
        }
    }

    return (
        <Header title="SheeBay">
            <Autocomplete
                className="product-search-bar"
                options={items.map((item) => { return { label: item.name } })}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        label="Search Products"
                    />
                )}
                onChange={determineSearchBarFunctionality}
                includeInputInList
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.label);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            label: `"${inputValue}"`,
                        });
                    }

                    return filtered;
                }}
            />
            <div className="header-options-suite">
                <Button
                    className="profile-menu-button"
                    aria-controls={profOpen ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={profOpen ? 'true' : undefined}
                    onClick={(event) => {
                        setProfAnchorEl(event.currentTarget)
                    }}
                >
                    {`Hi, ${user.first_name}`}
                    {profOpen ? <ArrowDropUpIcon /> : <ArrowDropdownIcon />}
                </Button>
                <Menu
                    className="profile-menu"
                    anchorEl={profAnchorEl}
                    open={profOpen}
                    onClose={handleProfClose}
                    MenuListProps={{
                        'aria-labelledby': 'profile-menu-button',
                    }}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                {/* <IconButton className="other-pages" title="Other Pages" onClick={(event) => { setAppsAnchorEl(event.currentTarget) }}>
                    <AppsIcon />
                </IconButton>
                <Menu
                    className="apps-menu"
                    anchorEl={appsAnchorEl}
                    open={appsOpen}
                    onClose={handleAppsClose}
                    MenuListProps={{
                        'aria-labelledby': 'apps-menu-button',
                    }}
                >
                    <MenuItem onClick={() => { navigate("/about"); handleAppsClose(); }}>About</MenuItem>
                    <MenuItem onClick={() => { navigate("/contact"); handleAppsClose(); }}>Contact Us</MenuItem>
                </Menu> */}
                <ShoppingCartDrawer className="shopping-cart" />
            </div>
        </Header>
    )
}