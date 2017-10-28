// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Parameters';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';


interface parameter {
    parameters: Interf.Parameter[]
    sys: Interf.System;

}

type CreateParameters =
    parameter
    &
    typeof Store.actionCreators;

class TesteCreateParameters extends React.Component<CreateParameters, {}>{
    constructor() {
        super();
    }

    render() {
        return <Container fluid>
            {this.props.parameters.map((val, key) => {
                return <ConnectedParameter key={key} index={key} />
            })}
            <ConnectedNewParameter/>
        </Container>
    }
}


interface PArameterAdditionalProps {
    index: number;
    sys: Interf.System;
    pairs: Interf.ParameterPair[];
    parameter: Interf.Parameter;
}



type ParameterProps =
    PArameterAdditionalProps
    &
    typeof Store.actionCreators;

class Parameter extends React.Component<ParameterProps, {}>{
    constructor() {
        super();
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncParameter({ ...this.props.parameter, name: e.target.value });
    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncParameter({ ...this.props.parameter, unitValue: e.target.checked });
    }
    render() {
        return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.parameter.name} placeholder="Название параметра"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.props.parameter.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    {(() => {
                        if (this.props.index != -1) {
                            return (<div>
                                <hr />
                                <ListGroup>
                                    {this.props.pairs.map((val, key) => {
                                        return <ListGroupItem key={key}>{val.value}</ListGroupItem>
                                    })}
                                </ListGroup>
                            </div>)
                        }
                    })()}

                </Form>
            </CardBody>
        </Card>
    }
}



class NewParameter extends React.Component<typeof Store.actionCreators, Interf.Parameter>{
    constructor() {
        super();
        this.state = {
            name: '',
            guid: '',
            unitValue: false
        };
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            unitValue: e.target.checked
        })
    }

    saveParameter = () => {
        this.props.addParameter(this.state);
        this.setState({
            name: '',
            guid: '',
            unitValue: false
        })
    }
    render() {
        return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.state.name} placeholder="Название параметра"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.state.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    <Button color="success" onClick={this.saveParameter}>Создать</Button>                         

                </Form>
            </CardBody>
        </Card>
    }
}




interface NeededParameterProps {
    index: number;
}

function getParameterProps(store: ApplicationState, props: NeededParameterProps) {
    let pairs = store.combinedSystem.parpairs.filter((e) => {
        if (e.parameterGuid == store.combinedSystem.parameters[props.index].guid) {
            return true;
        }
        return false;

    })
    return { parameter: store.combinedSystem.parameters[props.index], sys: store.combinedSystem.system, pairs: pairs };

 
}


export let ConnectedTestParameterEditor = connect((store: ApplicationState) => { return { parameters: store.combinedSystem.parameters, sys: store.combinedSystem.system } }, Store.actionCreators)(TesteCreateParameters);
let ConnectedParameter = connect(getParameterProps, Store.actionCreators)(Parameter)
let ConnectedNewParameter = connect(() => ({}), Store.actionCreators)(NewParameter)