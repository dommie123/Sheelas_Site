import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { Navbar } from "./navbar";
import { RegisterModal } from "../feature/register/register-modal";
import { LoginModal } from "../feature/login/login-modal";
import HomePage from "../feature/home/home";
import AboutPage from "../feature/about/about-us";
import ContactUsPage from "../feature/contact-us/contact-us";
import SplashPage from "../feature/splash/splash";
import SellItemPage from "../feature/sell-item/sell-item-page";
import BuyItemPage from "../feature/buy-item/buy-item";
import ThankYouPage from "../feature/buy-item/thank-you/thank-you";
import ProfileSettingsPage from "../feature/profile-settings/profile-settings";
import ErrorPage from "../error/error-page";

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
                <HomePage />
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
    {
        path: '/sell',
        element: (
            <>
                <Navbar />
                <SellItemPage />
            </>
        )
    },
    {
        path: '/buy',
        element: (
            <>
                <Navbar />
                <BuyItemPage />
            </>
        )
    },
    {
        path: '/thank-you',
        element: (
            <>
                <Navbar />
                <ThankYouPage />
            </>
        )
    },
    {
        path: '/profile-settings',
        element: (
            <>
                <Navbar />
                <ProfileSettingsPage />
            </>
        )
    },
    {
        path: '/error',
        element: (
            <ErrorPage />
        )
    }
]);

export default function Router(props) {
    return (
        <RouterProvider router={router}>
            {props.children}
        </RouterProvider>
    )
}