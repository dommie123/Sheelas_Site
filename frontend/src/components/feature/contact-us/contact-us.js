import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, Button, InputLabel } from '@mui/material';

import RadioButtonsGroup from '../../common/radio-group/radio-group';
import BasicSelect from '../../common/select/select';
import { Header } from '../../common/header/simple-header';
import { Navbar } from '../../nav/navbar';

import { postGuestSupportTicket, postSupportTicket } from '../../../slices/ticket-slice';

import { showError } from '../../../utils/error';
import { objectIsEmpty } from '../../../utils/objects';
import { alertUser } from '../../../utils/alert-helpers';

import './contact-us.css';

export default function ContactUsPage() {
    const user = useSelector(state => state.login.loggedInUser);
    const error = useSelector(state => state.ticket.error);
    const [productName, setProductName] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [issue, setIssue] = useState("");
    const [comments, setComments] = useState("");
    const [ticketSubmitted, setTicketSubmitted] = useState(false);
    const dispatch = useDispatch();

    const submitTicket = () => {
        const reqBody = {
            product_name: productName,
            is_seller: isSeller,
            issue,
            comments
        };

        if (objectIsEmpty(user)) {
            dispatch(postGuestSupportTicket(reqBody));
        } else {
            dispatch(postSupportTicket({ ticketData: reqBody, accessToken: user.accessToken }));
        }

        setTicketSubmitted(true);
    }

    useEffect(() => {
        if (ticketSubmitted && !error) {
            alertUser("Your ticket has been successfully submitted!");
        } else if (ticketSubmitted && error) {
            showError(error);
        }
    }, [error, ticketSubmitted]);

    return (
        <>
            { objectIsEmpty(user) ? <Header title="SheeBay" /> : <Navbar />}
            <div className="contact-page-container">
                <h2 className='contact-page-title-text' aria-label='How can we help'>How can we help?</h2>
                <TextField
                    variant='outlined'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    label='Name of product'
                    className='product-name-field'
                    aria-label='Product Name'
                />
                <RadioButtonsGroup
                    className="is-seller-field"
                    label='Are you a...'
                    options={[
                        { value: "buyer", label: "Buyer" },
                        { value: "seller", label: "Seller" }
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
                    <InputLabel className='comments-field-label' id="comments-field-label-el">Tell us more</InputLabel>
                    <textarea className='comments-field' aria-labelledby="comments-field-label-el" onChange={(e) => setComments(e.target.value)} />
                </div>
                <Button
                    variant="contained"
                    className='submit-ticket-button'
                    aria-label="Submit Ticket"
                    onClick={submitTicket}
                >
                    Submit
                </Button>
            </div>
        </>
    )
}