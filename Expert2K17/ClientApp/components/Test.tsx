import * as React from 'react';
import * as Spinner from 'react-spinkit';
import Slider from 'react-slick';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as TestStore from '../store/Test';
import * as UserStore from '../store/User';
import { Alert, ButtonGroup, Label, ListGroup, ListGroupItem, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import '../css/cards.css';

type TestProps =
    TestStore.TestStore
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & typeof TestStore.actionCreators
    & RouteComponentProps<{ id: string }>;

export class Test extends React.Component<TestProps, {}> {
    render() {
        if (this.props.location.pathname == "/test/") {
            return <Redirect to="/" />
        }
        else {
            this.props.loadTest(this.props.match.params.id)
        }
        var settings = {
            className: '',
            dots: false,
            lazyLoad: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <div className="test">
                <Slider {...settings}>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h1>{this.props.test.system.name}</h1><hr />
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Card 2</h3>
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Card 3</h3>
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Card 4</h3>
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Card 5</h3>
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="test-container">
                        <Card>
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Card 6</h3>
                                </div>
                                <div>
                                    test
                            </div>
                            </CardBlock>
                        </Card>
                    </div>
                </Slider>
            </div>);
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.test, ...state.user }),
    { ...TestStore.actionCreators, ...UserStore.actionCreators }
)(Test);