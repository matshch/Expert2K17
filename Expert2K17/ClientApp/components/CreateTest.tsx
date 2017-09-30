 // A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/System';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as Systemer from './SystemCreate';
import * as Attributer from './AttributeEdit';


type CounterProps =
    Interf.System
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
                        <ConnectedTestCreaterNav link={this.props.match.params.guid} />
                    </Col>
                    <Col sm={9}>
                        <Route path='/EditTest/new' component={Systemer.ConnectedTestSystemCreater} />
                        <Route path='/EditTest/:guid/CreateSystem' component={Systemer.ConnectedTestSystemEditor} />
                        <Route path='/EditTest/:guid/CreateAttribute' component={Attributer.ConnectedTestAttributeEditor} />
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
    Naver
    &
    Interf.System;


export class TestCreaterNav extends React.Component<NavProps, {}>{
    constructor() {
        super();

    }
    render() {
        return (
            <Card className="createSideBar">
                <CardBlock>
                    <div>
                        <h4>{this.props.name == '' ? 'Создайте проект' : this.props.name}</h4> 
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

                <hr />
                <button>Вернуться к предыдущему сохраненному состоянию</button>
                <button>Сохранить состояние</button>s

                </CardBlock>
            </Card>
            );
    }
}



let ConnectedTestCreaterNav = connect((store: ApplicationState) => store.system)(TestCreaterNav);





// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.system, // Selects which state properties are merged into the component's props
    Store.actionCreators                 // Selects which action creators are merged into the component's props
)(TestCreater);
