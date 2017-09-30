import * as React from 'react';
import { Card, CardBlock, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as RegisterStore from '../store/Register';
import '../css/cards.css';

type RegisterProps =
    RegisterStore.RegisterState
    & typeof RegisterStore.actionCreators
    & RouteComponentProps<{}>;

export class Register extends React.Component<RegisterProps, { name: string, surname: string, patronymic: string, password: string }> {
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
            <div className="lg-card register">
                <Card>
                    <Form>
                        <FormGroup row>
                            <Label for="exampleEmail">Логин</Label>
                            <Input size="xs" type="text" placeholder="введите логин" />
                            <Label for="exampleEmail">Имя</Label>
                            <Input size="xs" type="text" placeholder="введите имя" />
                            <Label for="exampleEmail">Фамилия</Label>
                            <Input size="xs" type="text" placeholder="введите фамилию" />
                            <Label for="examplePassword">Пароль</Label>
                            <Input size="xs" type="password" placeholder="введите пароль" />
                            <Label for="examplePassword">Повторите пароль</Label>
                            <Input size="xs" type="password" placeholder="повторно введите пароль" />
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
    (state: ApplicationState) => state.register,
    RegisterStore.actionCreators
)(Register);