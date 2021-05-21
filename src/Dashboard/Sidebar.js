import React from 'react';
import './Sidebar.css';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {NavLink} from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useDispatch} from 'react-redux';
import * as authActionTypes from '../action_types/auth';

const  SidebarItem = React.memo(({item}) => {
    if(item.onClick)
    {
        return (
            <div className="sidebar-item" onClick={item.onClick}>
                <div className="sidebar-item__icon">{<item.Icon />}</div>
                <div className="sidebar-item__title">{item.title}</div>
            </div>
        );
    }
    return (
        <NavLink exact to={item.to} className="sidebar-item">
            <div className="sidebar-item__icon">{<item.Icon />}</div>
            <div className="sidebar-item__title">{item.title}</div>
        </NavLink>
    );
});

function Sidebar() {
    const dispatch = useDispatch();
    const items = [
        {
            Icon: HomeIcon,
            title: "Home",
            to: "/"
        },
        {
            Icon: AccountCircleIcon,
            title: "Profile",
            to: "/profile"
        },
        {
            Icon: NotificationsIcon,
            title: "Notifications",
            to: "/notifications"
        },
        {
            Icon: ExitToAppIcon,
            title: "Log out",
            onClick: () => {
                dispatch({
                    type: authActionTypes.LOGOUT_LOADING
                 });

                dispatch({
                   type: authActionTypes.LOGOUT
                });
            }
        }
    ];

    return (
        <div className="sidebar-wrapper">
            <nav className="sidebar">
                {items.map((item, index) => (
                    <SidebarItem key={index} item={item} />
                ))}
            </nav>
        </div>
        );
}

export default Sidebar;
