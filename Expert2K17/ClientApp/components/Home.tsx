import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ListItem from './ListItem';
import '../css/flex.css';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	renderListItem(t: string, st: string, tx: string) {
		return <ListItem title={t} subtitle={st} text={tx} />;
	}

	render() {
		return (
			<div className='container-fluid'>
				<div className='flex-container'>
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
					{this.renderListItem("azaz", "meda", "123")}
				</div>
			</div>);
	}
}
