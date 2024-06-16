import React, { useState, useEffect, useRef } from 'react';

import { IconButton } from '@mui/material';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import './caroucel.css';

export default function Caroucel(props) {
    const { changeInSeconds, className } = props;
    const totalPages = props.children.length;
    const [currentPage, setCurrentPage] = useState(1);
    const timeoutRef = useRef(null);

    const handlePreviousImage = () => {
        const newPage = currentPage === 1 ? totalPages : currentPage - 1;
        setCurrentPage(newPage);
    }

    const handleNextImage = () => {
        const newPage = currentPage === totalPages ? 1 : currentPage + 1;
        setCurrentPage(newPage);
    }

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        if (totalPages > 1) {
            resetTimeout();
            timeoutRef.current = setTimeout(handleNextImage, changeInSeconds * 1000);
        }

        return () => {
            resetTimeout();
        }
        //eslint-disable-next-line
    }, [currentPage, changeInSeconds, totalPages]);

    const handlePageButtonClick = (pageIndex) => {
        resetTimeout();
        setCurrentPage(pageIndex + 1);
    }

    return (    
        <div className={`${className} caroucel-container`}>
            <div className='caroucel-content'>
                {props.children[currentPage - 1]}
                <IconButton 
                    className='caroucel-previous-image-btn' 
                    aria-label='Previous Image' 
                    title='Previous Image' 
                    onClick={() => {
                        resetTimeout();
                        handlePreviousImage();
                    }}
                    disabled={totalPages <= 1}
                >
                    <ArrowLeftIcon />
                </IconButton>
                <IconButton
                    className='caroucel-next-image-btn'
                    aria-label='Next Image'
                    title='Next Image'
                    onClick={() => {
                        resetTimeout();
                        handleNextImage();
                    }}
                    disabled={totalPages <= 1}
                >
                    <ArrowRightIcon />
                </IconButton>
                <div className='caroucel-page-buttons'>
                    {props.children.map((_, index) => 
                        <button 
                            key={index}
                            className={index === currentPage - 1 ? "page-button page-button-active" : "page-button"} 
                            onClick={() => handlePageButtonClick(index)}
                        >
                        </button>)
                    }
                </div>
            </div>
        </div>
    )
}
