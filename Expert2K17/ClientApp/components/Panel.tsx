import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as PanelStore from '../store/Panel';
import * as Spinner from 'react-spinkit';
import { Link, NavLink, Route, Redirect } from 'react-router-dom';
import { Row, Col, ButtonGroup, Label, ListGroup, ListGroupItem, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import DocumentTitle from 'react-document-title';
import * as UserStore from '../store/User';

type PanelProps =
    PanelStore.PanelState
    & typeof PanelStore.actionCreators
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{}>;

export class Panel extends React.Component<PanelProps, {}> {
    constructor() {
        super();
        this.state = { showPictureButtons: false }
    }

    componentWillMount() {
        this.props.GetUser();
    }

    render() {
        if (this.props.user === null)
            return <Redirect to="/login" />
        if (this.props.user === undefined || (this.props.TestsList.length === 0 && this.props.loading))
            return <Spinner name="ball-scale-multiple" />
        return (
            <DocumentTitle title='Профиль'>
                <div className='flex-container'>
                    <Card className="panel">
                        <CardBlock>
                            <div className="card-title"><h3>Панель управления</h3>    <h4>Добро пожаловать, {this.props.user.userName}</h4></div>
                            <Row>
                                <Col sm>
                                    <h5>Список пользователей:</h5>
                                    <ListGroup>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            MaxAvatar
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            Gittorian
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            Matshch
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                    </ListGroup>
                                </Col>
                                <Col sm>
                                    <h5>Список тестов:</h5>
                                    <ListGroup>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            Какую аниму посмотреть?
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            Как выбрать лучшую вайфу?
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            Как доесть картошечку?
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                    </ListGroup>
                                </Col>
                                <Col sm>
                                    <h5>Список групп:</h5>
                                    <ListGroup>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            ИУ5-71 (2017)
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            ИУ5-72 (2017)
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            ИУ5-73 (2017)
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                        <Link className="list-group-item list-group-item-action" to={"/"}>
                                            ИУ5-74 (2017)
                                                <i className="fa fa-trash-o" aria-hidden="true" />
                                        </Link>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </CardBlock>
                    </Card>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.panel, ...state.user }),
    { ...PanelStore.actionCreators, ...UserStore.actionCreators }
)(Panel);