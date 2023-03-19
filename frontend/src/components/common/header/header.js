import React from "react";
import "./header.css";

export function Header(props) {
    const title = props.title;

    return (
        <header>
            <h1>{title}</h1>
            {props.children}
        </header>
    )
}