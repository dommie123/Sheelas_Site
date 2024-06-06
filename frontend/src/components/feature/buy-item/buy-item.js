// React Imports
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Material Imports
import { Button } from "@mui/material";

// Slice Imports
import { checkoutItems } from "../../../slices/cart-slice";
import { addItem } from "../../../slices/cart-slice";
import { addToMessageQueue } from "../../../slices/global-slice";

// Custom Components
import BasicSelect from "../../common/select/select";

// Custom Imports
import { areItemsEqual } from "../../../utils/objects";

// Style Imports
import './buy-item.css';

export default function BuyItemPage() {
    const selectedItem = useSelector(state => state.items.selectedItem);
    const user = useSelector(state => state.login.loggedInUser);
    const cartItems = useSelector(state => state.cart.items);
    const [itemInCart, setItemInCart] = useState(false);
    const [quantitySelected, setQuantitySelected] = useState('1');
    const [quantityOptions, setQuantityOptions] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAddToCartDisabled = !Boolean(selectedItem.quantity > 0 && !itemInCart);

    const handleBuyNow = () => {
        // TODO payment gateway stuff
        dispatch(checkoutItems({ items: [{ ...selectedItem, quantity: quantitySelected }], user: user, accessToken: user.accessToken }));
        navigate("/thank-you");
    }

    const handleAddToCart = useCallback(() => {
        if (!itemInCart) {
            dispatch(addItem({
                ...selectedItem,
                quantity: quantitySelected
            }));
            dispatch(addToMessageQueue({ severity: "success", content: "Item added to cart!" }));
            navigate("/home");
        }
    }, [itemInCart, quantitySelected])

    useEffect(() => {
        if (!Boolean(selectedItem)) {
            return;
        }

        // Check if this item is already in the shopping cart. If so, do not add it.
        setItemInCart(false)
        for (let item of cartItems) {
            if (areItemsEqual(item, selectedItem)) {
                setItemInCart(true);
                break;
            }
        }  

        const newOptions = [];
        for (let i = 1; i <= selectedItem.quantity; i++) {
            newOptions.push(`${i}`);
        }

        setQuantityOptions(newOptions);
    }, [selectedItem, cartItems])

    return Boolean(selectedItem) ? (
        <div className="buy-item-container">
            <div className="buy-item-top-content">
                <img
                    src="https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg" 
                    className="buy-item-image"
                    alt={`${selectedItem.name}`}
                    aria-hidden="true"
                />
                <div className="buy-item-information">
                    <h2 className="item-title" aria-label={`${selectedItem.name} Item Name`}>{selectedItem.name}</h2>
                    <BasicSelect
                        value={quantitySelected}
                        className="item-quantity"
                        options={quantityOptions}
                        label="Quantity"
                        onChange={event => { setQuantitySelected(event.target.value) }}
                    />
                    <h3 className="item-price" aria-label={`${selectedItem.name} Item Price ${selectedItem.price}`}>{(selectedItem.quantity > 0) ? selectedItem.price : "Sold Out!"}</h3>
                    <div className="buy-item-button-suite">
                        <Button
                            className="buy-now-btn"
                            color="primary"
                            variant="contained"
                            onClick={handleBuyNow}
                            disabled={selectedItem.quantity === 0}
                            aria-label="Buy Now"
                        >
                            Buy Now
                        </Button>
                        <Button 
                            disabled={isAddToCartDisabled}
                            className="add-to-cart-btn"
                            color="secondary"
                            onClick={handleAddToCart}
                            aria-label="Add Item to Cart"
                            aria-disabled={isAddToCartDisabled}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
            <div className="buy-item-bottom-content">
                <p className="item-description" role="definition">{selectedItem.description}</p>
            </div>
        </div>
    ) : <h2 className="Buy Page Loading Text" aria-label="Buy Page Loading">Loading...</h2>
}