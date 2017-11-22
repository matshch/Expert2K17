// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Parameters';
import * as ParStore from '../store/ParameterPair';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, InputGroup, InputGroupButton, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
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
    render() {
        return <Container fluid>
            {this.props.parameters.map((val, key) => {
                return <ConnectedParameter key={key} index={key} />
            }).concat(<ConnectedParameter key={this.props.parameters.length} index={-1}/>)}
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
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(this.props.index > -1){
            this.props.syncParameter({ ...this.props.parameter, name: e.target.value });            
        } else {
            if(e.target.value.length > 0){
                this.props.addParameter(
                    {
                        name: e.target.value,
                        guid: '',
                        unitValue: false
                    }
                )
            }

        }
    }
    unitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncParameter({ ...this.props.parameter, unitValue: e.target.checked });
    }
    onFullDelete = ()=>{
        this.props.deleteParameter(this.props.parameter.guid);
    }
    render() {
        if(this.props.index> -1){
            return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                        <InputGroup>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.parameter.name} placeholder="Название параметра"></Input>
                            <InputGroupButton color="danger"><Button onClick={this.onFullDelete} color="danger"><i className="fa fa-trash" ></i></Button></InputGroupButton>
                        </InputGroup>
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
                                <ListGroup className='listGrouperTest'>
                                    {this.props.pairs.map((val, key) => {
                                        return <ConnectedParPair key={key} index={key} parGuid={this.props.parameter.guid} />
                                    })}
                                </ListGroup>
                            </div>)
                        }
                    })()}

                </Form>
            </CardBody>
        </Card>
        } else {
            return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                        <InputGroup>
                            <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.parameter.name} placeholder="Название параметра"></Input>                           
                        </InputGroup>
                        </Col>
                    </FormGroup>                  
                </Form>
            </CardBody>
        </Card>
        }

       
    }
}

interface PPair {
    index: number;
    pair: Interf.ParameterPair;
    parameter: Interf.Parameter;
    parGuid: string;
}

type ppair =
    PPair
    &
    typeof ParStore.actionCreators;

class ParameterPairer extends React.Component<ppair,{}>{

    changer = (e: React.ChangeEvent<HTMLInputElement>) =>{
        this.props.syncPair(this.props.index, e.target.value);
    }

    onFullDelete = () => {
        this.props.deletePair(this.props.pair.guid, this.props.parameter.guid)  
    }
    render() {
        return <div className="itemer">
            <InputGroup >
                <Input type="text" value={this.props.pair.value} onChange={this.changer}></Input>
                <InputGroupButton color="danger"><Button onClick={this.onFullDelete} color="danger"><i className="fa fa-trash" ></i></Button></InputGroupButton>          
            </InputGroup>
        </div>
    }
}







interface NeededParameterProps {
    index: number;
}

function getParameterProps(store: ApplicationState, props: NeededParameterProps) {
    if(props.index > -1){
    let pairs = store.combinedSystem.parpairs.filter((e) => {
        if (e.parameterGuid == store.combinedSystem.parameters[props.index].guid) {
            return true;
        }
        return false;

    })
    return { parameter: store.combinedSystem.parameters[props.index], sys: store.combinedSystem.system, pairs: pairs };
    } else {
        return {parameter: {
            name: '',
            guid: '',
            unitValue: false
        }, pairs: [],
        sys: store.combinedSystem.system
    }
    }
 
}

interface NeedPProps {
    index: number;
    parGuid: string;
}

function getPairProps(store: ApplicationState, props:  NeedPProps){

        let pair = store.combinedSystem.parpairs[props.index];
        let parameter = store.combinedSystem.parameters.find((e)=>{
            if(e.guid==props.parGuid){
                return true;
            }
            return false;
        });
        return {parameter: parameter, pair: pair}
   

}


export let ConnectedTestParameterEditor = connect((store: ApplicationState) => { return { parameters: store.combinedSystem.parameters, sys: store.combinedSystem.system } }, Store.actionCreators)(TesteCreateParameters);
let ConnectedParameter = connect(getParameterProps, Store.actionCreators)(Parameter)
let ConnectedParPair = connect(getPairProps, ParStore.actionCreators)(ParameterPairer);