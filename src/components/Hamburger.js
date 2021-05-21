import React from 'react';
import './Hamburger.css';

function Hamburger({onClick}) {
    return (
        <div className="hamburger" onClick={onClick}>
            <div className="hamburger__line"></div>
            <div className="hamburger__line"></div>
            <div className="hamburger__line"></div>
        </div>
    );
}

export default Hamburger;
