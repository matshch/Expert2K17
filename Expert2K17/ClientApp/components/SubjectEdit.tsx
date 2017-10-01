// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Subject';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
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
    constructor() {
        super();
    }

    render() {
        return <Container fluid>
            {(() => {
                this.props.subjects.map((val, key) => {
                    return <ConnectedSubject index={key} />
                })

            })}
            <ConnectedNewSubject/>
        </Container>
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
    constructor() {
        super();
    }
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncSubject({
            ...this.props.subject,
            name: e.target.value
        });
    }
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.props.subject.name} placeholder="Название объекта"></Input>
                        </Col>
                    </FormGroup> 
                    {(() => {
                        if (this.props.subject.guid != '') {
                            return this.props.attr.map((val, key) => {
                                return <SubjectToAttribute attr={val} subject={this.props.subject} pairs={this.props.pairs.filter((pair) => {
                                    if (pair.attributeGuid == val.guid) {
                                        return true;
                                    } 
                                    return false;
                                })} />
                            })
                        }

                    })}
                </Form>
            </CardBlock>
        </Card>
    }
}


class NewSubject extends React.Component<typeof Store.actionCreators, Interf.Subject>{
    constructor() {
        super();
        this.state = {
            system_guid: '',
            name: '',
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
    saveSubject = () => {
        this.props.addSubject(this.state);
        this.setState({
            system_guid: '',
            name: '',
            guid: ''
        })
    }

    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.state.name} placeholder="Название объекта"></Input>
                        </Col>
                    </FormGroup>
                    <Button color="success" onClick={this.saveSubject}>Создать</Button>
                </Form>
            </CardBlock>
        </Card>
    }
}

interface AdditionalPairs {

    pairs: Interf.Pair[];
    subject: Interf.Subject;
    attr: Interf.Attribute;
}


interface STACallbacks {
    added?: (value: string, attrGuid: string) => void;

}
type SubjecterAttribute =
    AdditionalPairs
    &
    STACallbacks;
    


interface OptionValue {
    label: string;
    value: any;
}

class SubjectToAttribute extends React.Component<SubjecterAttribute, {} > {
    constructor() {
        super();

    }

    makeOptions = () => {
        return this.props.pairs.filter((e) => {
            if (e.attributeGuid == this.props.attr.guid)
            { return true }
            else
            { return false }
        }).map((e) => {           
                return {
                    label: e.value,
                    value: e.value
                }           
        })
    }

    onVChange = (item: any) => {
        if (!!item && !!item.newOption as any) {
            this.props.added(item.value, this.props.attr.guid );
        }
    }

    render() {
        return <Card>
            <CardBlock>
                <Row>
                    <Col lg={6}>
                        <Label>{this.props.attr.name}</Label>
                    </Col>
                    <Col lg={6}>
                        <ComboBox.SimpleSelect options={this.makeOptions()} createFromSearch={
                            (options, search) => {
                                if (search.length == 0 || (options.map(function (option) {
                                    return option.label;
                                })).indexOf(search) > -1)
                                    return null as OptionValue;
                                else
                                    return { label: search, value: search };
                            }
                        }
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
                            placeholder="Выберите значение атрибута"></ComboBox.SimpleSelect>
                    </Col>
                </Row>
            </CardBlock>
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

let ConnectedNewSubject = connect(() => { return {}}, Store.actionCreators)(NewSubject);

let ConnectedSubject = connect(getStore, Store.actionCreators)(Subject);
export default connect((store: ApplicationState) => { return { system: store.combinedSystem.system, subjects: store.combinedSystem.subjects } }, Store.actionCreators)(TestCreaterSubject);