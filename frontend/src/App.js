import React from 'react';
import {NavLink} from 'react-router-dom';

import { Header } from './components/common/header/header';
import Router from './components/nav/router';

import './App.css';

function App() {
    return (
        <Router>
            <Header title="Hello World!">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/login">Log In</NavLink>
                <NavLink to="/register">Sign Up</NavLink>
            </Header>
        </Router>
    );
}

export default App;
