 // A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/System';
import * as WeatherForecasts from '../store/WeatherForecasts';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces'

type CounterProps =
    Interf.KSystem
    & typeof Store.actionCreators
    & RouteComponentProps<{guid:string}>;
export
    class TestCreater extends React.Component<CounterProps, {}> {
    constructor() {
        super();
    }
    render() {
        if (this.props.location.pathname == '/EditTest') {
            return <Redirect to="/EditTest/new" />
        }


        return <DocumentTitle title='Создание системы — ЭЗ ПЕЗ'>
            <Container fluid>
                <Row>
                    <Col sm={3}>
                        <TestCreaterNav link={this.props.match.params.guid} />
                    </Col>
                    <Col sm={9}>
                        <Route path='/EditTest/new' component={TestCreaterSystem} />
                        <Route path='/EditTest/:guid/CreateSystem' component={TestEditorSystem} />
                        <Route path='/EditTest/:guid/CreateAttribute' component={TestCreaterAttribute} />
                    </Col>
                </Row>
            </Container>
        </DocumentTitle>;
    }
}
interface Naver {
    link: string;
}
type NavProps =
    Naver;


export class TestCreaterNav extends React.Component<NavProps, {}>{
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
                            {
                                (() => {
                                    if (typeof this.props.link  != 'undefined') {
                                        return <NavLink to={'/EditTest/' + this.props.link + '/CreateSystem'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                                    }
                                    return <NavLink to={'/EditTest/CreateSystem'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                                })()
                            }  
                    </NavItem>
                    <NavItem>
                            <NavLink to={'/EditTest/CreateAttribute'} className='nav-link' activeClassName='active'>Аттрибуты</NavLink>
                    </NavItem>
                    <NavItem>
                            <NavLink to={'/EditTest/CreateSystem2'} className='nav-link' activeClassName='active'>Объекты</NavLink>
                    </NavItem>
                    <NavItem>
                            <NavLink to={'/EditTest/CreateSystem3'} className='nav-link' activeClassName='active'>Система</NavLink>
                    </NavItem>
                </Nav>
                </CardBlock>
            </Card>
            );
    }
}


export class TestEditorSystem extends React.Component<{}, {}>{

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
                        <img className="img-fluid" ></img>
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

interface CreatorSystem {
    name: string;
    about: string;
}


export class TestCreaterSystem extends React.Component<{}, {}>{

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
                            <img className="img-fluid" ></img>
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
    (state: ApplicationState) => state.system, // Selects which state properties are merged into the component's props
    Store.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater) as typeof TestCreater;
