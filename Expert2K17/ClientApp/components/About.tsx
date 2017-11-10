import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

type AboutProps = RouteComponentProps<{}>;

export default class About extends React.Component<AboutProps, {}> {
    render() {
    	return <div>test</div>;
    }
}