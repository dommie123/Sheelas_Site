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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { objectIsEmpty } from "../../../utils/objects";

import SimpleDrawer from "../drawer/simple-drawer";

import headerLogo from "../../../assets/SheeBay_Logo_Draft_1.png";
import mobileHeaderLogo from "../../../assets/SheeBay_Logo_Draft_2.png";

import "./header.css";

export function Header(props) {
    const isMobile = useSelector(state => state.global.isMobile);
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const navigate = useNavigate();
    const sellerNavigate = useAuthNavigate(true);
    const adminNavigate = useAuthNavigate();
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

    const adminOptions = loggedInUser.role === 1 ? [
        { icon: <AdminPanelSettingsIcon />, label: "Admin Dashboard", handleSelect: () => { adminNavigate('/admin') }},
    ] : [];

    const options = [
        { icon: <HomeIcon />, label: "Home", handleSelect: () => { navigate('/home') } },
        ...adminOptions,
        ...sellerOptions,
        { icon: <InfoIcon />, label: "About Us", handleSelect: () => { navigate('/about') } },
        { icon: <HelpIcon />, label: "Contact Us", handleSelect: () => { navigate('/contact') } },
        ...mobileOptions
    ]

    return (
        <header>
            <SimpleDrawer anchor="left" options={options} drawerIcon={<MenuIcon />} buttonAriaLabel="Main Menu" className='nav-menu' /> 
            <Link className="header-title-link" to="/home">
                <img className="header-title-image" src={ isMobile ? mobileHeaderLogo : headerLogo } alt="SheeBay Logo" />
            </Link>
            {props.children}
        </header>
    )
}