import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logOutUser } from "../../../slices/login-slice";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

import SimpleDrawer from "../drawer/simple-drawer";

import "./header.css";

export function Header(props) {
    const title = props.title;
    const isMobile = useSelector(state => state.global.isMobile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mobileOptions = isMobile ? [
        { icon: <AccountBoxIcon />, label: "Profile Settings", handleSelect: () => { navigate('/profile-settings') } },
        { icon: <LogoutIcon />, label: "Log Out", handleSelect: () => { dispatch(logOutUser()); navigate('/') } },
    ] : []
    const options = [
        { icon: <HomeIcon />, label: "Home", handleSelect: () => { navigate('/home') } },
        { icon: <AddBoxIcon />, label: "Sell Item", handleSelect: () => { navigate('/sell') } },
        { icon: <InfoIcon />, label: "About Us", handleSelect: () => { navigate('/about') } },
        { icon: <HelpIcon />, label: "Contact Us", handleSelect: () => { navigate('/contact') } },
        ...mobileOptions
    ]

    return (
        <header>
            <SimpleDrawer anchor="left" options={options} drawerIcon={<MenuIcon />} className='nav-menu' /> 
            <h1 className="header-title-text"><Link className="header-title-link" to="/home">{title}</Link></h1>
            {props.children}
        </header>
    )
}