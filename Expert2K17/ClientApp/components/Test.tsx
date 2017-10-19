import * as React from 'react';
import * as Spinner from 'react-spinkit';
import Slider from 'react-slick';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as TestStore from '../store/Test';
import * as UserStore from '../store/User';
import { QuestionType } from "../store/TestInterfaces";
import { Jumbotron, Badge, ListGroup, ListGroupItem, Row, Col, Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle } from 'reactstrap';
import DocumentTitle from 'react-document-title';
import '../css/cards.css';

type TestProps =
    TestStore.TestStore
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & typeof TestStore.actionCreators
    & RouteComponentProps<{ id: string }>;

export class Test extends React.Component<TestProps, {}> {
    render() {
        if (this.props.location.pathname == "/test") {
            return <Redirect to="/" />
        }
        else {
            this.props.loadTest(this.props.match.params.id)
        }
        if (this.props.test === null)
            return <Spinner name="ball-scale-multiple" />
        var settings = {
            className: '',
            dots: false,
            lazyLoad: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <DocumentTitle title={this.props.test.system.name}>
                <Row>
                    <Col xs="8">
                        <div className="test">
                            <Slider {...settings}>
                                {this.props.test.askedQuestions.map(e =>
                                    <div className="test-container">
                                        <Card>
                                            <CardBlock>
                                                <div className="card-title">
                                                    <h1>{e.question}</h1><hr />
                                                </div>
                                                <div>
                                                    {(() => {
                                                        if (e.type === QuestionType.Variety) {
                                                            return (
                                                                <Form>
                                                                    <FormGroup>
                                                                        <legend>Выберите один из ответов:</legend>
                                                                        <FormGroup check>
                                                                            {e.answers.map((a, i) => (<Label check>
                                                                                <Input onChange={() => this.props.answerQuestion(e.guid, i)} key={i} type="radio" name={e.guid} />{' '}
                                                                                {a}
                                                                            </Label>))}
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Form>
                                                            )
                                                        } else {
                                                            return (
                                                                <Form>
                                                                    <FormGroup>
                                                                        <Input onChange={() => (g: React.ChangeEvent<HTMLInputElement>) => this.props.answerQuestion(e.guid, g.target.value)} type="text" name="inputLabel" id="inputLabel" placeholder="Введите свой ответ" />
                                                                    </FormGroup>
                                                                </Form>
                                                            )
                                                        }
                                                    })()}
                                                </div>
                                            </CardBlock>
                                        </Card>
                                    </div>
                                )}
                            </Slider>
                        </div>
                    </Col>
                    <Col xs="4">
                        <div>
                            <Jumbotron className="card">
                                <h1>Список объектов:</h1><hr />
                                <ListGroup>
                                    {this.props.test.objects.map(e => <ListGroupItem className="justify-content-between">{e.name}<Badge pill>{(e.exactness * 100).toFixed(0) + "%"}</Badge></ListGroupItem>)}
                                </ListGroup>
                            </Jumbotron>
                        </div>
                    </Col>
                </Row>
            </DocumentTitle>);
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.test, ...state.user }),
    { ...TestStore.actionCreators, ...UserStore.actionCreators }
)(Test);