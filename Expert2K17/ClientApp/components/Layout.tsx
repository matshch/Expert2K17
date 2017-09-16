import * as React from 'react';
import NavBar from './NavBar';

export class Layout extends React.Component<{}, {}> {
	public render() {
		return <div>
			<NavBar />
			<div className='container-fluid'>
				{this.props.children}
			</div>
		</div>;
	}
}
