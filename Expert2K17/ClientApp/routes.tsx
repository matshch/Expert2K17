import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import FetchData from './components/FetchData';
import { TestCreater, TestCreaterSystem } from './components/CreateTest';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/login' component={Login} />
    <Route path='/CreateTest' component={TestCreater} />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
</Layout>;
