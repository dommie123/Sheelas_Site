import React from 'react';

import { Header } from '../../common/header/simple-header';

import Caroucel from '../../common/caroucel/caroucel';
import ShortIntro from './short-intro/short-intro';
import ContactFooter from './contact-footer/contact-footer';

import carouselImage1 from '../../../assets/21765537397587500.jpg';
import carouselImage2 from '../../../assets/435714778396608670.jpg';
import carouselImage3 from '../../../assets/1874669376407842308.jpg';
import carouselImage4 from '../../../assets/3100635266071957175.jpg';
import carouselImage5 from '../../../assets/3619904884067590770.jpg';
import carouselImage6 from '../../../assets/6094148687442355107.jpg';
import carouselImage7 from '../../../assets/6303095127812613036.jpg';
import carouselImage8 from '../../../assets/8439168249699212535.jpg';

import './splash.css';

export default function SplashPage() {
    return (
        <div className='splash-container'>
            <Header title="SheeBay" />
            <Caroucel changeInSeconds={5}>
                <img src={carouselImage1} alt='Random here 1' />
                <img src={carouselImage2} alt='Random here 2' />
                <img src={carouselImage3} alt='Random here 3' />
                <img src={carouselImage4} alt='Random here 4' />
            </Caroucel>
            <ShortIntro />
            <Caroucel changeInSeconds={7}>
                <img src={carouselImage5} alt='Random here 5' />
                <img src={carouselImage6} alt='Random here 6' />
                <img src={carouselImage7} alt='Random here 7' />
                <img src={carouselImage8} alt='Random here 8' />
            </Caroucel>
            <ContactFooter />
        </div>
    )
}