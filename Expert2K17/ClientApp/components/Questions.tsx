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

class TestCreaterQuestions extends React.Component<CreateAttribute, {}>{
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
    question: Interf.Question;
    index: number;
    answer: Interf.Answer;
    questionGuid: string;
}

type SubjecterAttribute =
    AdditionalPairs
    &
    typeof Store.actionCreators;



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

class Answers extends React.Component<SubjecterAttribute, {}> {
    constructor() {
        super();

    }

    makeOptions = () => {
        return this.props.pairs.filter((e) => {
            if (e.parameterGuid == this.props.question.parameter_guid) { return true }
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
            if (this.props.index > -1) {
                this.props.syncAnswer(this.props.index, this.props.question.guid, this.props.answer.value, this.props.answer.answer, item.value);
                return;
            }
            this.props.addParpair(item.value, this.props.question.parameter_guid);
            return;
        }
        if (!!item && this.props.index > -1) {
            this.props.syncAnswer(this.props.index, this.props.question.guid, this.props.answer.value, this.props.answer.answer, item.value);
            return;
        }
    }

    onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.index != -1) {
            let valer = this.props.pairs.find((e) => {
                if (e.guid == this.props.answer.value) {
                    return true;
                }
            }).value + '';

            this.props.syncAnswer(this.props.index, this.props.question.guid, this.props.answer.value, e.target.value, valer);
        } else {
            this.props.addAnswer(this.props.answer.value, e.target.value, this.props.question.guid);
        }

    }
    defaultValue = () => {
        if (this.props.pairs.length > 0) {
            let neededValue = this.props.pairs.findIndex((e: Interf.ParameterPair) => {
                if (e.guid == this.props.answer.value) {
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
                        <Input type="textarea" value={this.props.answer.answer} onChange={this.onTextChange} />
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


interface NeededPropsAnswers{
    index: number;
    questionGuid: string;
}

function getAnswerProps(store: ApplicationState, props: NeededPropsAnswers) {

    let answer = store.combinedSystem.questions.find((e) => {
        if (e.guid == props.questionGuid) {
            return true;
        }

    }).answers.find((e, ind) => {
        if (ind == props.index) {
            return true;
        } 
        })
    let question = store.combinedSystem.questions.find((e) => {
        if (e.guid == props.questionGuid) {
            return true;
        }
    });
    let values = store.combinedSystem.parpairs.filter((e) => {
        if (e.parameterGuid == question.parameter_guid) {
            return true;
        }
        return false;

    })

    if (props.index == -1) {
        return { answer: {value: '', answer: ''}, question: question, pairs: values };

    }

    return { answer: answer, question: question, pairs: values };


}

let ConnectedNewQuestion = connect(() => ({}), Store.actionCreators)(NewQuestion)
let ConnectedAnswer = connect(getAnswerProps, Store.actionCreators)(Answers)