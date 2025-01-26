import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logOutUser } from "../../../slices/login-slice";

import { useAuthNavigate } from "../../../hooks/auth-navigation";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

import { objectIsEmpty } from "../../../utils/objects";

import SimpleDrawer from "../drawer/simple-drawer";

import "./header.css";

export function Header(props) {
    const title = props.title;
    const isMobile = useSelector(state => state.global.isMobile);
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const navigate = useNavigate();
    const sellerNavigate = useAuthNavigate(true);
    const dispatch = useDispatch();

    const userIsSellerOrAdmin = useMemo(() => {
        if (objectIsEmpty(loggedInUser)) {
            return false;
        }

        return loggedInUser.role !== 2; // 2 == BUYER
    }, [loggedInUser]);

    const mobileOptions = isMobile ? [
        { icon: <AccountBoxIcon />, label: "Profile Settings", handleSelect: () => { navigate('/profile-settings') } },
        { icon: <LogoutIcon />, label: "Log Out", handleSelect: () => { dispatch(logOutUser()); navigate('/') } },
    ] : []

    const sellerOptions = userIsSellerOrAdmin ? [
        { icon: <AddBoxIcon />, label: "Sell Item", handleSelect: () => { sellerNavigate('/sell', true) } },
    ] : [];

    const options = [
        { icon: <HomeIcon />, label: "Home", handleSelect: () => { navigate('/home') } },
        ...sellerOptions,
        { icon: <InfoIcon />, label: "About Us", handleSelect: () => { navigate('/about') } },
        { icon: <HelpIcon />, label: "Contact Us", handleSelect: () => { navigate('/contact') } },
        ...mobileOptions
    ]



    return (
        <header>
            <SimpleDrawer anchor="left" options={options} drawerIcon={<MenuIcon />} buttonAriaLabel="Main Menu" className='nav-menu' /> 
            <h1 className="header-title-text"><Link className="header-title-link" to="/home">{title}</Link></h1>
            {props.children}
        </header>
    )
}