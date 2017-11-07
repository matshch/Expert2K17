import * as React from 'react';
import * as Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import * as UserStore from '../store/User';

type LoginProps =
    UserStore.UserState
    & typeof LoginStore.actionCreators
    & RouteComponentProps<{}>;

export class Login extends React.Component<LoginProps, {}> {
    componentDidMount() {
        this.props.Logout();
    }

    render() {
        if (this.props.user != undefined && this.props.user != null)
            return <Spinner name="ball-scale-multiple"/>
        return <Redirect to="/"/>;
    }
}

export default connect(
    (state: ApplicationState) => ({...state.user}),
    LoginStore.actionCreators
)(Login);