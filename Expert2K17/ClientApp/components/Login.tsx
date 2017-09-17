import * as React from 'react';
import { Card, CardBlock, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import '../css/cards.css';

export default class Login extends React.Component<RouteComponentProps<{}>, {}> {
    render() {
        return (
            <div className="login">
                <Card>
                    <Form>
                        <FormGroup row>
                            <Label for="exampleEmail">Логин</Label>
                            <Input size="xs" type="text" name="login" id="Login" placeholder="введите логин" />
                            <Label for="examplePassword">Пароль</Label>
                            <Input size="xs" type="password" name="password" id="Password" placeholder="введите пароль" />
                            <Button block>Войти</Button>
                        </FormGroup>
                    </Form>
                </Card>
            </div>);
    }
}
