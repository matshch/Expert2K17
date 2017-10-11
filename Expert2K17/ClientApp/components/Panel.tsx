import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as PanelStore from "../store/Panel";
import * as RegisterStore from "../store/Register";
import * as Spinner from "react-spinkit";
import { Link, Redirect } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Row, Col, ListGroup, Card, CardBlock } from "reactstrap";
import DocumentTitle from "react-document-title";
import * as UserStore from "../store/User";

type PanelProps =
    PanelStore.PanelState
    & typeof PanelStore.actionCreators
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & RegisterStore.RegisterState
    & typeof RegisterStore.actionCreators
    & RouteComponentProps<{}>;

export class Panel extends React.Component<PanelProps, { modal: boolean, showPictureButtons: boolean, modalLabel: string }> {
    constructor() {
        super();
        this.state = { showPictureButtons: false, modal: false, modalLabel: "" };
        this.toggle = this.toggle.bind(this);
    }

    toggle = () => {
        this.setState({
            ...this.state,
            modal: !this.state.modal
        });
    }

    componentWillMount() {
        this.props.GetUser();
        this.props.GetUsersList();
        this.props.GetAdminTestsList();
        this.props.GetGroupsYears();
    }

    render() {
        if (this.props.user === null || (this.props.user === undefined && this.props.userLoading === true) || this.props.user.isAdmin === false)
            return <Redirect to="/login" />;
        return (
            <DocumentTitle title="Профиль">
                <div>
                    <div className="flex-container">
                        <Card className="panel">
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Панель управления</h3> <h4>Добро пожаловать, {this.props.user.userName}</h4>
                                </div>
                                <Row>
                                    <Col xs>
                                        <h5>Список пользователей:</h5>
                                        <ListGroup>
                                            {this.props.UsersList.map(e => <PanelListItem onClick={this.toggle} text={e.userName} pic={e.userpic} />)}
                                        </ListGroup>
                                    </Col>
                                    <Col xs>
                                        <h5>Список тестов:</h5>
                                        <ListGroup>
                                            {this.props.TestsList.map(e => <PanelListItem onClick={this.toggle} text={e.name} pic={e.picture} />)}
                                        </ListGroup>
                                    </Col>
                                    <Col xs>
                                        <h5>Список групп:</h5>
                                        <ListGroup>
                                            {this.props.GroupsYearsObject.map(e => e.groups.map(g => <PanelGroupItem onClick={this.toggle} text={g} year={e.year} />))}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </CardBlock>
                        </Card>
                    </div>
                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}>
                            <ModalHeader toggle={this.toggle}>{this.state.modalLabel}</ModalHeader>
                            <ModalBody>
                                azaz
                        </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

class PanelListItem extends React.Component<{ text: string, pic: string, onClick: any }, {}> {
    render() {
        return (
            <Button onClick={this.props.onClick} className="list-group-item">
                <img className="listItemImg" src={this.props.pic} />
                {this.props.text}
                <i className="fa fa-trash-o" aria-hidden="true" />
            </Button>
        );
    }
}

class PanelGroupItem extends React.Component<{ text: string, year: string, onClick: any }, {}> {
    render() {
        return (
            <Button onClick={this.props.onClick} className="list-group-item">
                {this.props.text}<Badge pill>{this.props.year}</Badge>
                <i className="fa fa-trash-o" aria-hidden="true" />
            </Button>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.panel, ...state.user, ...state.register }),
    { ...PanelStore.actionCreators, ...UserStore.actionCreators, ...RegisterStore.actionCreators }
)(Panel);