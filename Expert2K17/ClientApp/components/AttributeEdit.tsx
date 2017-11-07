// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Attribute';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText, InputGroup, InputGroupButton } from 'reactstrap'
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
            <ConnectedNewAttribute />
        </Container>
    }
}


interface AttrAdditionalProps {
    index: number;
    sys: Interf.System;
    attr: Interf.Attribute;
    pairs: Interf.Pair[];

}



type AttributeProps =
    AttrAdditionalProps
    &
    typeof Store.actionCreators;

type AttributeT =
    Interf.Attribute

class Attribute extends React.Component<AttributeProps, {}>{
    constructor() {
        super();
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncAttribute(
            {
                ...this.props.attr,
                name: e.target.value
            },
            this.props.attr.guid
        )
    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncAttribute(
            {
                ...this.props.attr,
                unitValue: e.target.checked
            },
            this.props.attr.guid
        )
    }

    canDeleteAttribute = () => {
        if (this.props.pairs.length > 0) {
            return true
        }
    }

    onFullDelete = () => {
        this.props.deleteAttribute(this.props.attr);
    }

    onPChange = (guid: string, value: string) => {
        this.props.renamePair(guid, value);
    }
    onPDelete = (guid: string) => {
        this.props.deletePair(guid);
    }

    render() {
        return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.attr.name} placeholder="Название атрибута"></Input>
                                <InputGroupButton color="danger"><Button onClick={this.onFullDelete} color="danger"><i className="fa fa-trash" ></i></Button></InputGroupButton>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.props.attr.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    <hr />
                    <ListGroup>
                        {this.props.pairs.map((val, key) => {
                            return <Valer deleter={this.onPDelete} changer={this.onPChange} guid={val.guid} value={val.value} key={key} />
                        })}
                    </ListGroup>

                </Form>
            </CardBody>
        </Card>
    }
}

interface propsValer {
    value: string;
    guid: string;
    deleter: (guid: string) => void;
    changer: (guid: string, value: string) => void;
}


class Valer extends React.Component<propsValer, {}>{
    constructor() {
        super();
    }
    chan = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.changer(this.props.guid, e.target.value);
    }
    onDelete = () => {
        this.props.deleter(this.props.guid);
    }
    render() {
        return <div>
            <InputGroup>
                <Input placeholder="значение" type="text" value={this.props.value} onChange={this.chan} />
                <InputGroupButton><Button color="danger" onClick={this.onDelete}><i className="fa fa-trash" ></i></Button></InputGroupButton>
            </InputGroup>
            <br />
        </div>
    }
}



class NewAttribute extends React.Component<typeof Store.actionCreators, Interf.Attribute>{
    constructor() {
        super();
        this.state = {
            system_guid: '',
            name: '',
            unitValue: false,
            guid: ''
        }
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {
                ...this.state,
                name: e.target.value
            }
        )
    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {
                ...this.state,
                unitValue: e.target.checked
            }
        )
    }

    addAttribute = () => {
        if (this.state.name != '') {
            this.props.addAttribute(this.state);
            this.setState({
                system_guid: '',
                name: '',
                unitValue: false,
                guid: ''
            });
        }
    }

    render() {
        return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.state.name} placeholder="Название атрибута"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Числовые значения</Label>
                        <Col sm={9}>
                            <Input type="checkbox" checked={this.state.unitValue} onChange={this.unitChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    <Button color="success" onClick={this.addAttribute}>Создать</Button>
                </Form>
            </CardBody>
        </Card>
    }
}
interface NeededAttributeProps {
    index: number;
}

function getAttributeProps(store: ApplicationState, props: NeededAttributeProps) {
    if (store.combinedSystem.pairs.length > 0) {
        var pairs = store.combinedSystem.pairs.filter((e) => {
            if (e.attributeGuid == store.combinedSystem.attributes[props.index].guid) {
                return true;

            }
            return false;
        })
    } else {
        var pairs = ([] as typeof store.combinedSystem.pairs);
    }

    return { attr: store.combinedSystem.attributes[props.index], pairs: pairs, sys: store.combinedSystem.system };

}




export let ConnectedTestAttributeEditor = connect((store: ApplicationState) => { return { attr: store.combinedSystem.attributes, sys: store.combinedSystem.system } }, Store.actionCreators)(TestCreaterAttribute);
let ConnectedAttribute = connect(getAttributeProps, Store.actionCreators)(Attribute)
let ConnectedNewAttribute = connect(() => { return {} }, Store.actionCreators)(NewAttribute)