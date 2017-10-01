import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ProfileStore from '../store/Profile';
import * as Spinner from 'react-spinkit';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { ButtonGroup, Label, ListGroup, ListGroupItem, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import DocumentTitle from 'react-document-title';
import * as UserStore from '../store/User';

type ProfileProps =
    ProfileStore.ProfileState
    & typeof ProfileStore.actionCreators
    & UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{}>;

export class Profile extends React.Component<ProfileProps, { showPictureButtons: boolean }> {
    constructor() {
        super();
        this.state = { showPictureButtons: false }
    }
    componentWillMount() {
        this.props.GetTestsList();
        this.props.GetUser();
    }

    coverPictureChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let formData = new FormData();
        formData.append('picture', e.target.files[0]);
        this.props.SetCover(formData);
    }

    profilePictureChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let formData = new FormData();
        formData.append('picture', e.target.files[0]);
        this.props.SetUserpic(formData)
    }

    SubmitUserpic = () => {
        this.file1.click()
    }

    SubmitCover = () => {
        this.file2.click()
    }

    private file1 : HTMLInputElement;
    private file2 : HTMLInputElement;

    render() {
        if (this.props.user === null)
            return <Redirect to="/login" />
        if (this.props.user === undefined || (this.props.ResponseObject.length === 0 && this.props.loading))
            return <Spinner name="ball-scale-multiple" />
        return (
            <DocumentTitle title='Профиль'>
                <div className='flex-container'>
                    <Card className="profile">
                        <img onMouseEnter={() => this.setState({ showPictureButtons: true })} onMouseLeave={() => this.setState({ showPictureButtons: false })} className="profileCover card-img" src={this.props.user.cover} />
                        <img onMouseEnter={() => this.setState({ showPictureButtons: true })} onMouseLeave={() => this.setState({ showPictureButtons: false })} className="profileImage" width="250px" height="250px" src={this.props.user.userpic} />
                        {(() => {
                            if (this.state.showPictureButtons === true) {
                                return (
                                    <ButtonGroup className="profileEditButtons">
                                        <Button onMouseEnter={() => this.setState({ showPictureButtons: true })} onClick={this.SubmitCover}>сменить обложку</Button>{' '}
                                        <Button onMouseEnter={() => this.setState({ showPictureButtons: true })} onClick={this.SubmitUserpic}>сменить фото профиля</Button>
                                    </ButtonGroup>
                                )
                            }
                        })()}
                        <CardBlock>
                            <CardTitle>{this.props.user.userName}</CardTitle>
                            <CardSubtitle><h4>{this.props.user.surname} {this.props.user.name} {this.props.user.patronymic}</h4><p>{this.props.user.group} {this.props.user.year}</p></CardSubtitle>
                            <h5>Список созданных тестов:</h5>
                            <ListGroup>
                                {/* {this.props.ResponseObject.map((e: any) => <ListGroupItem>{e["name"]}</ListGroupItem>)} */}
                                <ListGroupItem>Какую аниму глянуть?</ListGroupItem>
                                <ListGroupItem>Какие обои выбрать?</ListGroupItem>
                                <ListGroupItem>Какую вайфу выбрать?</ListGroupItem>
                            </ListGroup>
                        </CardBlock>
                        <input ref={(input)=>this.file1=input} onChange={this.profilePictureChanged} type="file" />
                        <input ref={(input)=>this.file2=input} onChange={this.coverPictureChanged} type="file" />
                    </Card>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.profile, ...state.user }),
    { ...ProfileStore.actionCreators, ...UserStore.actionCreators }
)(Profile);