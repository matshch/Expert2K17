// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Question';
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
                return this.props.subjects.map((val, key) => {
                })

            })()}
            <ConnectedNewQuestion />
        </Container>
    }
}


interface AdditionalProps {
    index: number;
    pairs: Interf.ParameterPair[];
    question: Interf.Question
}

type QuestionPropsType =
    AdditionalProps
    &
    typeof Store.actionCreators
    &
    Interf.KSystem
    &
    Interf.KParameter;







interface AdditionalPairs {
    pairs: Interf.ParameterPair[];
    parameter: Interf.Parameter;
    question: Interf.Question;
    index: number;

}


interface STACallbacks {
    added: (value: string, attrGuid: string, index: number) => void;
    selected: (value: string, attrGuid: string, index: number) => void;
    texted: (answer: string, index: number) => void;
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

class Answeres extends React.Component<SubjecterAttribute, {}> {
    constructor() {
        super();

    }

    makeOptions = () => {
        return this.props.pairs.filter((e) => {
            if (e.parameterGuid == this.props.parameter.guid) { return true }
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
            this.props.added(item.value, this.props.parameter.guid, this.props.index);
            return;
        }
        if (!!item) {
            this.props.selected(item.value, this.props.parameter.guid, this.props.index);
            return;
        }
    }

    onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.texted(e.target.value, this.props.index);
    }
    defaultValue = () => {
        if (this.props.pairs.length > 0) {
            let neededValue = this.props.pairs.findIndex((e: Interf.ParameterPair) => {
                if (e.parameterGuid == this.props.parameter.guid) {
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
            <CardBlock>
                <Row>
                    <Col lg={4}>
                        <label>Вопрос</label>
                    </Col>
                    <Col lg={8}>
                        <Input type="textarea" value={this.props.} onChange={this.onTextChange} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={6}>
                        <Label>Значение параметра</Label>
                    </Col>
                    <Col lg={6}>
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
                            placeholder="Выберите значение параметра"></ComboBox.SimpleSelect>
                    </Col>
                </Row>
            </CardBlock>
        </Card>
    }
}



class NewQuestion extends React.Component<typeof Store.actionCreators, Interf.Question>{
    constructor() {
        super();
        this.state = {
            question: '',
            guid: '',
            parameter_guid: '',
            answers: [],
            cast_after: '', //Question_guid
            cast_if: '' //Condition guid 
        }
    }
    question_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {
                ...this.state,
                question: e.target.value
            }
        )
    }
    saveQuestion = () => {
        if (this.state.question != '') {
            this.props.addQuestion(this.state);
            this.setState({
                question: '',
                guid: ''
            })
        }
    }

    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Вопрос</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" onChange={this.question_change} value={this.state.question} placeholder="Формулировка вопроса"></Input>
                        </Col>
                    </FormGroup>
                    <Button color="success" onClick={this.saveQuestion}>Создать</Button>
                </Form>
            </CardBlock>
        </Card>
    }
}



let ConnectedNewQuestion = connect(() => ({}), Store.actionCreators)(NewQuestion)