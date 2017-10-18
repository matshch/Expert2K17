import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { Toolbar } from 'react-data-grid-addons';
import * as PanelStore from "../store/Panel";
import * as DataGrid from 'react-data-grid';
import * as RegisterStore from "../store/Register";
import * as Spinner from "react-spinkit";
import { Link, NavLink, Redirect, Route } from "react-router-dom";
import { Nav, NavItem, NavDropdown, DropdownItem, DropdownToggle, DropdownMenu, Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Row, Col, ListGroup, Card, CardBlock } from "reactstrap";
import DocumentTitle from "react-document-title";
import * as UserStore from "../store/User";

type PanelProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{}>;


type PanelUsersProps =
    PanelStore.PanelState
    & typeof PanelStore.actionCreators
    & RouteComponentProps<{}>;

type PanelGroupsProps =
    RegisterStore.RegisterState
    & typeof RegisterStore.actionCreators

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
    }

    render() {
        if (this.props.location.pathname == '/panel') {
            return <Redirect to="/panel/users" />
        }
        if (this.props.user === null || this.props.user.isAdmin === false)
            return <Redirect to="/login" />;
        if (this.props.user === undefined)
            return <Spinner name="ball-scale-multiple" />
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
                                    <Route path='/panel/users' component={ConnectedUsersPanel} />
                                    <Route path='/panel/tests' component={ConnectedTestsPanel} />
                                    <Route path='/panel/groups' component={ConnectedGroupsPanel} />
                                </div>
                            </CardBlock>
                        </Card>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

class UsersPanel extends React.Component<PanelUsersProps, {}> {
    componentWillMount() {
        this.props.GetUsersList();
    }
    getRows = () => {
        return this.props.UsersList;
    }
    handleGridRowsUpdated = ({ fromRow, toRow, updated }: any) => {
        let rows = this.getRows().slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = { ...rowToUpdate, ...updated };
            rows[i] = updatedRow;
        }
        /*Отправляю дерьмо*/
        this.props.GetUsersList();
    }
    public render() {
        const columns = [{ key: 'id', name: 'ID', resizable: true, filterable: true },
        { key: 'userName', name: 'Имя пользователя', resizable: true, filterable: true, sortable: true },
        { key: 'surname', name: 'Фамилия', resizable: true, filterable: true, sortable: true },
        { key: 'name', name: 'Имя', resizable: true, filterable: true, sortable: true },
        { key: 'patronymic', name: 'Отчество', resizable: true, filterable: true, sortable: true },
        { key: 'group', name: 'Группа', resizable: true, filterable: true, sortable: true },
        { key: 'year', name: 'Год', resizable: true, filterable: true, sortable: true }];
        return (<div><Table handleGridRowsUpdated={this.handleGridRowsUpdated} rows={this.getRows()} columns={columns} /></div>);
    }
}

const ConnectedUsersPanel = connect(
    (state: ApplicationState) => state.panel,
    PanelStore.actionCreators
)(UsersPanel);

class TestsPanel extends React.Component<PanelUsersProps, {}> {
    componentWillMount() {
        this.props.GetAdminTestsList();
    }
    getRows = () => {
        return this.props.TestsList.map(e => ({ ...e, username: e.user.username }));
    }
    handleGridRowsUpdated = ({ fromRow, toRow, updated }: any) => {
        let rows = this.getRows().slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = { ...rowToUpdate, ...updated };
            rows[i] = updatedRow;
        }
        /*Отправляю дерьмо*/
        this.props.GetAdminTestsList();
    }
    public render() {
        const columns = [{ key: 'id', name: 'ID', resizable: true, filterable: true },
        { key: 'name', name: 'Название', resizable: true, filterable: true, sortable: true },
        { key: 'description', name: 'Описание', resizable: true, filterable: true, sortable: true },
        { key: 'username', name: 'Имя пользователя', resizable: true, filterable: true, sortable: true }];
        return (<div><Table handleGridRowsUpdated={this.handleGridRowsUpdated} rows={this.getRows()} columns={columns} /></div>);
    }
}

const ConnectedTestsPanel = connect(
    (state: ApplicationState) => state.panel,
    PanelStore.actionCreators
)(TestsPanel);

class GroupsPanel extends React.Component<PanelGroupsProps, {}> {
    componentWillMount() {
        this.props.GetGroupsYears();
    }
    getRows = () => {
        return [].concat(...this.props.GroupsYearsObject.map(e => e.groups.map(i => ({ group: i, year: e.year }))));
    }
    handleGridRowsUpdated = ({ fromRow, toRow, updated }: any) => {
        let rows = this.getRows().slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = { ...rowToUpdate, ...updated };
            rows[i] = updatedRow;
        }
        /*Отправляю дерьмо*/
        this.props.GetGroupsYears();
    }
    public render() {
        const columns = [{ key: 'group', name: 'Группа', resizable: true, filterable: true, sortable: true },
        { key: 'year', name: 'Год', resizable: true, filterable: true, sortable: true }];
        return (<div><Table handleGridRowsUpdated={this.handleGridRowsUpdated} rows={this.getRows()} columns={columns} /></div>);
    }
}

const ConnectedGroupsPanel = connect(
    (state: ApplicationState) => state.register,
    RegisterStore.actionCreators
)(GroupsPanel);


class Table extends React.Component<{ rows: any[], columns: any[], handleGridRowsUpdated: any }, { filters: any, sortColumn: any, sortDirection: any }>{
    constructor() {
        super();
        this.state = {
            filters: {},
            sortColumn: null,
            sortDirection: null
        }
    }

    rowGetter = (i: number) => {
        return this.props.rows[i];
    }

    getRows() {
        return this.props.rows;
    }

    getSize() {
        return this.getRows().length;
    }

    handleGridSort(sortColumn: any, sortDirection: any) {
        this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
    }

    handleFilterChange(filter: any) {
        let newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        this.setState({ filters: newFilters });
    }

    onClearFilters() {
        this.setState({ filters: {} });
    }

    render() {
        return (
            <DataGrid
                onGridSort={this.handleGridSort}
                enableCellSelect={true}
                columns={this.props.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.props.rows.length}
                minHeight={500}
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}
                onGridRowsUpdated={this.props.handleGridRowsUpdated} />);
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
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(Panel);