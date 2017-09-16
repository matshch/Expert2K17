﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText } from 'reactstrap'

type CounterProps =
    CounterStore.CounterState
    & typeof CounterStore.actionCreators
    & RouteComponentProps<{}>;
export
    class TestCreater extends React.Component<CounterProps, { redirected: boolean }> {
    constructor() {
        super();
        let redirect = false;

        this.state = {
            redirected: redirect
        }
    }
    public ComponentWillMount() {
    }
    public render() {
        if (this.props.location.pathname == '/CreateTest') {
            return <Redirect to="/CreateTest/CreateSystem" />
        }


        return <Container fluid>
            <Row>
                <Col sm={3}>
                    <TestCreaterNav redirected={this.state.redirected} />
                </Col>
                <Col sm={9}>
                    <Route path='/CreateTest/CreateSystem' component={TestCreaterSystem} />
                </Col>
            </Row>
           
        </Container>;
    }
}

export class TestCreaterNav extends React.Component<{ redirected: boolean }, {}>{
    constructor() {
        super();

    }
    public render() {
        return (
            <Card className="createSideBar">
                <CardBlock>
                <div>
                    <h4>Создайте проект</h4> 
                </div>

                <hr />
                <Nav className="nav-pills" vertical>
                    <NavItem>
                        <NavLink to={'/CreateTest/CreateSystem'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={'/CreateTest/CreateSystem1'} className='nav-link' activeClassName='active'>Система</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={'/CreateTest/CreateSystem2'} className='nav-link' activeClassName='active'>Система</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={'/CreateTest/CreateSystem3'} className='nav-link' activeClassName='active'>Система</NavLink>
                    </NavItem>
                </Nav>
                </CardBlock>
            </Card>
            );
    }
}

export class TestCreaterSystem extends React.Component<{}>{
    render() {
        return <Card className="createSideBar">
            <CardBlock>
            <Form>
                <FormGroup row>
                    <Label for="email" sm={3}>Название</Label>
                    <Col sm={9}>
                        <Input type="email" name="email" id="email" placeholder="Email"></Input>
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
                        <Input type="checkbox" id="chb1"/>
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

class TestCreaterAttribute extends React.Component<{}>{

}












// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    CounterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater) as typeof TestCreater;
