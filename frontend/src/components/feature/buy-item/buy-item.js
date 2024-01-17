import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@mui/material";

import { addToMessageQueue } from "../../../slices/global-slice";
import { authPutRequest } from "../../../utils/axios-helpers";
import { showError } from '../../../utils/error';

import BasicSelect from "../../common/select/select";

import './buy-item.css';

export default function BuyItemPage() {
    const selectedItem = useSelector(state => state.items.selectedItem);
    const user = useSelector(state => state.login.loggedInUser);
    const [quantitySelected, setQuantitySelected] = useState('1');
    const [quantityOptions, setQuantityOptions] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBuyNow = () => {
        // TODO payment gateway stuff
        const price = Number.parseFloat(selectedItem.price.split("$")[1]);
        authPutRequest(`item/${selectedItem.name}`, { ...selectedItem, price, quantity: selectedItem.quantity - 1 }, user.accessToken)
            .then(() => {
                // TODO navigate to Thank you page instead of home page
                dispatch(addToMessageQueue({ severity: "success", content: "Thank you for your purhcase!" }));
                navigate("/home");
            }).catch(err => {
                showError(err.message);
            })
    }

    const handleAddToCart = () => {
        // TODO work on this after cart functionality is added
    }

    useEffect(() => {
        if (!Boolean(selectedItem)) {
            return;
        }

        const newOptions = [];
        for (let i = 1; i <= selectedItem.quantity; i++) {
            newOptions.push(`${i}`);
        }
        setQuantityOptions(newOptions);
    }, [selectedItem])

    return Boolean(selectedItem) ? (
        <div className="buy-item-container">
            <div className="buy-item-top-content">
                <img
                    src="https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg" 
                    className="buy-item-image"
                    alt={`${selectedItem.name}`}
                />
                <div className="buy-item-information">
                    <h2 className="item-title">{selectedItem.name}</h2>
                    <BasicSelect
                        value={quantitySelected}
                        className="item-quantity"
                        options={quantityOptions}
                        label="Quantity"
                        onChange={event => { setQuantitySelected(event.target.value) }}
                    />
                    <h3 className="item-price">{(selectedItem.quantity > 0) ? selectedItem.price : "Sold Out!"}</h3>
                    <div className="buy-item-button-suite">
                        <Button
                            className="buy-now-btn"
                            color="primary"
                            variant="contained"
                            onClick={handleBuyNow}
                            disabled={selectedItem.quantity === 0}
                        >
                            Buy Now
                        </Button>
                        <Button 
                            disabled
                            className="add-to-cart-btn"
                            color="secondary"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
            <div className="buy-item-bottom-content">
                <p className="item-description">{selectedItem.description}</p>
            </div>
        </div>
    ) : <h2>Loading...</h2>
}