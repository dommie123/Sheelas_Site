import React from "react";
import "./header.css";

export function Header(props) {
    const title = props.title;

    return (
        <header>
            <h1><a className="header-title-link" href="/home">{title}</a></h1>
            {props.children}
        </header>
    )
}