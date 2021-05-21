import React from 'react';
import './Dashboard.css'; 
import Header from './Dashboard/Header';
import Sidebar from './Dashboard/Sidebar';
import Content from './Dashboard/Content';

function Dashboard() {
    return (
        <div className="dashboard"> 
            <Header />
            <div className="dashboard__group">
                <Sidebar />
                <Content />
            </div>
        </div>
    );
}

export default Dashboard;


