import React from 'react';
import './Content.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Posts from './Posts';
import Post from './Post';
import Profile from './Profile';
import Notifications from './Notifications';

function Content() {
    return (
        <div className="content">
            <Switch>
                <Route path="/notifications">
                    <Notifications />
                </Route>
                <Route path="/profile">
                    <Profile />
                </Route>
                <Route path="/post/:postId">
                    <Post />
                </Route>
                <Route exact path="/">
                    <Posts />
                </Route>
                <Redirect to="/" />
            </Switch>      
        </div>
    );
}

export default Content;
