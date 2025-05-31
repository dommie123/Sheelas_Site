import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { toggleAcceptTOS } from '../../../../slices/admin-slice';

import { Card, FormControl, FormLabel, Checkbox } from '@mui/material';

import './tos-agreement.css';

const AdminApplicationTOS = () => {
    const [accepted, setAccepted] = useState(false);
    const dispatch = useDispatch();

    const handleCheckboxChange = () => {
        setAccepted(!accepted);
    };

    useEffect(() => {
        dispatch(toggleAcceptTOS(accepted));
        // eslint-disable-next-line
    }, [accepted])

    return (
        <Card className='tos-container'>
            <h1>Sheebay Terms of Service for Administrators</h1>
            <p>Effective Date: [Insert Date]</p>
            <p>Welcome to Sheebay! These Terms of Service (TOS) establish the expectations, responsibilities, and standards for all administrators (hereafter referred to as "Admins"). By accepting your role, you agree to comply with these terms and help foster a safe, transparent, and thriving community on Sheebay.</p>
            <hr />
            <h2>1. Core Values</h2>
            <p>At Sheebay, we believe in building a community that prioritizes creativity, integrity, and fairness. We ask all Admins to embrace and promote these guiding values:</p>
            <ul>
                <li>Protecting User Privacy: We value our users’ trust and are committed to safeguarding their data, whether they are buyers or sellers.</li>
                <li>Upholding Integrity: Our business model is built on honesty, security, and ethical practices.</li>
                <li>Promoting Fairness: We strive for unbiased decision-making in every interaction and ensure all users are treated with respect and equality.</li>
                <li>Championing Transparency: We empower our users by being open and clear in our processes, encouraging informed and confident decision-making.</li>
                <li>Inspiring Creativity: Sheebay is a space where imagination thrives. We encourage everyone to explore new ideas and push creative boundaries.</li>
            </ul>
            <hr />
            <h2>2. Rules and Prohibited Conduct</h2>
            <p>To maintain the integrity of Sheebay’s platform, all Admins are expected to observe the following rules and avoid the prohibited activities listed below. Non-compliance will result in disciplinary actions, as outlined in Section 3.</p>
            <h3>2.1. Administrator Responsibilities</h3>
            <p>Admins are expected to act in accordance with Sheebay’s core values and fulfill their duties with professionalism, fairness, and respect for all users and fellow admins.</p>
            <p>Admins must remove items or users that do not comply with Sheebay’s policies, including (but not limited to): </p>
            <ul>
                <li>Lewd, raunchy, or offensive content</li>
                <li>Services or other intangible items</li>
                <li>Items promoting hate speech, bigotry, or discrimination</li>
            </ul>
            <h3>2.2. Prohibited Conduct</h3>
            <p>Admins must refrain from the following actions:</p>
            <ul>
                <li>Engaging in Political or Religious Activities on behalf of Sheebay or its staff</li>
                <li>Participation in Illegal Activities, including:</li>
                <ul>
                    <li>Theft or misappropriation of funds</li>
                    <li>Market manipulation or identity theft</li>
                    <li>Money laundering or cryptocurrency scams</li>
                    <li>Any form of cybercrime or activities that could reasonably be perceived as such</li>
                </ul>
                <li>Removal of Users or Items (unless done so purely in good faith and in accordance with Sheebay’s policies)</li>
                <li>Harassment and Retaliation</li>
                <ul>
                    <li>Harassment of users, fellow admins, or the site owner is strictly forbidden.</li>
                    <li>Retaliation against individuals who report inappropriate or illegal behavior in good faith is prohibited.</li>
                </ul>
                <li>Acceptance of Bribes</li>
                <ul>
                    <li>Admins must not engage in bribery or accept gifts that could be perceived as bribes.</li>
                </ul>
            </ul>
            <h3>2.3. Approval of Changes</h3>
            <ul>
                <li>Site Changes: Any proposed change to the site must be approved by no less than 80% of all site admins, including the site owner.</li>
                <li>Business Model or Core Values: Changes to the business model or core values must receive unanimous approval from all site admins, including the site owner.</li>
            </ul>
            <hr />
            <h2>3. Consequences for Non-Compliance</h2>
            <p>Violations of these terms will result in disciplinary actions proportionate to the severity and frequency of the violation. These actions include, but are not limited to:</p>
            <ul>
                <li>First Offense: A written warning issued via email or other formal written communication.</li>
                <li>Second Offense: A verbal intervention and temporary restriction of administrative privileges for up to 24 hours.</li>
                <li>Third Offense: Revocation of administrative privileges, requiring the admin to reapply for administrative status.</li>
                <li>Fourth and Subsequent Offenses: Permanent removal of the admin’s account from Sheebay.</li>
            </ul>
            <p>In cases of particularly severe misconduct, Sheebay reserves the right to bypass the above steps and take immediate action, including permanent removal and legal recourse to the fullest extent permitted by law.</p>
            <hr />
            <h2>4. Amendments to the Terms</h2>
            <p>Sheebay reserves the right to update or modify these Terms of Service at any time. Admins will be notified of significant changes through email or a platform announcement. Continued participation as an admin after such notice constitutes acceptance of the revised terms.</p>
            <hr />
            <h2>5. Contact Information</h2>
            <p>For inquiries or further clarification regarding these Terms of Service, please contact:</p>
            <p>beegyoshi9817@gmail.com</p>
            <FormControl className='tos-accept-control'>
                <Checkbox checked={accepted} onChange={handleCheckboxChange} />
                <FormLabel>I accept the Terms of Service</FormLabel>
            </FormControl>
        </Card>
    );
};

export default AdminApplicationTOS;