import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as PanelStore from '../store/Panel';
import * as Spinner from 'react-spinkit';
import { Link, NavLink, Route, Redirect } from 'react-router-dom';
import { Badge, Row, Col, ButtonGroup, Label, ListGroup, ListGroupItem, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
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
								<Col xs>
									<h5>Список пользователей:</h5>
									<ListGroup>
										<PanelListItem text="MaxAvatar" />
										<PanelListItem text="Gittorian" />
										<PanelListItem text="Matshch" />
									</ListGroup>
								</Col>
								<Col xs>
									<h5>Список тестов:</h5>
									<ListGroup>
										<PanelListItem text="Какую аниму посмотреть?" />
										<PanelListItem text="Какую вайфу выбрать?" />
										<PanelListItem text="Как доесть картошечку?" />
									</ListGroup>
								</Col>
								<Col xs>
									<h5>Список групп:</h5>
									<ListGroup>
										<PanelGroupItem text="ИУ5-71" year="2017" />
										<PanelGroupItem text="ИУ5-72" year="2017" />
										<PanelGroupItem text="ИУ5-73" year="2017" />
										<PanelGroupItem text="ИУ5-74" year="2017" />
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

class PanelListItem extends React.Component<{ text: string }, {}> {
	public render() {
		return (
			<Link className="list-group-item list-group-item-action" to={"/"}>
				{this.props.text}
				<i className="fa fa-trash-o" aria-hidden="true" />
			</Link>
		);
	}
}

class PanelGroupItem extends React.Component<{ text: string, year: string }, {}> {
	public render() {
		return (
			<Link className="list-group-item list-group-item-action" to={"/"}>
				{this.props.text}<Badge pill>{this.props.year}</Badge>
				<i className="fa fa-trash-o" aria-hidden="true" />
			</Link>
		);
	}
}

export default connect(
	(state: ApplicationState) => ({ ...state.panel, ...state.user }),
	{ ...PanelStore.actionCreators, ...UserStore.actionCreators }
)(Panel);