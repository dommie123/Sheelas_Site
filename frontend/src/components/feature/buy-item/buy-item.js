import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@mui/material";

import BasicSelect from "../../common/select/select";

import './buy-item.css';

export default function BuyItemPage() {
    const selectedItem = useSelector(state => state.items.selectedItem);
    // const selectedItem = {
    //     name: "Squidward's Trumpet 75890432758uikgfy9ryhtlgk fjdsyhuguy4383957 wejhfuidsa78i475u irhewfiuyu8 dosiuauyt8fgywirqy89dsyafsd hkfiuwa6y7849r5y32ui",
    //     description: "Squidward used to play this all the time! That was before his hopes and dreams sadly passed away. Now this serves as a memento of what once was",
    //     price: 19.99,
    //     quantity: 10
    // }
    const [quantitySelected, setQuantitySelected] = useState('1');
    const [quantityOptions, setQuantityOptions] = useState([]);
    const dispatch = useDispatch();

    const handleBuyNow = () => {
        // TODO alter item quantity once user buys, or mark as sold out after user buys all of it
    }

    const  handleAddToCart = () => {
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
                    <h3 className="item-price">{selectedItem.price}</h3>
                    <div className="buy-item-button-suite">
                        <Button
                            className="buy-now-btn"
                            color="primary"
                            variant="contained"
                            onClick={handleBuyNow}
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