import * as React from 'react';
import { Card, CardBlock, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import '../css/cards.css';

export default class Login extends React.Component<RouteComponentProps<{}>, { type: boolean, fadetype: string[] }> {
    constructor() {
        super();
        this.state = {
            type: true,
            fadetype: ["fade-in", "fade-out"]
        };
    }

    setStateFade(array: number[]) {
        var str_1 = "";
        var str_2 = "";
        if (array[0] == 1) {
            //this.setState({ type: true })
        } else {
            //this.setState({ type: false })
        }
        if (array[1] == 1) {
            //this.setState({ type: true })
            str_1 = "fade-in"
        } else {
            str_1 = "fade-out";
        }
        if (array[2] == 1) {
            str_2 = "fade-in"
        } else {
            str_2 = "fade-out";
        }
        this.setState({ fadetype: [str_1, str_2] })
    }

    render() {
        if (this.state.type) {
            return (
                <div className="lg-card login ">
                    <Card>
                        <Form>
                            <FormGroup className={"logFormGroup " + this.state.fadetype[0]} row onAnimationEnd={() => this.setState((state) => ({type: state.fadetype[0] == "fade-out"}))}>
                                <Label for="exampleEmail">Логин</Label>
                                <Input size="xs" type="text" name="login" id="Login" placeholder="введите логин" />
                                <Label for="examplePassword">Пароль</Label>
                                <Input size="xs" type="password" name="password" id="Password" placeholder="введите пароль" />
                                <ButtonGroup className="btn-block">
                                    <Button block onClick={() => this.setStateFade([1, -1, -1])}>Войти</Button>
                                    <Button onClick={() => this.setStateFade([0, 0, 1])} color="primary">Зарегистрироваться</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Card>
                </div>);
        } else {
            return (
                <div className="lg-card register">
                    <Card>
                        <Form>
                            <FormGroup className={"regFormGroup " + this.state.fadetype[1]} row onAnimationEnd={() => this.setState((state) => ({type: state.fadetype[1] == "fade-out"}))}>
                                <Label for="exampleEmail">Логин</Label>
                                <Input size="xs" type="text" name="login" id="Login" placeholder="введите логин" />
                                <Label for="exampleEmail">Имя</Label>
                                <Input size="xs" type="text" name="login" id="Name" placeholder="введите имя" />
                                <Label for="exampleEmail">Фамилия</Label>
                                <Input size="xs" type="text" name="login" id="LastName" placeholder="введите фамилию" />
                                <Label for="examplePassword">Пароль</Label>
                                <Input size="xs" type="password" name="password" id="Password" placeholder="введите пароль" />
                                <Label for="examplePassword">Повторите пароль</Label>
                                <Input size="xs" type="password" name="password" id="Password" placeholder="повторно введите пароль" />
                                <ButtonGroup className="btn-block">
                                    <Button block onClick={() => this.setStateFade([1, 1, 0])}>Войти</Button>
                                    <Button onClick={() => this.setStateFade([0, -1, -1])} color="primary">Зарегистрироваться</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Card>
                </div>);
        }
    }
}