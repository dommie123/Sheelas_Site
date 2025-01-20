import React, { useState, useEffect } from "react";
import { SellerPlanCard } from "../seller-plan-card/seller-plan-card";

import './seller-plan-radio-group.css';

export const SellerPlanRadioGroup = ({ options, onChange }) => {   // option = {id: number, name: string, price: string, rateType: string}
    const [currentValue, setCurrentValue] = useState("");

    const handleChangeOption = (index) => {
        setCurrentValue(options[index].id);
        console.log({value: options[index].id})
    }

    useEffect(() => {
        if (Boolean(!onChange)) {
            return;
        }

        onChange(currentValue);
    }, [currentValue, onChange])

    return (
        <div className="seller-plan-radio-group">
            {options.map((option, index) => 
                <SellerPlanCard 
                    option={option.name} 
                    onClick={() => { handleChangeOption(index); }}
                    className={(option.id === currentValue) ? "selected-seller-plan" : ""}
                >
                    <h2 className="seller-plan-option-price-wrapper">
                        <span className="seller-plan-option-price">{option.price}/</span>
                        <span className="seller-plan-option-price-per">{option.rateType}</span>
                    </h2>
                    <ul className="seller-plan-option-details-list">
                        {option.details.map(detail => 
                            <li className="seller-plan-option-details-list-item">{detail}</li>
                        )}
                    </ul>
                </SellerPlanCard>
            )}
        </div>
    )
}