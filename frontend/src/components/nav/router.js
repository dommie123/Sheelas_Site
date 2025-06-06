import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import SellerAppPage from "../feature/seller-app-page/seller-app-page";
import EditItemPage from "../feature/edit-item/edit-item";
import WelcomePage from "../feature/register/welcome/welcome";
import AdminAppPage from "../feature/admin-app-page/admin-app-page";
import AdminLayout from "../feature/admin/admin-layout";

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
        path: "/register/welcome",
        element: (
            <>
                <WelcomePage />
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
        path: '/update-item',
        element: (
            <>
                <Navbar />
                <EditItemPage />
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
        path: '/seller-application',
        element: (
            <>
                <Navbar />
                <SellerAppPage />
            </>
        )
    },
    {
        path: '/admin-application',
        element: (
            <>
                <Navbar />
                <AdminAppPage />
            </>
        )
    },
    {
        path: '/admin',
        element: (
            <>
                <Navbar />
                <AdminLayout />
            </>
        )
    },
    {
        path: '/error',
        element: (
            <ErrorPage />
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