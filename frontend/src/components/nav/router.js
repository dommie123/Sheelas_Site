import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { Navbar } from "./navbar";
import { RegisterModal } from "../feature/register/register-modal";
import { LoginModal } from "../feature/login/login-modal";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />
    },
    {
        path: "/home",
        element: (
            <>
                <Navbar />
                <div>Home</div>
            </>
        )
    },
    {
        path: "/register",
        element: (
            <>
                <Navbar />
                <RegisterModal />
            </>
        )
    },
    {
        path: "/login",
        element: (
            <>
                <Navbar />
                <LoginModal />
            </>
        )
    },
    {
        path: "/about",
        element: (
            <>
                <Navbar />
                <div>About Us</div>
            </>
        )
    },
    {
        path: "/contact",
        element: (
            <>
                <Navbar />
                <div>Contact Us</div>
            </>
        )
    },
]);

export default function Router(props) {
    return (
        <RouterProvider router={router}>
            {props.children}
        </RouterProvider>
    )
}