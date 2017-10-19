import * as React from 'react';
import * as Spinner from 'react-spinkit';
import Slider from 'react-slick';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as TestStore from '../store/Test';
import * as UserStore from '../store/User';
import { QuestionType } from "../store/TestInterfaces";
import { Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle } from 'reactstrap';
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
                                                                {e.answers.map((a, i) => {
                                                                    <Label check>
                                                                        <Input key={i} type="radio" name={e.guid} />{' '}
                                                                        {a}
                                                                    </Label>
                                                                })}
                                                                </FormGroup>
                                                            </FormGroup>
                                                        </Form>
                                                    )
                                                } else {
                                                    return (
                                                        <Form>
                                                            <FormGroup>
                                                                <Input type="text" name="inputLabel" id="inputLabel" placeholder="Введите свой ответ" />
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
            </DocumentTitle>);
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.test, ...state.user }),
    { ...TestStore.actionCreators, ...UserStore.actionCreators }
)(Test);