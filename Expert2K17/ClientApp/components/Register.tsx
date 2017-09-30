import * as React from 'react';
import { Alert, Col, Card, CardBlock, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as RegisterStore from '../store/Register';
import '../css/cards.css';

type RegisterProps =
    RegisterStore.RegisterState
    & typeof RegisterStore.actionCreators
    & RouteComponentProps<{}>;

export class Register extends React.Component<RegisterProps, { shitpass: boolean, username: string, group: string, year: string, name: string, surname: string, patronymic: string, fpassword: string, spassword: string }> {
    constructor() {
        super();
        this.state = {
            username: "",
            name: "",
            surname: "",
            patronymic: "",
            fpassword: "",
            spassword: "",
            year: "",
            group: "",
            shitpass: false
        };
    }

    componentWillMount() {
        this.props.GetGroupsYears();
    }

    SubmitRegister = () => {
        if (this.state.fpassword == this.state.spassword) {
            this.setState({ shitpass: false })
            this.props.Register({
                "UserName": this.state.username,
                "Password": this.state.fpassword,
                "Surname": this.state.surname,
                "Name": this.state.name,
                "Patronymic": this.state.patronymic,
                "Group": this.state.group,
                "Year": this.state.year
            })
        } else {
            this.setState({ shitpass: true })
        }
    }

    usernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            username: e.target.value
        });
    }

    nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }

    surnameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            surname: e.target.value
        });
    }

    patronymicChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            patronymic: e.target.value
        });
    }

    yearChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            year: e.target.value
        });
    }

    groupChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            group: e.target.value
        });
    }

    firstPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            fpassword: e.target.value
        });
    }

    secPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            spassword: e.target.value
        });
    }

    render() {
        let year = this.props.GroupsYearsObject.find(e => e.year == this.state.year)
        let groups = [""]
        if (year != undefined) groups = year.groups
        return (
            <div className="login">
                <Card>
                    <Form>
                        <FormGroup className="Register" row>
                            <Col lg="6">
                                <Label for="Login">Логин</Label>
                                <Input id="Login" onChange={this.usernameChanged} size="xs" type="text" placeholder="введите логин" />

                                <Label for="Name">Имя</Label>
                                <Input id="Name" onChange={this.nameChanged} size="xs" type="text" placeholder="введите имя" />

                                <Label for="Surname">Фамилия</Label>
                                <Input id="Surname" onChange={this.surnameChanged} size="xs" type="text" placeholder="введите фамилию" />

                                <Label for="Patronymic">Отчество</Label>
                                <Input id="Patronymic" onChange={this.patronymicChanged} size="xs" type="text" placeholder="введите отчество" />
                            </Col>
                            <Col lg="6">
                                <Label for="Year">Год</Label>
                                <Input type="select" onChange={this.yearChanged} name="select" id="Year">
                                    <option></option>
                                    {this.props.GroupsYearsObject.map(e => <option>{e.year}</option>)}
                                </Input>

                                <Label for="Group">Группа</Label>
                                <Input type="select" onChange={this.groupChanged} name="select" id="Group">
                                    {groups.map(e => <option>{e}</option>)}
                                </Input>

                                <Label for="firstPass">Пароль</Label>
                                <Input id="firstPass" onChange={this.firstPasswordChanged} size="xs" type="password" placeholder="введите пароль" />

                                <Label for="secondPass">Повторите пароль</Label>
                                <Input id="secondPass" onChange={this.secPasswordChanged} size="xs" type="password" placeholder="повторно введите пароль" />
                            </Col>
                            {
                                (() => {
                                    if (this.props.ResponseObject["succeeded"] === false || this.state.shitpass === true) {
                                        return (
                                            <Alert color="danger">
                                                {this.props.ResponseObject["errors"].map((e: any) => <p><strong>Ошибка</strong> {e["description"]}</p>)}
                                                {
                                                    (() => {
                                                        if (this.state.shitpass === true) {
                                                            return (
                                                                <p><strong>Ошибка</strong> пароли не совпадают.</p>
                                                            )
                                                        }
                                                    })()}
                                            </Alert>
                                        )
                                    }
                                })()}
                            <Button block onClick={this.SubmitRegister} color="primary">Зарегистрироваться</Button>
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