import React from 'react';

import Router from './components/nav/router';
import { SimplifiedSnackbar } from './components/common/snackbar/snackbar';

import './App.css';

function App() {
    return (
        <>
            <Router />
            <SimplifiedSnackbar />
        </>
    );
}

export default App;
