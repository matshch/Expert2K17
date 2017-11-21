// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Logic';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as Conditioner from './Condition'
import * as ComboBox from 'react-selectize';


interface parameter {
    logics: Interf.Logic[]
}

type CreateParameters =
    parameter
    &
    typeof Store.actionCreators;

class TesteCreateLogics extends React.Component<CreateParameters, {}>{
    constructor() {
        super();
    }

    render() {
        return <Container fluid>
            {this.props.logics.map((val, key) => {
                return <ConnectedLogic key={key} index={key} />
            })}
            <ConnectedNewLogic />
        </Container>
    }
}


interface PArameterAdditionalProps {
    index: number;
    logic: Interf.Logic;
    conditions: Interf.Condition[];
}



type ParameterProps =
    PArameterAdditionalProps
    &
    typeof Store.actionCreators;

class Logic extends React.Component<ParameterProps, {}>{
    constructor() {
        super();
    }

    prepareOptions = () => {
        const option = [
            { label: '&&', value: Interf.LogicOperation.And },
            { label: '||', value: Interf.LogicOperation.Or }
        ]
        return option
    }

    defaultOptioner = () => {
        if (this.props.logic.operation == Interf.LogicOperation.And) {
            return { label: '&&', value: Interf.LogicOperation.And }
        }
        if (this.props.logic.operation == Interf.LogicOperation.Or) {
            return { label: '||', value: Interf.LogicOperation.Or }
        }

    }

    onMiddleChange = (item: any) => {
        if (!!item) {
            this.props.syncLogic({
                ...this.props.logic,
                operation: item.value
            });
        }
    }

    renderThen = () => {
        if (this.props.logic.then.length > 0) {
            let ind = this.props.conditions.findIndex((e) => {
                if (e.guid == this.props.logic.then) {
                    return true;
                }
            })
            return <Conditioner.ConnectedCondition dependancy={this.props.logic.guid} index={ind} type={Interf.ComponentCondition.Result} mode={-1} />
        }
        return <Conditioner.ConnectedCondition dependancy={this.props.logic.guid} index={-1} type={Interf.ComponentCondition.Result} mode={-1} />
    }

    onFullDelete = () => {
        this.props.deleteLogic(this.props.logic.guid);
    }

    render() {
        return <Card className="createSideBar">
            <CardTitle>Если</CardTitle>
            <CardBody>
                {(() => {
                    let arr: number[] = [];
                    return this.props.conditions.filter((e, ind) => {
                        if (e.origin == Interf.ComponentCondition.Logic && this.props.logic.conditions.includes(e.guid)) {
                            arr.push(ind);
                            return true;
                        }
                        return false;
                    }).map((e, ind) => {
                            return <Conditioner.ConnectedCondition dependancy={this.props.logic.guid} key={ind} index={arr[ind]} type={Interf.ComponentCondition.Logic} mode={-1} />
                        }).concat([<Conditioner.ConnectedCondition dependancy={this.props.logic.guid} key={arr.length} index={-1} type={Interf.ComponentCondition.Logic} mode={-1} />])
                })()}
                <br/>
                <ComboBox.SimpleSelect options={this.prepareOptions()}
                    defaultValue={this.defaultOptioner()}
                    onValueChange={this.onMiddleChange}
                />
                <br />
                <h5>ТО</h5>
                <br />
                {this.renderThen()}
                <Button color="danger" onClick={this.onFullDelete} size="xs" block><i className="fa fa-trash" ></i> Удалить</Button>


            </CardBody>
        </Card>
    }
}



class NewLogic extends React.Component<typeof Store.actionCreators>{
    constructor() {
        super();
    }

    newLogic = () => {
        let logic: Interf.Logic = {
            conditions: [],
            then: '',
            operation: Interf.LogicOperation.And,
            guid: ''
        }
        this.props.addLogic(logic);
    }
    render() {
        return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <Button color="success" onClick={this.newLogic}>Создать логику</Button>
                </Form>
            </CardBody>
        </Card>
    }
}




interface NeededParameterProps {
    index: number;
}

function getLogicProps(store: ApplicationState, props: NeededParameterProps) {
    return { logic: store.combinedSystem.logics[props.index], conditions: store.combinedSystem.conditions };
}


export let ConnectedTestLogicEditor = connect((store: ApplicationState) => { return { logics: store.combinedSystem.logics} }, Store.actionCreators)(TesteCreateLogics);
let ConnectedLogic = connect(getLogicProps, Store.actionCreators)(Logic)
let ConnectedNewLogic = connect(() => ({}), Store.actionCreators)(NewLogic)