import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Autocomplete, Menu, MenuItem, TextField, Button } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import ArrowDropdownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { getItems, getItemsByName } from "../../slices/item-slice";
import { getUserFromSession, logInUser, logOutUser } from "../../slices/login-slice";

import { objectIsEmpty } from "../../utils/objects";

import ShoppingCartDrawer from "../feature/buy-item/shopping-cart/shopping-cart";

import { Header } from "../common/header/header";

import './navbar.css';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const filter = createFilterOptions();
    const regUser = useSelector(state => state.register.regUser);
    const items = useSelector(state => state.items.allItems);
    const user = useSelector(state => state.login.loggedInUser);
    const checkedLocalSessionForUser = useSelector(state => state.login.checkedLocalSessionForUser);
    const isMobile = useSelector(state => state.global.isMobile);

    const [profAnchorEl, setProfAnchorEl] = useState(null);
    const profOpen = Boolean(profAnchorEl);

    const handleProfClose = () => {
        setProfAnchorEl(null);
    }

    const handleLogout = () => {
        dispatch(logOutUser());
        handleProfClose();
        navigate('/');
    }

    const handleNavToProfileSettings = () => {
        handleProfClose();
        navigate('/profile-settings')
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

    useEffect(() => {
        if (!checkedLocalSessionForUser) {
            dispatch(getUserFromSession());
        }

        else if (!regUser && objectIsEmpty(user) && checkedLocalSessionForUser) {
            navigate('/error');
        }

        else if (regUser) {
            dispatch(logInUser(regUser))
        }
        //eslint-disable-next-line
    }, [regUser, user, checkedLocalSessionForUser])

    return (
        <Header title={isMobile ? "SB" : "SheeBay"}>
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
                {isMobile ? <></> : <><Button
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
                    <MenuItem onClick={handleNavToProfileSettings}>Profile Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu></>}
                <ShoppingCartDrawer className="shopping-cart" />
            </div>
        </Header>
    )
}