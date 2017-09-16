import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ListItem from './ListItem';
import '../css/flex.css';
import '../css/cards.css';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	renderListItem(t: string, st: string, tx: string) {
		return <ListItem title={t} subtitle={st} text={tx} />;
	}

	render() {
		return (
			<div className='container-fluid'>
				<div className='flex-container'>
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
					{this.renderListItem("Какую аниму глянуть?", "Данная великолепная система унесёт вас в великолепный мир аниме! ", "MaxAvatar")}
				</div>
			</div>);
	}
}
