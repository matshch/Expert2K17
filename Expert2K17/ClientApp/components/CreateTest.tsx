// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'

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
    ComponentWillMount() {
    }
    render() {
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
                    <Route path='/CreateTest/CreateAttribute' component={TestCreaterAttribute} />
                </Col>
            </Row>
           
        </Container>;
    }
}

export class TestCreaterNav extends React.Component<{ redirected: boolean }, {}>{
    constructor() {
        super();

    }
    render() {
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
                            <NavLink to={'/CreateTest/CreateAttribute'} className='nav-link' activeClassName='active'>Аттрибуты</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={'/CreateTest/CreateSystem2'} className='nav-link' activeClassName='active'>Объекты</NavLink>
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

interface MainAttr {
    attributes: BasicAttribute[];
}

interface BasicAttribute {
    name: string;
    parameters: string[] | any;
}


class TestCreaterAttribute extends React.Component<{}, MainAttr>{
    constructor() {
        super();
        this.state = {
            attributes: [{
                name: 'кек',
                parameters: ['1']
            }]
        };
    }
    name_callback: (name: string) => void = (name_) => {

        let param: BasicAttribute[] = this.state.attributes.concat({ name: name_, parameters: [] })
        this.setState({ attributes: param });
    } 

    render() {
        return <Container fluid>
            
            {this.state.attributes.map((val,key) => {
                return <Attribute new={false} index={key} name={val.name} added={this.name_callback} attr={val.parameters} />
            })}
            <Attribute new={true} added={this.name_callback} name={''} attr={[]} />
        </Container>
    }
}

interface AttributeProps {
    new: boolean;
    index?: number;
    added: (name: string) => void;
    deleted?: (purge: boolean) => void;
    name: string;
    attr: string[];
}

interface AttributeState {
    name: string;
}

class Attribute extends React.Component<AttributeProps, AttributeState>{
    constructor(props: AttributeProps) {
        super(props);
        if (!props.new) {
            this.state = { name: props.name };
        } else {
            this.state = { name: '' };
        }   

    }
    add_click: () => void = () => {
        this.props.added(this.state.name)   
    }
    name_change = () => {

    }

    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.state.name} placeholder="Название аттрибута"></Input>
                        </Col>
                    </FormGroup>
                    <hr />
                    <ListGroup>
                        {this.props.attr.map((val, key) => {
                            return <ListGroupItem key={key}>{val}</ListGroupItem>
                        })}
                    </ListGroup>
                    {(() => {
                        if (this.props.new) {
                            return <Button color="success">Создать</Button>
                        } else {

                        }
                    })()}
                </Form>
            </CardBlock>
        </Card>
    }

}












// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    CounterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater) as typeof TestCreater;
