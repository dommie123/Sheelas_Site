import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

export function Header(props) {
    const title = props.title;

    return (
        <header>
            <h1><Link className="header-title-link" to="/home">{title}</Link></h1>
            {props.children}
        </header>
    )
}