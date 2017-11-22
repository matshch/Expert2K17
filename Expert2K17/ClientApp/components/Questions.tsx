// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/Question';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
import * as ComboBox from 'react-selectize';
import * as Conditioner from './Condition';

type CreateAttribute =
    Interf.KQuestion
    &
    typeof Store.actionCreators;

export class TestCreaterQuestions extends React.Component<CreateAttribute, {}>{
    render() {
        return <Container fluid>
            { this.props.questions.map((val, key) => {
                    return <ConnectedQuestion index={key} key={key} />
                }).concat(<ConnectedQuestion key={this.props.questions.length} index={-1}/>)

            }
        </Container>
    }
}


interface PArameterAdditionalProps {
    index: number;
    question: Interf.Question;
    parameters: Interf.Parameter[];
    questions: Interf.Question[];
    conditions: Interf.Condition[];
}



type QuestionProps =
    PArameterAdditionalProps
    &
    typeof Store.actionCreators;

class Question extends React.Component<QuestionProps, {}>{
    name_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(this.props.index> -1){
            this.props.syncQuestion({
                ...this.props.question,
                question: e.target.value
            })
        } else {
            if(e.target.value.length > 0){
                this.props.addQuestion(
                    {
                        question: e.target.value,
                        guid: '',
                        parameter_guid: '',
                        answers: [],
                        type: Interf.QuestionType.Variety,
                        cast_after: '', //Question_guid
                        cast_if: '' //Condition guid 
                    }
                )
            }

        }


    }

    defaultValue = () => {
        if (this.props.parameters.length > 0) {
            let guid = this.props.question.parameter_guid
            let pardef = this.props.parameters.find((e) => {
                if (e.guid == guid) {
                    return true;
                }
            })
            if (typeof pardef != 'undefined') {
                let name = pardef.name
                return {
                    label: name,
                    value: name
                }
            }
            return null;
        }
        return null;
    }

    makeOptions = () => {
        return this.props.parameters.map((e) => {
            return {
                label: e.name,
                value: e.guid
            }

        })
    }

    onVChange = (item: any) => {
        if (!!item && this.props.index > -1) {
            this.props.changeParameter(this.props.question.guid, item.value);
            return;
        }
    }

    optionerForQuest = () => {
        return this.props.questions.filter((e) => {
            if (e.guid == this.props.question.guid) {
                return false;
            }
            return true
        }).map((e) => {
            return {
                label: e.question,
                value: e.guid
            }
        })
    }

    defaultQuest = () => {
        let qq = this.props.questions.find((e) => {
            if (e.guid == this.props.question.cast_after) {
                return true;
            }
        });
        if (typeof qq != 'undefined') {
            return {
                label: qq.question,
                value: qq.guid
            }
        }

    }

    changeQuest = (item: any) => {
        if (!!item) {
            this.props.syncQuestion({
                ...this.props.question,
                cast_after: item.value
            })
        }
    }
    renderThen = () => {
        if (this.props.question.cast_if.length > 0) {
            let ind = this.props.conditions.findIndex((e) => {
                if (e.guid == this.props.question.cast_if) {
                    return true;
                }
            })
            return <Conditioner.ConnectedCondition dependancy={this.props.question.guid}
             index={ind} type={Interf.ComponentCondition.Question} mode={-1} />
        }
        return <Conditioner.ConnectedCondition dependancy={this.props.question.guid}
         index={-1} type={Interf.ComponentCondition.Question} mode={-1} />
    }

    onFullDelete = () => {
        this.props.deleteQuestion(this.props.question.guid);
    }

    render() {
        if(this.props.index > -1) {
            return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Формулировка вопроса</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.props.question.question} onChange={this.name_change} placeholder="Вопрос"></Input>
                        </Col>
                    </FormGroup>                  
                    <FormGroup row>
                        <Label for="chb2" sm={3}>Параметр</Label>
                        <Col sm={9}>
                            <ComboBox.SimpleSelect 
                                options={this.makeOptions()}
                                defaultValue={this.defaultValue()}
                                onValueChange={this.onVChange} 
                                placeholder="Выберите параметр"></ComboBox.SimpleSelect>
                        </Col>
                    </FormGroup>
                    {(() => {
                        if (this.props.questions.length > 1) {
                            return <FormGroup row>
                                <Label for="chb2" sm={3}>Выводить после</Label>
                                <Col sm={9}>
                                    <ComboBox.SimpleSelect
                                        options={this.optionerForQuest()}
                                        defaultValue={this.defaultQuest()}
                                        onValueChange={this.changeQuest}
                                        placeholder="Выберите вопрос"></ComboBox.SimpleSelect>
                                </Col>
                            </FormGroup>
                        }
                    })()}
                    {this.renderThen()}


                    {(() => {
                        if (this.props.index != -1 && this.props.question.parameter_guid.length > 0 && this.props.question.type == Interf.QuestionType.Variety) {
                            return (<div>
                                <hr />
                                <ListGroup>
                                    {this.props.question.answers.map((val, key) => {
                                        return <ConnectedAnswer index={key} questionGuid={this.props.question.guid} key={key} />
                                    }).concat([
                                        <ConnectedAnswer index={-1} key={this.props.question.answers.length} questionGuid={this.props.question.guid} />
                                    ])}
                                </ListGroup>
                            </div>)
                        }
                    })()}
                    <Button color="danger" onClick={this.onFullDelete} size="xs" block><i className="fa fa-trash" ></i> Удалить</Button>

                </Form>
            </CardBody>
        </Card>
        } else {
            return <Card className="createSideBar">
            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label for="texter" sm={3}>Формулировка вопроса</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" id="texter" value={this.props.question.question} onChange={this.name_change} placeholder="Вопрос"></Input>
                        </Col>
                    </FormGroup>                                   
                </Form>
            </CardBody>
        </Card>
        }
       
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
    makeOptions = () => {
        let arra: string[] = this.props.question.answers.map((e) => {
            return e.value
        })

        return this.props.pairs.filter((e) => {
            if (e.parameterGuid == this.props.question.parameter_guid && !arra.includes(e.guid)) { return true }
            else { return false }
        }).map((e) => {
            return {
                label: e.value,
                value: e.guid
            }
        })
    }
    onVChange = (item: any) => {
            if (!!item && !!item.newOption as any) {
                this.props.syncNewAnswer(this.props.index, this.props.question.guid, this.props.answer.answer, item.label);
                return;
            }
            if (!!item) {
                this.props.syncAnswer(this.props.index, this.props.question.guid, item.value, this.props.answer.answer);
                return;
            }

    }

    onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.index != -1) {
            /*let valer = this.props.pairs.find((e) => {
                if (e.guid == this.props.answer.value) {
                    return true;
                }
            }).value + '';*/

            this.props.syncAnswer(this.props.index, this.props.question.guid, this.props.answer.value, e.target.value);
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

    onFullDelete = () => {
        this.props.deleteAnswer(this.props.question.guid, this.props.index);
    }

    render() {
        return <Card>
            <CardBody>
                <Row>
                    <Col lg={4}>
                        <label>Ответ</label>
                    </Col>
                    <Col lg={8}>
                        <Input type="textarea" value={this.props.answer.answer} onChange={this.onTextChange} />
                    </Col>
                </Row>     
                <br/>
                {(() => {
                    if (this.props.index > -1) {
                        return <div><Row>
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
                        <Button color="danger" onClick={this.onFullDelete} size="xs" block><i className="fa fa-trash" ></i> Удалить</Button>
                        
                        </div>
                    }

                })()}
                   
            </CardBody>
        </Card>
    }
}



