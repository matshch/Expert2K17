// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Parameters';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
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
}



type ParameterProps =
    PArameterAdditionalProps
    &
    Interf.Parameter
    &
    typeof Store.actionCreators;

class Parameter extends React.Component<ParameterProps, {}>{
    constructor() {
        super();
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.props.name} placeholder="Название аттрибута"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.props.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    {(() => {
                        if (this.props.index != -1) {
                            return (<div>
                                <hr />
                                <ListGroup>
                                    {this.props.values.map((val, key) => {
                                        return <ListGroupItem key={key}>{val}</ListGroupItem>
                                    })}
                                </ListGroup>
                                <Button color="success">Создать</Button>
                            </div>)
                        }
                    })()}

                </Form>
            </CardBlock>
        </Card>
    }
}



class NewParameter extends React.Component<typeof Store.actionCreators, Interf.Parameter>{
    constructor() {
        super();
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {

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
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.state.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    <Button color="success">Создать</Button>                         

                </Form>
            </CardBlock>
        </Card>
    }
}




interface NeededParameterProps {
    index: number;
}

function getParameterProps(store: ApplicationState, props: NeededParameterProps) {
    if (props.index != -1) {
        return { ...store.combinedSystem.parameters[props.index], sys: store.combinedSystem.system };
    } else {
        let state: Interf.Parameter = {
            name: '',
            values: [],
            unitValue: false,
            guid: ''
        }
        return { ...state, sys: store.combinedSystem.system };
    }


}


export let ConnectedTestParameterEditor = connect((store: ApplicationState) => { return { parameters: store.combinedSystem.parameters, sys: store.combinedSystem.system } }, Store.actionCreators)(TesteCreateParameters);
let ConnectedParameter = connect(getParameterProps, Store.actionCreators)(Parameter)
let ConnectedNewParameter = connect(() => ({}), Store.actionCreators)(NewParameter)