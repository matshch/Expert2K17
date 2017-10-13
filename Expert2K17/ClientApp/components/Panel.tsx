import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as PanelStore from "../store/Panel";
import * as DataGrid from 'react-data-grid';
import * as RegisterStore from "../store/Register";
import * as Spinner from "react-spinkit";
import { Link, NavLink, Redirect, Route } from "react-router-dom";
import { Nav, NavItem, NavDropdown, DropdownItem, DropdownToggle, DropdownMenu, Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Row, Col, ListGroup, Card, CardBlock } from "reactstrap";
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
        if (this.props.location.pathname == '/panel') {
            return <Redirect to="/panel/users" />
        }
        if (this.props.user === null || (this.props.user === undefined && this.props.userLoading === true) || this.props.user.isAdmin === false)
            return <Redirect to="/login" />;
        return (
            <DocumentTitle title="Панель управления">
                <div>
                    <div className="flex-container">
                        <Card className="panel">
                            <CardBlock>
                                <div className="card-title">
                                    <h3>Панель управления</h3> <h4>Добро пожаловать, {this.props.user.userName}</h4>
                                </div>
                                <Tabs />
                                <div>
                                    <Route path='/panel/users' component={UsersPanel} />
                                    <Route path='/panel/tests' component={TestsPanel} />
                                    <Route path='/panel/groups' component={GroupsPanel} />
                                </div>
                            </CardBlock>
                        </Card>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export class UsersPanel extends React.Component<{}, { rows: any[], columns: any[] }> {
    constructor() {
        super();
        this.state = {
            columns: [{ key: 'id', name: 'ID' },
            { key: 'userName', name: 'Имя пользователя' },
            { key: 'surname', name: 'Фамилия' },
            { key: 'name', name: 'Имя' },
            { key: 'patronymic', name: 'Отчество' },
            { key: 'group', name: 'Группа' },
            { key: 'year', name: 'Год' }],
            rows: []
        }
    }
    public render() {
        return (<div><Table rows={this.state.rows} columns={this.state.columns} /></div>);
    }
}

export class TestsPanel extends React.Component<{}, { rows: any[], columns: any[] }> {
    constructor() {
        super();
        this.state = {
            columns: [{ key: 'id', name: 'ID' },
            { key: 'name', name: 'Название' },
            { key: 'description', name: 'Описание' },
            { key: 'username', name: 'Имя пользователя' }],
            rows: []
        }
    }
    public render() {
        return (<div><Table rows={this.state.rows} columns={this.state.columns} /></div>);
    }
}

export class GroupsPanel extends React.Component<{}, { rows: any[], columns: any[] }> {
    constructor() {
        super();
        this.state = {
            columns: [{ key: 'id', name: 'ID' },
            { key: 'group', name: 'Группа' },
            { key: 'year', name: 'Год' }],
            rows: []
        }
    }
    public render() {
        return (<div><Table rows={this.state.rows} columns={this.state.columns} /></div>);
    }
}


class Table extends React.Component<{ rows: any[], columns: any[] }, {}>{
    constructor() {
        super();
    }

    rowGetter = (i: number) => {
        return this.props.rows[i];
    }

    render() {
        return (
            <DataGrid
                columns={this.props.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.props.rows.length}
                minHeight={500} />);
    }
}

export class Tabs extends React.Component<{}, { dropdownOpen: boolean }> {
    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <div>
                <Nav pills>
                    <NavItem>
                        <NavLink to="/panel/users" className='nav-link' activeClassName='active'>Пользователи</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/panel/tests" className='nav-link' activeClassName='active'>Тесты</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/panel/groups" className='nav-link' activeClassName='active'>Группы</NavLink>
                    </NavItem>
                </Nav>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.panel, ...state.user, ...state.register }),
    { ...PanelStore.actionCreators, ...UserStore.actionCreators, ...RegisterStore.actionCreators }
)(Panel);