interface NeededPropsAnswers{
    index: number;
    questionGuid: string;
}

function getAnswerProps(store: ApplicationState, props: NeededPropsAnswers) {

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
        return { answer: { value: '', answer: '' }, question: question, pairs: values };

    }

    let answer = store.combinedSystem.questions.find((e) => {
        if (e.guid == props.questionGuid) {
            return true;
        }

    }).answers.find((e, ind) => {
        if (ind == props.index) {
            return true;
        } 
        })




    return { answer: answer, question: question, pairs: values };


}

let ConnectedAnswer = connect(getAnswerProps, Store.actionCreators)(Answers)


interface NeededPropsQuestion {
    index: number;
}


function getQuestionProps(store: ApplicationState, props: NeededPropsQuestion) {
    if(props.index > -1){
        let question = store.combinedSystem.questions.find((e, ind) => {
            if (ind == props.index) {
                return true;
            }
        });
    
        return { question: question, questions: store.combinedSystem.questions, parameters: store.combinedSystem.parameters, conditions: store.combinedSystem.conditions };
    
    } else {
        return { question: 
            {
                question: '',
                guid: '',
                parameter_guid: '',
                answers: [],
                type: Interf.QuestionType.Variety,
                cast_after: '', //Question_guid
                cast_if: '' //Condition guid 
            },
            questions: store.combinedSystem.questions,
            parameters: store.combinedSystem.parameters,
            conditions: store.combinedSystem.conditions };        
    }


}
let ConnectedQuestion = connect(getQuestionProps, Store.actionCreators)(Question)
export let ConnectedQuestionCreator = connect((state: ApplicationState) => { return { questions: state.combinedSystem.questions } }, Store.actionCreators)(TestCreaterQuestions)