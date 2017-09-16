import * as React from 'react';
import NavBar from './NavBar';
import { Container } from 'reactstrap';

export class Layout extends React.Component<{}, {}> {
	public render() {
		return <div>
			<NavBar />
			<Container fluid>
                {this.props.children}
            </Container>
        </div>;
	}
}
