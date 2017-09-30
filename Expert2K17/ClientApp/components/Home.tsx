import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Spinner } from 'react-spinkit';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CardsStore from '../store/Cards';
import ListItem from './ListItem';
import {FirstListItem} from './ListItem';
import '../css/flex.css';
import '../css/cards.css';

type HomeProps =
    CardsStore.CardsState
    & typeof CardsStore.actionCreators
    & RouteComponentProps<{}>;

export class Home extends React.Component<HomeProps, {}> {
	componentWillMount() {
        this.props.GetCards();
    }

    renderListItem(t: string, st: string, tx: string, img: string) {
        return <ListItem title={t} subtitle={st} text={tx} image={img}/>;
    }

    render() {
    	if (this.props.loading && this.props.SomeUselessObject.length == 0)
    		return <Spinner name="ball-scale-multiple" />;
    	var cards = this.props.SomeUselessObject.map(e => this.renderListItem(e.name, e.description, e.user.nickname, e.image));
        return (
            <div className='flex-container home'>
                <FirstListItem text="username"/>
            	{cards}
            </div>);
    }
}

export default connect(
    (state: ApplicationState) => state.cards,
    CardsStore.actionCreators
)(Home);
