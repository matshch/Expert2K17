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
                            <NavLink to={'/panel'} exact className='nav-link' activeClassName='active'>Система</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={'/panel/users'} className='nav-link' activeClassName='active'>Пользователи</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={'/panel/tests'} className='nav-link' activeClassName='active'>Тесты</NavLink>
                        </NavItem>
                    </Nav>
                </CardBlock>
            </Card>
        );
    }
}

export class System extends React.Component<{}, {}>{
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <p>Система</p>
                </Form>
            </CardBlock>
        </Card>
    }
}

export class Users extends React.Component<{}, {}>{
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <p>Пользователи</p>
                </Form>
            </CardBlock>
        </Card>
    }
}

export class Tests extends React.Component<{}, {}>{
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <p>Тесты</p>
                </Form>
            </CardBlock>
        </Card>
    }
}

export default class Panel extends React.Component<RouteComponentProps<{}>, {}> {
    constructor() {
        super();
    }
    render() {
        return <DocumentTitle title='Панель управления'>
            <Container fluid>
                <Row>
                    <Col sm={3}>
                        <SideBar />
                    </Col>
                    <Col sm={9}>
                        <Route path='/panel/' exact component={System} />
                        <Route path='/panel/users' component={Users} />
                        <Route path='/panel/tests' component={Tests} />
                    </Col>
                </Row>
            </Container>
        </DocumentTitle>
    }
}