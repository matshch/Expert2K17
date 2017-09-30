import * as React from 'react';
import { Card, CardBlock, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import '../css/cards.css';

type LoginProps =
    LoginStore.LoginState
    & typeof LoginStore.actionCreators
    & RouteComponentProps<{}>;

export class Login extends React.Component<LoginProps, { name: string, surname: string, patronymic: string, password: string }> {
    constructor() {
        super();
        this.state = {
            name: "",
            surname: "",
            patronymic: "",
            password: ""
        };
    }

    getLoginUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }

    getLoginPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            password: e.target.value
        });
    }

    render() {
        return (
            <div className="lg-card login ">
                <Card>
                    <Form>
                        <FormGroup row>
                            <Label for="exampleEmail">Логин</Label>
                            <Input size="xs" type="text" name="login" id="Login" placeholder="введите логин" />
                            <Label for="examplePassword">Пароль</Label>
                            <Input size="xs" type="password" name="password" id="Password" placeholder="введите пароль" />
                            <ButtonGroup className="btn-block">
                                <Button block>Войти</Button>
                                <Button color="primary">Зарегистрироваться</Button>
                            </ButtonGroup>
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