import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import {BrowserRouter as Router, Redirect} from "react-router-dom";
import SignIn from "./pages/SignIn";
import {Route, Switch} from "react-router";
import SignUp from "./pages/SignUp";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path={'/home'} component={Home}/>
            <Route path={'/signin'} component={SignIn}/>
            <Route path={'/signup'} component={SignUp}/>
            <Redirect to={'/signin'} />
        </Switch>
    </Router>
    ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
