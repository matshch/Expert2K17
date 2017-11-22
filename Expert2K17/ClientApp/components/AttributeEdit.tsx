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
    render() {
        return <div>

            {this.props.attr.map((val, key) => {
                return <ConnectedAttribute key={key} index={key} />
            }).concat(<ConnectedAttribute index={-1} key={this.props.attr.length} />)}
            
        </div>
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
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(this.props.index > -1){
            this.props.syncAttribute(
                {
                    ...this.props.attr,
                    name: e.target.value
                },
                this.props.attr.guid
            )
        } else {
            this.props.addAttribute({
                system_guid: '',
                name: e.target.value,
                guid: '',
                unitValue: false
            })
        }

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
        if(this.props.index != -1){
            return <Card className="test attribute">
            <CardBody>
                <Form>
                    <FormGroup>
                        <Label for="texter">Атрибут</Label>
                        <InputGroup>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.attr.name} placeholder="Название атрибута"></Input>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="checkbox">
                        <div className="checkBox">
                            <Input checked={this.props.attr.unitValue} onChange={this.unitChange} id="chb1" type="checkbox" />{''}
                        </div>
                        <div className="checkBoxLabel">
                            <div>числовые значения</div>
                        </div>
                    </FormGroup>
                    <ListGroup className='listGrouperTest'>
                        {this.props.pairs.map((val, key) => {
                            return <Valer deleter={this.onPDelete} changer={this.onPChange} guid={val.guid} value={val.value} key={key} />
                        })}
                    </ListGroup>
                    <Button color="danger" onClick={this.onFullDelete} size="xs" block><i className="fa fa-trash" ></i> Удалить</Button>
                </Form>
            </CardBody>
        </Card>
        } else {
            return <Card className="test attribute">
            <CardBody>
                <Form>
                    <FormGroup>
                        <Label for="texter">Атрибут</Label>
                        <InputGroup>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.attr.name} placeholder="Название атрибута"></Input>
                        </InputGroup>
                    </FormGroup>                
                </Form>
            </CardBody>
        </Card>
        }


    }
}

interface propsValer {
    value: string;
    guid: string;
    deleter: (guid: string) => void;
    changer: (guid: string, value: string) => void;
}


class Valer extends React.Component<propsValer, {}>{
    chan = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.changer(this.props.guid, e.target.value);
    }
    onDelete = () => {
        this.props.deleter(this.props.guid);
    }
    render() {
        return <div className="itemer">
            <InputGroup>
                <Input placeholder="значение" type="text" value={this.props.value} onChange={this.chan} />
                <InputGroupButton><Button color="danger" onClick={this.onDelete}><i className="fa fa-trash" ></i></Button></InputGroupButton>
            </InputGroup>
        </div>
    }
}




interface NeededAttributeProps {
    index: number;
}

function getAttributeProps(store: ApplicationState, props: NeededAttributeProps) {
    if(props.index > -1){
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
    return {
         attr:     {system_guid: '',
         name: '',
         guid: '',
         unitValue: false},
         pairs: [],
         sys: store.combinedSystem.system
    }

}




export let ConnectedTestAttributeEditor = connect((store: ApplicationState) => { return { attr: store.combinedSystem.attributes, sys: store.combinedSystem.system } }, Store.actionCreators)(TestCreaterAttribute);
let ConnectedAttribute = connect(getAttributeProps, Store.actionCreators)(Attribute)