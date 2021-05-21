import React from 'react';
import './Loading.css';

function Loading({size}) {
    return (
        <div className="loading">
            <div className="loading-content" style={{ 
                width: size,
                height: size
            }}></div>
        </div>
    );
}

export default Loading;
