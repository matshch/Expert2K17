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
    parameterPairs: Interf.ParameterPair[];
    pairs: Interf.Pair[];
    condition: Interf.Condition;
    type: Interf.ComponentCondition;
    dependancy: string;
}

interface OptionValue {
    label: string;
    value: any;
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
        if (this.props.type == Interf.ComponentCondition.Result) {
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
                    parameter: mode,
                    right: ''
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
                this.props.addCondition(newCondition, this.props.dependancy);
                return;
            }
        }
        
    }

    prepareActs = () => {

        if (this.props.condition.origin == Interf.ComponentCondition.Logic || this.props.condition.origin == Interf.ComponentCondition.Question) {
            const ifer = [
                { label: '==', value: Interf.Operation.Equal },
                { label: '>', value: Interf.Operation.Greater },
                { label: '<', value: Interf.Operation.Less },
                { label: '!=', value: Interf.Operation.NotEqual },
            ]
            return ifer;
        }
        if (this.props.condition.origin == Interf.ComponentCondition.Result) {
            const ifer = [
                { label: '+', value: Interf.Operation.Add },
                { label: '=', value: Interf.Operation.Set },
                { label: '-', value: Interf.Operation.Substract }
            ]
            return ifer;
        }

    }

    defaultValueMiddle = () => {
        if (this.props.condition.act == Interf.Operation.Add) {
            return { label: '+', value: Interf.Operation.Add }
        }
        if (this.props.condition.act == Interf.Operation.Equal) {
            return { label: '==', value: Interf.Operation.Equal }
        }
        if (this.props.condition.act == Interf.Operation.Greater) {
            return { label: '>', value: Interf.Operation.Greater }
        }
        if (this.props.condition.act == Interf.Operation.Less) {
            return { label: '<', value: Interf.Operation.Less }
        }
        if (this.props.condition.act == Interf.Operation.NotEqual) {
            return { label: '!=', value: Interf.Operation.NotEqual }
        }
        if (this.props.condition.act == Interf.Operation.Set) {
            return { label: '=', value: Interf.Operation.Set }
        }
        if (this.props.condition.act == Interf.Operation.Substract) {
            return { label: '-', value: Interf.Operation.Substract }
        }
    }

    onValueChangeMiddle = (item: any) => {
        if (this.props.index > -1 && !!item) {
            let newCondition: Interf.Condition = {
                ...this.props.condition,
                act: item.value
            }
            this.props.syncCondition(newCondition);
        }
    }


    prepareValues = () => {
        if (this.props.index > -1) {
            if (this.props.condition.parameter == 1) {
                let parameter = this.props.parameters.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                let pairs = this.props.parameterPairs.filter((e) => {
                    if (e.parameterGuid == parameter.guid) {
                        return true;
                    }
                    return false;
                }).map((e, index) => {
                    return {
                        value: index,
                        label: e.value
                    }

                })
            }
            if (this.props.condition.parameter == 0) {
                let attribute = this.props.attributes.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                let pairs = this.props.pairs.filter((e) => {
                    if (e.attributeGuid == attribute.guid) {
                        return true;
                    }
                    return false;
                }).map((e,ind) => {
                    return {
                        value: ind,
                        label: e.value
                    }

                })
            }



        }
        return [{
            label: 'Выберите параметр',
            value: ''
        }];
    }
    defaultValueRight = () => {
        if (this.props.index > -1) {
            if (this.props.condition.parameter == 1 && this.props.condition.right.length > 0) {
                let parameter = this.props.parameters.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                let pair = this.props.parameterPairs.filter((e) => {
                    if (e.parameterGuid == parameter.guid) {
                        return true;
                    }
                    return false;
                }).find((e) => {
                        if (e.guid == this.props.condition.right) {
                            return true;
                        }
                    })

                return {
                    value: pair.guid,
                    label: pair.value
                }
            }
            if (this.props.condition.parameter == 0 && this.props.condition.right.length > 0) {
                let attribute = this.props.attributes.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                let pair = this.props.pairs.filter((e) => {
                    if (e.attributeGuid == attribute.guid) {
                        return true;
                    }
                    return false;
                }).find((e) => {
                    if (e.guid == this.props.condition.right) {
                        return true;
                    }
                })
                return {
                    value: pair.guid,
                    label: pair.value
                }
            }
        }

    }

    onVRightChange = (item: any) => {
        if (this.props.index > -1) {
            if (!!item && !!item.newOption as any) {

                let name: string = item.label;
                var mode: number = -1;
                if (name.split(' ')[0] == 'Параметр') {
                    mode = 1;
                } else if (name.split(' ')[0] == 'Атрибут') {
                    mode = 0;
                }
                let newCondition: Interf.Condition = {
                    ...this.props.condition,
                    right: item.value,
                    parameter: mode
                }
                this.props.syncWithAddCondition(newCondition, item.label);
                return;
            }


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
                    right: item.value,
                    parameter: mode
                }
                this.props.syncCondition(newCondition);
                return;
            }

        }

    }

    inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newCondition: Interf.Condition = {
            ...this.props.condition,
            right: e.target.value
        }
        this.props.syncCondition(newCondition);
    }

    inputReturner = () => {
        const combobox = <ComboBox.SimpleSelect
            options={this.prepareValues()}
            createFromSearch={
                (options, search) => {
                    if (search.length == 0 || (options.map(function (option) {
                        return option.label;
                    })).indexOf(search) > -1)
                        return null as OptionValue;
                    else
                        return { label: search, value: search };
                }
            }
            onValueChange={this.onVRightChange}
            defaultValue={this.defaultValueRight()}
            renderOption={function (item: any) {
                return <div className="simple-option" style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                        backgroundColor: item.label, borderRadius: "50%", width: 24, height: 24
                    }}></div>
                    <div style={{ marginLeft: 10 }}>
                        {!!item.newOption ? "Добавить " + item.label + " ..." : item.label}
                    </div>
                </div>
            }}
        />;

        const attrCombobox = <ComboBox.SimpleSelect
            options={this.prepareValues()}
            onValueChange={this.onVRightChange}
            defaultValue={this.defaultValueRight()}
           
        />;

        const inputer = <Input placeholder="Введите значение" value={this.props.condition.right} onChange={this.inputOnChange} />


        if (this.props.index > -1) {
            if (this.props.condition.parameter == 1) {
                let parameter = this.props.parameters.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                if (parameter.unitValue) {
                    return inputer
                }
                return combobox;
            }
            if (this.props.condition.parameter == 0) {
                let attribute = this.props.attributes.find((e) => {
                    if (e.guid == this.props.condition.left) {
                        return true;
                    }
                })
                if (attribute.unitValue) {
                    return inputer
                }
                return attrCombobox;
            }

            return combobox;
        }
        else {
            return combobox;
        }
    }


    render() {
        return   <Form>
                    <FormGroup row>
                        <Row>
                            <Col lg={4}>
                                <ComboBox.SimpleSelect
                                    options={this.makeOptionsUnited()}
                                    defaultValue={this.defaultValueLeft()}
                                    onValueChange={this.onVLeftChange}
                                />
                            </Col>
                            <Col lg={4}>
                                <ComboBox.SimpleSelect
                                    options={this.prepareActs()}
                                    defaultValue={this.defaultValueMiddle()}
                                    onValueChange={this.onValueChangeMiddle}
                                />
                            </Col>
                            <Col lg={4}>
                                {this.inputReturner()}
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
            
    }
}


interface ConnectProps {
    mode: number;
    index: number;
    type: Interf.ComponentCondition;
    dependancy: string;
}

function getConditionProps(store: ApplicationState, props: ConnectProps) {
    if (props.index >= 0) {
        let condition = store.combinedSystem.conditions[props.index];

        return { parameters: store.combinedSystem.parameters, attributes: store.combinedSystem.attributes, condition: condition, parameterPairs: store.combinedSystem.parpairs, pairs: store.combinedSystem.pairs  };
    }

    let defaultCondition: Interf.Condition = {
        left: '', // guid par/attr
        right: '', // value
        act: Interf.Operation.Equal,
        parameter: props.mode, 
        guid: '',
        origin: props.type
    }
    return { parameters: store.combinedSystem.parameters, attributes: store.combinedSystem.attributes, condition: defaultCondition, parameterPairs: store.combinedSystem.parpairs, pairs: store.combinedSystem.pairs };



}
export let ConnectedCondition = connect(getConditionProps, Store.actionCreators)(Condition)