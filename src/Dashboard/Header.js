import React, { useLayoutEffect} from 'react';
import './Header.css';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import * as settings from '../config/settings';

function Header() {

    const user = useSelector(state => state.auth.user);

    useLayoutEffect(() => {
        const handleClick = e => {
            if(window.innerWidth <= 576)
            {
                const activeSidebar = document.querySelector('.sidebar.active');
                if(activeSidebar)
                {
                        activeSidebar.classList.remove("active");
                        activeSidebar.parentElement.classList.remove("active");
                }  
            }  
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        }

    }, []);

    const toggleSidebar = e => {
        e.stopPropagation();

        const sidebar = document.querySelector('.sidebar');
        if(sidebar)
        {
            sidebar.classList.toggle("active");
            sidebar.parentElement.classList.toggle("active");
        }
    }

    return (
        <header className="header">
            <div className="header__left">
                <div className="menu-icon" onClick={toggleSidebar}>
                    <MenuIcon />
                </div>
                <div className="brand">{settings.APP_NAME}</div>
            </div> 
            <div className="header__right">
                <NavLink to={`/notifications`}>
                    <NotificationsIcon className="header__right-icon" />
                </NavLink>
                <NavLink to={'/profile'}>
                    {user.photoURL ? <img src={user.photoURL} alt="Not avaiable" title={user.displayName} className="header__right-icon header__profile-image" /> : <AccountCircleIcon className="header__right-icon" />}
                </NavLink>
            </div>
        </header>
    );
}

export default Header;
