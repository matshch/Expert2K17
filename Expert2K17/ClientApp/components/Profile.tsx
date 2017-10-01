import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ProfileStore from '../store/Profile';
import * as Spinner from 'react-spinkit';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Label, ListGroup, ListGroupItem, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import DocumentTitle from 'react-document-title';
import * as UserStore from '../store/User';

type ProfileProps =
    ProfileStore.ProfileState
    & typeof ProfileStore.actionCreators
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{}>;

export class Profile extends React.Component<ProfileProps, {}> {
    componentWillMount() {
        this.props.GetTestsList();
        this.props.GetUser();
    }

    render() {
        if (this.props.user === null)
            return <Redirect to="/login"/>
        if (this.props.user === undefined || (this.props.ResponseObject.length === 0 && this.props.loading))
            return <Spinner name="ball-scale-multiple"/>
        return (
            <DocumentTitle title='Профиль'>
                <div className='flex-container'>
                    <Card className="profile">
                        <CardImg className="profileCover" src={this.props.user.cover} />
                        <CardImg className="profileImage" width="250px" height="250px" src={this.props.user.userpic} />
                        <CardBlock>
                            <CardTitle>{this.props.user.userName}</CardTitle>
                            <CardSubtitle><h4>{this.props.user.surname} {this.props.user.name} {this.props.user.patronymic}</h4><p>{this.props.user.group} {this.props.user.year}</p></CardSubtitle>
                            <h5>Список созданных тестов:</h5>
                            <ListGroup>
                                {this.props.ResponseObject.map((e: any) => <ListGroupItem>{e["name"]}</ListGroupItem>)}
                                <ListGroupItem>Какую аниму глянуть?</ListGroupItem>
                                <ListGroupItem>Какие обои выбрать?</ListGroupItem>
                                <ListGroupItem>Какую вайфу выбрать?</ListGroupItem>
                            </ListGroup>
                        </CardBlock>
                    </Card>
                </div>
            </DocumentTitle>);
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.profile, ...state.user }),
    {...ProfileStore.actionCreators, ...UserStore.actionCreators}
)(Profile);