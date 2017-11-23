// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Subject';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, InputGroup, InputGroupButton, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as ComboBox from 'react-selectize';

type CreateAttribute =
    Interf.KSubject
    &
    Interf.KSystem
    &
    typeof Store.actionCreators;

class TestCreaterSubject extends React.Component<CreateAttribute, {}>{
    render() {
        return <div>
            {this.props.subjects.map((val, key) => {
                return <ConnectedSubject key={key} index={key} />
            }).concat(<ConnectedSubject key={this.props.subjects.length} index={-1} />)

            }
            </div>
    }
}



interface AdditionalProps {
    index: number;
    pairs: Interf.Pair[];
    subject: Interf.Subject
}

type SubjectPropsType =
    AdditionalProps
    &
    typeof Store.actionCreators
    &
    Interf.KSystem
    &
    Interf.KAttributes;


class Subject extends React.Component<SubjectPropsType, {}>{
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.index > -1) {
            this.props.syncSubject({
                ...this.props.subject,
                name: e.target.value
            });
        } else {
            if (e.target.value.length > 0) {
                this.props.addSubject(
                    {
                        system_guid: '',
                        name: e.target.value,
                        guid: ''
                    }
                )
            }

        }
    }

    addCallback = (value: string, attrGuid: string) => {
        this.props.addPair(attrGuid, value, this.props.subject.guid);
    }
    selectedCallback = (value: string, attrGuid: string) => {
        this.props.setPair(attrGuid, value, this.props.subject.guid);
    }

    onFullDelete = () => {
        this.props.deleteSubject(this.props.subject.guid);
    }

    render() {
        if (this.props.index > -1) {
            return <Card className="test object">
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="texter">Название</Label>
                            <InputGroup>
                                <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.subject.name} placeholder="Название объекта"></Input>
                                <InputGroupButton color="danger"><Button onClick={this.onFullDelete} color="danger"><i className="fa fa-trash" ></i></Button></InputGroupButton>
                            </InputGroup>
                        </FormGroup>
                        <ListGroup className='listGrouperTest'>
                            {(() => {
                                if (this.props.subject.guid != '' && this.props.attr.length > 0) {
                                    return this.props.attr.map((val, key) => {
                                        return <SubjectToAttribute attr={val} key={key} subject={this.props.subject} selected={this.selectedCallback} added={this.addCallback} pairs={this.props.pairs.filter((pair) => {
                                            if (pair.attributeGuid == val.guid) {
                                                return true;
                                            }
                                            return false;
                                        })} />
                                    })
                                }

                            })()}
                        </ListGroup>
                    </Form>
                </CardBody>
            </Card>
        } else {
            return <Card className="test object">
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="texter">Название</Label>
                            <InputGroup>
                                <Input type="text" name="text" id="texter" onChange={this.name_change} value={this.props.subject.name} placeholder="Название объекта"></Input>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        }
    }
}




interface AdditionalPairs {

    pairs: Interf.Pair[];
    subject: Interf.Subject;
    attr: Interf.Attribute;
}


interface STACallbacks {
    added: (value: string, attrGuid: string) => void;
    selected: (value: string, attrGuid: string) => void;
}
type SubjecterAttribute =
    AdditionalPairs
    &
    STACallbacks;



interface OptionValue {
    label: string;
    value: any;
}


function findSubjectGuid(subj: string, arr: string[]) {
    if (arr.findIndex((e) => { if (e == subj) { return true; } return false; }) > -1) {
        return true
    }
    return false
}

class SubjectToAttribute extends React.Component<SubjecterAttribute, {}> {
    makeOptions = () => {
        return this.props.pairs.filter((e) => {
            if (e.attributeGuid == this.props.attr.guid) { return true }
            else { return false }
        }).map((e) => {
            return {
                label: e.value,
                value: e.value
            }
        })
    }
    onVChange = (item: any) => {
        if (!!item && !!item.newOption as any) {
            this.props.added(item.value, this.props.attr.guid);
            return;
        }
        if (!!item) {
            this.props.selected(item.value, this.props.attr.guid);
            return;
        }
    }

    defaultValue = () => {
        if (this.props.pairs.length > 0) {
            let neededValue = this.props.pairs.findIndex((e: Interf.Pair) => {
                if (e.attributeGuid == this.props.attr.guid && findSubjectGuid(this.props.subject.guid, e.subjectGuids)) {
                    return true
                }
                return false;
            })
            if (neededValue > -1) {
                return {
                    label: this.props.pairs[neededValue].value,
                    value: this.props.pairs[neededValue].value
                };
            }
        }

        return (null as OptionValue);
    }

    render() {
        return <Card>
            <CardBody>
                <Label>{this.props.attr.name}</Label>
                <ComboBox.SimpleSelect options={this.makeOptions()}
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
                    defaultValue={this.defaultValue()}
                    onValueChange={this.onVChange}

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
                    placeholder="Выберите или создайте значение атрибута"></ComboBox.SimpleSelect>
            </CardBody>
        </Card>
    }
}


interface NeededAttributeProps {
    index: number
}

const subjectDefault: Interf.Subject = {
    name: '',
    guid: '',
    system_guid: ''
}

function getStore(store: ApplicationState, props: NeededAttributeProps) {
    if (props.index != -1) {
        return {
            subject: store.combinedSystem.subjects[props.index],
            system: store.combinedSystem.system,
            pairs: store.combinedSystem.pairs,
            attr: store.combinedSystem.attributes
        }

    }
    return {
        subject: subjectDefault,
        system: store.combinedSystem.system,
        pairs: store.combinedSystem.pairs,
        attr: store.combinedSystem.attributes
    }
}

let ConnectedSubject = connect(getStore, Store.actionCreators)(Subject);
export default connect((store: ApplicationState) => { return { system: store.combinedSystem.system, subjects: store.combinedSystem.subjects } }, Store.actionCreators)(TestCreaterSubject);