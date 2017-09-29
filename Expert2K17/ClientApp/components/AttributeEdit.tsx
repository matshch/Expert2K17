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
    attr: Interf.KAttributes
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
    name_callback: (name: string) => void = (name_) => {
        
    }

    render() {
        return <Container fluid>

            {Object.keys(this.props.attr).map((val, key) => {
                return <Attribute key={key} added={this.name_callback} attr={this.props.attr[val]} sys={this.props.sys} />
            })}
            <Attribute added={this.name_callback} attr={null} sys={this.props.sys} />
        </Container>
    }
}


interface AttrAdditionalProps {
    added: (name: string) => void;
}

interface PrimaryProps {
    attr: Interf.Attributes | null;
    sys: Interf.System;
}


type AttributeProps =
    AttrAdditionalProps
    &
    PrimaryProps;

type AttributeT =
    Interf.Attributes

class Attribute extends React.Component<AttributeProps, AttributeT>{
    constructor() {
        super();
        this.state = {
            system_guid: '',
            name: '',
            values: [],
            unitValue: false
        }
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
                    {(() => {
                        if (this.props.attr != null) {
                            return (<div>
                                <hr />
                                <ListGroup>
                                    {this.props.attr.values.map((val, key) => {
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


export let ConnectedTestAttributeEditor = connect((store: ApplicationState) => { return { ...store.attributes, sys: store.system }; }, Store.actionCreators)(TestCreaterAttribute);
