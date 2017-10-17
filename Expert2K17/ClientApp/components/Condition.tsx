// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Condition';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as ComboBox from 'react-selectize';


interface ConditionAdditionalProps {
    parameters: Interf.Parameter[];
    mode: number;
    index: number;
    attributes: Interf.Attribute[];
    condition: Interf.Condition;
    type: Interf.ComponentCondition;
}


type ConditionProps =
    ConditionAdditionalProps
    &
    typeof Store.actionCreators;


class Condition extends React.Component<ConditionProps, {}>{
    constructor() {
        super();
    }

    makeOptionsUnited = () => {
        if (this.props.mode != -2) {
            var values = this.props.parameters.map((e) => {
                return { label: 'Параметр ' + e.name, value: e.guid }
            }).concat(this.props.attributes.map((e) => {
                return { label: 'Атрибут ' + e.name, value: e.guid }
            }))
        } else {
            var values = this.props.parameters.map((e) => {
                return { label: 'Параметр ' + e.name, value: e.guid }
            })
        }
        return values;
    }
    defaultValueLeft = () => {
        if (this.props.condition.guid.length > 0 && this.props.condition.left.length > 0) {
            if (this.props.condition.parameter == 1) {
                let val = this.props.parameters.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                return {
                    value: val.guid,
                    label: val.name
                }
            } else if (this.props.condition.parameter == 0) {
                let val = this.props.attributes.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })

                return {
                    value: val.guid,
                    label: val.name
                }
            }
            return null;
        }
    }

    onVLeftChange = (item: any) => {
        if (this.props.index > -1) {
            if (!!item) {
                let name: string = item.label;
                var mode: number = -1;
                if (name.split(' ')[0] == 'Параметр') {
                    mode = 1;
                } else if (name.split(' ')[0] == 'Атрибут') {
                    mode = 0;
                }
                let newCondition: Interf.Condition = {
                    ...this.props.condition,
                    left: item.value,
                    parameter: mode
                }
                this.props.syncCondition(newCondition);
                return;
            }
        } else {
            if (!!item) {
                let name: string = item.label;
                var mode: number = -1;
                if (name.split(' ')[0] == 'Параметр') {
                    mode = 1;
                } else if (name.split(' ')[0] == 'Атрибут') {
                    mode = 0;
                }
                let newCondition: Interf.Condition = {
                    ...this.props.condition,
                    left: item.value,
                    parameter: mode,
                    origin: this.props.type
                }
                this.props.syncCondition(newCondition);
                return;
            }
        }
        
    }

    prepareActs = () => {
        const ifer = [
            { label: '+', value: Interf.Operation.Add },
            { label: '==', value: Interf.Operation.Equal },
            { label: '>', value: Interf.Operation.Greater },
            { label: '<', value: Interf.Operation.Less },
            { label: ' ', value: Interf.Operation.None },
            { label: '!=', value: Interf.Operation.NotEqual },
            { label: '=', value: Interf.Operation.Set },
            { label: '-', value: Interf.Operation.Substract },
        ]

        return ifer;
    }

    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Row>
                            <Col>
                                <ComboBox.SimpleSelect
                                    options={this.makeOptionsUnited()}
                                    defaultValue={this.defaultValueLeft()}
                                    onValueChange={this.onVLeftChange}
                                />
                            </Col>
                            <Col>
                                <ComboBox.SimpleSelect
                                    options={this.prepareActs()}
                                />
                            </Col>
                            <Col>
                                <ComboBox.SimpleSelect />
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
            </CardBlock>
        </Card>
    }
}


interface ConnectProps {
    mode: number;
    index: number;
    type: Interf.ComponentCondition;
}

function getConditionProps(store: ApplicationState, props: ConnectProps) {
    if (props.index >= 0) {
        let condition = store.combinedSystem.conditions[props.index];

        return { parameters: store.combinedSystem.parameters, attributes: store.combinedSystem.attributes, condition: condition };
    }

    let defaultCondition: Interf.Condition = {
        left: '', // guid par/attr
        right: '', // value
        act: Interf.Operation.None,
        parameter: props.mode, 
        guid: '',
        origin: props.type
    }
    return { parameters: store.combinedSystem.parameters, attributes: store.combinedSystem.attributes, condition: defaultCondition };



}
let ConnectedQuestion = connect(getConditionProps, Store.actionCreators)(Condition)