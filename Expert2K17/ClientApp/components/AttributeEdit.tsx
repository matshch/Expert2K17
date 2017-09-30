// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Attribute';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';


interface attributes {
    attr: Interf.Attribute[]
    sys: Interf.System;

}

type CreateAttribute =
    attributes
    &
    typeof Store.actionCreators;

class TestCreaterAttribute extends React.Component<CreateAttribute, {}>{
    constructor() {
        super();
    }

    render() {
        return <Container fluid>

            {this.props.attr.map((val, key) => {
                return <ConnectedAttribute key={key} index={key} />
            })}
            <ConnectedAttribute index={-1} />
        </Container>
    }
}


interface AttrAdditionalProps {
    index: number;
    sys: Interf.System;
}



type AttributeProps =
    AttrAdditionalProps  
    &
    Interf.Attribute
    &
    typeof Store.actionCreators;

type AttributeT =
    Interf.Attribute

class Attribute extends React.Component<AttributeProps, {}>{
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

interface NeededAttributeProps {
    index: number;
}

function getAttributeProps(store: ApplicationState, props: NeededAttributeProps) {
    if (props.index != -1) {
        return { ...store.combinedSystem.attributes[props.index], sys: store.combinedSystem.system };
    } else {
        let state: Interf.Attribute = {
            system_guid: '',
            name: '',
            values: [],
            unitValue: false,
            guid: ''
        }
        return { ...state, sys: store.combinedSystem.system };
    }


}


export let ConnectedTestAttributeEditor = connect((store: ApplicationState) => { return { attr: store.combinedSystem.attributes, sys: store.combinedSystem.system } }, Store.actionCreators)(TestCreaterAttribute);
let ConnectedAttribute = connect(getAttributeProps, Store.actionCreators)(Attribute)