import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Panel from './components/Panel';
import Profile from './components/Profile';
import { TestCreater, TestCreaterSystem } from './components/CreateTest';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/login' component={Login} />
    <Route path='/panel' component={Panel} />
    <Route path='/Profile' component={Profile} />
    <Route path='/CreateTest' component={TestCreater} />
</Layout>;
