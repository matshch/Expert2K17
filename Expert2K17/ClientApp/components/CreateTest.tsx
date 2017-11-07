// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/System';
import { NavLink, Route, Redirect, withRouter } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as Systemer from './SystemCreate';
import * as Attributer from './AttributeEdit';
import * as Subjecter from './SubjectEdit';
import * as Parameter from './Parameters';
import * as Question from './Questions';
import * as Logic from './Logics';

interface sys {
    system: Interf.System
}
type CounterProps =
    sys
    & typeof Store.actionCreators
    & RouteComponentProps<{ id: string }>;
export
    class TestCreater extends React.Component<CounterProps, {}> {
    constructor() {
        super();
    }
    render() {
        if (this.props.location.pathname == '/CreateTest') {
            this.props.clearSystem();
            return <Redirect to="/CreateTest/new" />
        }

        if (this.props.match.params.id != this.props.system.guid && this.props.location.pathname != '/CreateTest/new') {
            this.props.loadGuidSystem(this.props.match.params.id);
        }

        return <DocumentTitle title='Создание системы — ЭЗ ПЕЗ'>
            <Row>
                <Col sm={3}>
                    <FixedConnectedTestCreaterNav link={this.props.match.params.id} />
                </Col>
                <Col sm={9}>
                    <Route path='/CreateTest/new' component={Systemer.ConnectedTestSystemCreater} />
                    <Route path='/EditTest/:id/CreateSystem' component={Systemer.ConnectedTestSystemEditor} />
                    <Route path='/EditTest/:id/CreateAttribute' component={Attributer.ConnectedTestAttributeEditor} />
                    <Route path='/EditTest/:id/CreateSubject' component={Subjecter.default} />
                    <Route path='/EditTest/:id/CreateParameter' component={Parameter.ConnectedTestParameterEditor} />
                    <Route path='/EditTest/:id/CreateQuestion' component={Question.ConnectedQuestionCreator} />
                    <Route path='/EditTest/:id/CreateLogic' component={Logic.ConnectedTestLogicEditor} />
                </Col>
            </Row>
        </DocumentTitle>;
    }
}
interface Naver {
    link: string;
}
type NavProps =
    Naver
    &
    Interf.System
    &
    typeof Store.actionCreators


export class TestCreaterNav extends React.Component<NavProps, {}>{
    constructor() {
        super();

    }

    saveForce = () => {
        this.props.saveSystem();
    }
    rollbackForce = () => {
        this.props.rollbackGuidSystem(this.props.link);
    }
    render() {
        return (
            <Card className="createSideBar">
                <CardBody>
                    <div>
                        <h4>{this.props.name == '' ? 'Создайте проект' : this.props.name}</h4>
                    </div>

                    <hr />
                    <Nav className="nav-pills" vertical>
                        <NavItem>
                            {
                                (() => {
                                    if (typeof this.props.link != 'undefined') {
                                        return <NavLink to={'/EditTest/' + this.props.link + '/CreateSystem'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                                    }
                                    return <NavLink to={'/CreateTest/new'} className='nav-link' exact activeClassName='active'>Система</NavLink>
                                })()
                            }
                        </NavItem>
                        {(() => {
                            if (typeof this.props.guid != 'undefined' && this.props.guid.length > 0) {
                                return <div>
                                    <NavItem>
                                        <NavLink exact to={'/EditTest/' + this.props.link + '/CreateAttribute'} className='nav-link' activeClassName='active'>Атрибуты</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink exact to={'/EditTest/' + this.props.link + '/CreateSubject'} className='nav-link' activeClassName='active'>Объекты</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink exact to={'/EditTest/' + this.props.link + '/CreateParameter'} className='nav-link' activeClassName='active'>Параметр</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink exact to={'/EditTest/' + this.props.link + '/CreateQuestion'} className='nav-link' activeClassName='active'>Вопрос</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink exact to={'/EditTest/' + this.props.link + '/CreateLogic'} className='nav-link' activeClassName='active'>Логика</NavLink>
                                    </NavItem>
                                </div>
                            }

                        })()}

                    </Nav>

                    <hr />

                    <Button block onClick={this.rollbackForce}>Восстановить состояние</Button>
                    <Button block onClick={this.saveForce}>Сохранить состояние</Button>

                </CardBody>
            </Card>
        );
    }
}



let ConnectedTestCreaterNav = connect((store: ApplicationState) => store.combinedSystem.system, Store.actionCreators)(TestCreaterNav);
let FixedConnectedTestCreaterNav = withRouter(ConnectedTestCreaterNav);

interface linker {
    link: string;
}


// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => { return { system: state.combinedSystem.system } }, // Selects which state properties are merged into the component's props
    Store.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater);
