import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';

export class SideBar extends React.Component<{}, {}>{
    constructor() {
        super();
    }
    render() {
        return (
            <Card className="createSideBar">
                <CardBlock>
                    <div>
                        <h4>Панель управления</h4>
                    </div>
                    <hr />
                    <Nav className="nav-pills" vertical>
                        <NavItem>
                            <NavLink to={'/profile'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={'/profile2'} className='nav-link' activeClassName='active'>Пользователи</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={'/profile3'} className='nav-link' activeClassName='active'>Тесты</NavLink>
                        </NavItem>
                    </Nav>
                </CardBlock>
            </Card>
        );
    }
}

export class AdminInterface extends React.Component<{}, {}>{
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="text" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="text" placeholder="Название теста"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" sm={3}>О системе</Label>
                        <Col sm={9}>
                            <Input type="textarea" id="description" placeholder="Описаение"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="imge" sm={3}>Картинка</Label>
                        <Col sm={9}>
                            <Input type="file" name="file" id="imge"></Input>
                            <img className="img-fluid" ></img> //Доделать потом чтобы высота была
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Публичный доступ</Label>
                        <Col sm={9}>
                            <Input type="checkbox" id="chb1" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb2" sm={3}>Гостевой доступ</Label>
                        <Col sm={9}>
                            <Input type="checkbox" id="chb2" />
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col sm={3} />
                        <Col sm={9}>
                            <Button color="success" className="pull-left">Создать</Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlock>
        </Card>
    }
}

export default class Profile extends React.Component<RouteComponentProps<{}>, {}> {
    render() {
        return (<DocumentTitle title='Профиль'>
            <Container fluid>
                <Row>
                    <Col sm={3}>
                        <SideBar />
                    </Col>
                    <Col sm={9}>
                        <AdminInterface />
                    </Col>
                </Row>
            </Container>
        </DocumentTitle>);
    }
}