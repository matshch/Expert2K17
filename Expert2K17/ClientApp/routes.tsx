import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Test from './components/Test';
import Login from './components/Login';
import Register from './components/Register';
import Panel from './components/Panel';
import Profile from './components/Profile';
import Tester from './components/CreateTest';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/login' component={Login} />
    <Route path='/register' component={Register} />
    <Route path='/panel' component={Panel} />
    <Route path='/Profile' component={Profile} />
    <Route path='/CreateTest' component={Tester}/>
    <Route path='/EditTest/:id' component={Tester} />
    <Route path='/test/:id' component={Test} />
</Layout>;
