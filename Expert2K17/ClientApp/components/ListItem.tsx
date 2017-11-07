import * as React from 'react';
import { UserObject } from '../store/User';
import { NavLink, Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

export interface ListItemProps {
    id: string;
    title: string;
    subtitle: string;
    text: string;
    image: string;
}

export default class ListItem extends React.Component<ListItemProps, {}> {
    public render() {
        return (
            <div className='flex-item'>
                <Link to={"/test/" + this.props.id}>
                    <Card>
                        <CardImg top width="300px" src={this.props.image} />
                        <CardBody>
                            <CardTitle>{this.props.title}</CardTitle>
                            <CardSubtitle>{this.props.subtitle}</CardSubtitle>
                            <CardText>{this.props.text}</CardText>
                        </CardBody>
                    </Card>
                </Link>
            </div>
        );
    }
}

export class FirstListItem extends React.Component<{ user: UserObject }, {}> {
    public render() {
        if (this.props.user === null || this.props.user === undefined) {
            return (
                <div className='flex-item createTest'>
                    <Link to={'/login'}>
                        <Card>
                            <div className="card-img-top"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                            <CardBody>
                                <CardTitle>Создать свой тест</CardTitle>
                                <CardSubtitle>Войдите, чтобы создать свой тест.</CardSubtitle>
                                <CardText>username</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </div>
            );
        }
        return (
            <div className='flex-item createTest'>
                <Link to={'/CreateTest'}>
                    <Card>
                        <div className="card-img-top"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                        <CardBody>
                            <CardTitle>Создать свой тест</CardTitle>
                            <CardSubtitle>Нажмите на эту карточку, если вы хотите создать тест.</CardSubtitle>
                            <CardText>{this.props.user.userName}</CardText>
                        </CardBody>
                    </Card>
                </Link>
            </div>
        );
    }
}