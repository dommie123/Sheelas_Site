import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { Navbar } from "./navbar";
import { RegisterModal } from "../feature/register/register-modal";
import { LoginModal } from "../feature/login/login-modal";
import AboutPage from "../feature/about/about-us";
import ContactUsPage from "../feature/contact-us/contact-us";
import SplashPage from "../feature/splash/splash";

const router = createBrowserRouter([
    {
        path: "/",
        element: <SplashPage />
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
                <RegisterModal />
            </>
        )
    },
    {
        path: "/login",
        element: (
            <>
                <LoginModal />
            </>
        )
    },
    {
        path: "/about",
        element: (
            <>
                <Navbar />
                <AboutPage />
            </>
        )
    },
    {
        path: "/contact",
        element: (
            <>
                <Navbar />
                <ContactUsPage />
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