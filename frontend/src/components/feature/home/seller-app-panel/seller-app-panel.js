import React from "react";

import { UserApplicationPanel } from "../../../common/app-panel/app-panel";

import './seller-app-panel.css';

export default function SellerApplicationPanel() {
    const panelContent = (
        <>
            <h2 className="seller-app-panel-title">Have Items to Sell?</h2>
            <p className="seller-app-panel-paragraph">
                Apply to become a seller today! We'd love to welcome you aboard the SheeBay team! All it takes is a few minutes of your time!
            </p>
        </>
    )

    return (
        <UserApplicationPanel
            className="seller"
            panelContent={panelContent}
            appPage={'/seller-application'}
        />
    )
}