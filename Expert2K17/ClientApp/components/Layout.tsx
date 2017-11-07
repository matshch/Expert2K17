import * as React from 'react';
import { Container } from 'reactstrap';
import Navbar from './NavBar';
import DocumentTitle from 'react-document-title';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return <DocumentTitle title='ЭЗ ПЕЗ'>
            <div>
                <div id="background"></div>
                <Navbar />
                <Container fluid>
                    {this.props.children}
                </Container>
            </div>
        </DocumentTitle>;
    }
}
