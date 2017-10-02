import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';

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
                        <CardImg top width="300px" src={this.props.image}/>
                        <CardBlock>
                            <CardTitle>{this.props.title}</CardTitle>
                            <CardSubtitle>{this.props.subtitle}</CardSubtitle>
                            <CardText>{this.props.text}</CardText>
                        </CardBlock>
                    </Card>
                </Link>
            </div>
        );
    }
}

export class FirstListItem extends React.Component<{text: string}, {}> {
    public render() {
        return (
            <div className='flex-item createTest'>
                <Link to={'/CreateTest'}>
                    <Card>
                        <div className="card-img-top"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                        <CardBlock>
                            <CardTitle>Создать свой тест</CardTitle>
                            <CardSubtitle>Нажмите на эту карточку, если вы хотите создать тест.</CardSubtitle>
                            <CardText>{this.props.text}</CardText>
                        </CardBlock>
                    </Card>
                </Link>
            </div>
        );
    }
}