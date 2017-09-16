// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import { Nav, NavItem, NavLink, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media } from 'reactstrap'

type CounterProps =
    CounterStore.CounterState
    & typeof CounterStore.actionCreators
    & RouteComponentProps<{}>;
export 
    class TestCreater extends React.Component<CounterProps, {}> {
    public render() {
        return <Container fluid>
            <Row>
                <Col sm={3}>
                    <TestCreaterNav />
                </Col>
                <Col sm={7}>
                    <TestCreaterSystem />
                </Col>
            </Row>
           
        </Container>;
    }
}

class TestCreaterNav extends React.Component<{}>{
    constructor(props: {}) {
        super(props);

    }
    public render() {
        return (
            <div>
                <div>
                    <h4>Создайте проект</h4> 
                </div>

                <hr />
                <Nav vertical>
                    <NavItem>
                        <NavLink>Система</NavLink>
                        <NavLink>Система</NavLink>
                        <NavLink>Система</NavLink>
                        <NavLink>Система</NavLink>
                    </NavItem>
                </Nav>
            </div>
            );
    }
}

class TestCreaterSystem extends React.Component<{}>{
    render() {
        return <Container fluid>
            <Form>
                <FormGroup row>
                    <Label for="email" sm={2}>Название</Label>
                    <Col sm={10}>
                        <Input type="email" name="email" id="email" placeholder="Email"></Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="description" sm={2}>О системе</Label>
                    <Col sm={10}>
                        <Input type="textarea" id="description" placeholder="Описаение"></Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="imge" sm={2}>Картинка</Label>
                    <Col sm={10}>
                        <Input type="file" name="file" id="imge"></Input>
                        <img className="img-fluid" ></img> //Доделать потом чтобы высота была
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="chb1" sm={2}>Публичный доступ</Label>
                    <Col sm={10}>
                        <Input type="checkbox" id="chb1"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="chb2" sm={2}>Гостевой доступ</Label>
                    <Col sm={10}>
                        <Input type="checkbox" id="chb2" />
                    </Col>
                </FormGroup>
                <Row>
                    <Col sm={2} />
                    <Col sm={10}>
                        <Button color="success" className="pull-left">Создать</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    }
}

class TestCreaterAttribute extends React.Component<{}>{

}












// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    CounterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater) as typeof TestCreater;
