import React, { useEffect } from 'react';
import  { useDispatch } from 'react-redux';

import { setMobile } from './slices/global-slice';

import Router from './components/nav/router';
import { SimplifiedSnackbar } from './components/common/snackbar/snackbar';

import './App.css';

function App() {
    const dispatch = useDispatch();
    const checkIsMobile = Boolean(window.innerWidth < 750);

    useEffect(() => {
        console.log({width: window.innerWidth, checkIsMobile});

        dispatch(setMobile(checkIsMobile));
    }, [checkIsMobile]);

    return (
        <>
            <Router />
            <SimplifiedSnackbar />
        </>
    );
}

export default App;
