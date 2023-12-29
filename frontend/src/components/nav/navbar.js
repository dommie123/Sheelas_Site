import React from "react";
import {NavLink} from "react-router-dom";

import { Header } from "../common/header/header";

export const Navbar = (props) => {
    return (
        <Header title="Hello World!">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/register">Sign Up</NavLink>
        </Header>
    )
}