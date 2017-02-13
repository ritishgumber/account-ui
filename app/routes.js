import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import React from 'react';

//components
import Login from './components/login.js';
import Register from './components/register.js';
import Reset from './components/reset.js';
import ChangePassword from './components/changePassword.js';
import Activate from './components/activate.js';
import NewServer from './components/newServer.js';
import AppReActivate from './components/appReActivate.js';
import Layout from './layout.js';

const routes_prod = (
    <Route path="/" component={Layout}>
        <IndexRoute component={Login}/>
        <Route path="login" component={Login}/>
        <Route path="activate" component={Activate}/>
        <Route path="signup" component={Register}/>
        <Route path="reset" component={Reset}/>
        <Route path="changepassword" component={ChangePassword}/>
        <Route path="reactivate/:appId" component={AppReActivate}/>
    </Route>
)

const routes_dev = (
    <Route>
        <Route path="/" component={Layout}>
            <IndexRoute component={Login}/>
            <Route path="login" component={Login}/>
            <Route path="reset" component={Reset}/>
            <Route path="changepassword" component={ChangePassword}/>
            <Route path="reactivate/:appId" component={AppReActivate}/>
        </Route>
        <Route path="/newserver" component={NewServer}></Route>
    </Route>
)

export default {
    routes_prod : routes_prod,
    routes_dev : routes_dev
}
