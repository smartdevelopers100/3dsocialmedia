import React from 'react';
import './User.css';
import {NavLink} from 'react-router-dom';

export function UserPhoto({user}) {
    return (
        <NavLink to={`/user/${user.uid}`}>
            <img src={user.photoURL} className="user-photo" alt="Not available" title="Image" />
        </NavLink>
    );
}

export function UserDisplayName({user}) {
    return (
        <NavLink to={`/user/${user.uid}`} className="user-display-name">
            {user.displayName}
        </NavLink>
    );
}



