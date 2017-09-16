import * as React from 'react';
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';

export interface ListItemProps {
	title: string;
	subtitle: string;
	text: string;
}

export default class ListItem extends React.Component<ListItemProps, {}> {
	public render() {
		return (
			<div>
				<Card className='flex-item'>
					<CardImg top width="100%" src="https://i.imgur.com/Ly4uhTA.png" alt="Card image cap" />
					<CardBlock>
						<CardTitle>{this.props.title}</CardTitle>
						<CardSubtitle>{this.props.subtitle}</CardSubtitle>
						<CardText>{this.props.text}</CardText>
						<Button>Button</Button>
					</CardBlock>
				</Card>
			</div>
		);
	}
}