import React from 'react';
import './ProgressBar.css';

function ProgressBar({percentage}) {
    return (
        <div className="progress-bar">
            <div className="progress-bar-content"  style={{
                    width: `${percentage}%`,
                    minWidth: 50
                }}>
                {percentage} %
            </div>
        </div>
    );
}

export default ProgressBar;
