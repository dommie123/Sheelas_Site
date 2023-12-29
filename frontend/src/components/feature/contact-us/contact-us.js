import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, Button, InputLabel } from '@mui/material';

import RadioButtonsGroup from '../../common/radio-group/radio-group';
import BasicSelect from '../../common/select/select';

import { addToMessageQueue } from '../../../slices/global-slice';
import { showError } from '../../../utils/error';
import { authPostRequest } from '../../../utils/axios-helpers';

import './contact-us.css';

export default function ContactUsPage() {
    const user = useSelector(state => state.login.loggedInUser);
    const [productName, setProductName] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [issue, setIssue] = useState("");
    const [comments, setComments] = useState("");
    const dispatch = useDispatch();
    
    const submitTicket = () => {
        const reqBody = {
            product_name: productName,
            is_seller: isSeller,
            issue,
            comments
        };

        authPostRequest('ticket', reqBody, user.accessToken)
            .then(res => dispatch(addToMessageQueue({severity: 'success', content: 'Your ticket was successfully submitted!'})))
            .catch(err => showError(err.message));
    }

    return (
        <div className="contact-page-container">
            <h2 className='contact-page-title-text'>How can we help?</h2>
            <TextField 
                variant='outlined'
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                label='Name of product'
                className='product-name-field'
            />
            <RadioButtonsGroup
                className="is-seller-field"
                label='Are you a...'
                options={[
                    { value: "buyer", label: "Buyer"},
                    { value: "seller", label: "Seller"}
                ]}
                onChange={(e) => setIsSeller(Boolean(e.target.value === "seller"))}
            />
            <BasicSelect
                className="issue-field"
                label="Select your issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                options={[
                    'Test1',
                    'Test2',
                    'Test3'
                ]}
            />
            <div className='comments-field-container'>
                <InputLabel className='comments-field-label'>Tell us more</InputLabel>
                <textarea className='comments-field' onChange={(e) => setComments(e.target.value)} />
            </div>
            <Button variant="contained" className='submit-ticket-button' onClick={submitTicket}>Submit</Button>
        </div>
    )
}