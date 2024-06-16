import React from "react";
import { Link } from "react-router-dom";

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import './contact-footer.css';

export default function ContactFooter() {
    return (
        <footer className="contact-footer">
            <p className="contact-footer-heading">
                Need help? Contact us <Link to="/">here</Link>.
            </p>
            <p className="other-contact-methods">
                <span className="contact-method contact-method-header">Or contact us using the following methods:</span>
                <span className="contact-method phone-contact"><PhoneIcon className="contact-icon" /> (555) 555-5555</span>
                <span className="contact-method email-contact"><EmailIcon className="contact-icon" /> abc@mail.com</span>
            </p>
        </footer>
    )
}