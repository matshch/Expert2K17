import * as React from 'react';
import { Alert, Row, Col, Card, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import * as Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import * as UserStore from '../store/User';
import '../css/cards.css';

type LoginProps =
    LoginStore.LoginState
    & typeof LoginStore.actionCreators
    & UserStore.UserState
    & RouteComponentProps<{}>;

export class Login extends React.Component<LoginProps, { username: string, password: string, rememberme: boolean }> {
    constructor(props : LoginProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            rememberme: false
        };
    }

    SubmitLogin = () => {
        this.props.LogIn({
            "username": this.state.username,
            "password": this.state.password,
            "rememberMe": this.state.rememberme,
        })
    }

    usernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            username: e.target.value
        });
    }

    passwordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            password: e.target.value
        });
    }

    rememberMeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            rememberme: e.target.checked
        });
    }

    render() {
        if (this.props.user != undefined && this.props.user != null)
            return <Redirect to="/profile"/>
        if (this.props.loading)
            return <Spinner name="ball-scale-multiple"/>
        return (
            <div className="login">
                <Card>
                    <Form>
                        <FormGroup row>
                            <Label for="Login">Логин</Label>
                            <Input onChange={this.usernameChanged} id="Login" size="xs" type="text" placeholder="введите логин" />

                            <Label for="firstPass">Пароль</Label>
                            <Input onChange={this.passwordChanged} id="firstPass" size="xs" type="password" placeholder="введите пароль" />

                            <Label check>
                                <Row>
                                    <div className="checkBox">
                                        <Input onChange={this.rememberMeChanged} type="checkbox" />{''}
                                    </div>
                                    <div className="checkBoxLabel">
                                        <div>запомнить меня</div>
                                    </div>
                                </Row>
                            </Label>
                            {
                                (() => {
                                    if (this.props.ResponseObject !== null && this.props.ResponseObject.succeeded === false) {
                                        return (
                                            <Alert color="danger">
                                                <strong>Ошибка</strong> Неправильные имя пользователя или пароль.
                                            </Alert>
                                        )
                                    }
                                })()}
                            <Button onClick={this.SubmitLogin} block color="primary">Войти</Button>
                        </FormGroup>
                    </Form>
                </Card>
            </div>);
    }
}

export default connect(
    (state: ApplicationState) => ({...state.login, ...state.user}),
    LoginStore.actionCreators
)(Login);