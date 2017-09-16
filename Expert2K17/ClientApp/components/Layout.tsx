import * as React from 'react';
import { Container } from 'reactstrap';
import Navbar from './NavBar';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return <div>
            <Navbar />
            <Container fluid>
                {this.props.children}
            </Container>
        </div>;
    }
}
