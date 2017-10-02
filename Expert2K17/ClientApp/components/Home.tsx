import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as HomeStore from '../store/Home';
import * as UserStore from '../store/User';
import ListItem from './ListItem';
import {FirstListItem} from './ListItem';
import '../css/flex.css';
import '../css/cards.css';

type HomeProps =
    HomeStore.HomeState
    & UserStore.UserState
    & typeof HomeStore.actionCreators
    & RouteComponentProps<{}>;

export class Home extends React.Component<HomeProps, {}> {
	componentWillMount() {
        this.props.GetCards();
    }

    renderListItem(key: string, t: string, st: string, tx: string, img: string) {
        return <ListItem key={key} id={key} title={t} subtitle={st} text={tx} image={img}/>;
    }

    render() {
    	if (this.props.loading && this.props.ResponseObject.length == 0)
            return <Spinner name="ball-scale-multiple" />
        var cards = this.props.ResponseObject.map(e => this.renderListItem(e.id, e.name, e.description, e.user.username, e.picture));
        return (
            <div className='flex-container home'>
                <FirstListItem text={(this.props.user === undefined || this.props.user === null) ? "username" : this.props.user.userName} />
            	{cards}
            </div>);
    }
}

export default connect(
    (state: ApplicationState) => ({...state.home, ...state.user}),
    HomeStore.actionCreators
)(Home);
