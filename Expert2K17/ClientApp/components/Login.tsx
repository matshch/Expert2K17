import * as React from 'react';
import { Row, Col, Card, CardBlock, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import '../css/cards.css';

type LoginProps =
    LoginStore.LoginState
    & typeof LoginStore.actionCreators
    & RouteComponentProps<{}>;

export class Login extends React.Component<LoginProps, { username: string, password: string, rememberme: boolean }> {
    constructor() {
        super();
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

                            <Button onClick={this.SubmitLogin} block color="primary">Войти</Button>
                        </FormGroup>
                    </Form>
                </Card>
            </div>);
    }
}

export default connect(
    (state: ApplicationState) => state.login,
    LoginStore.actionCreators
)(Login);