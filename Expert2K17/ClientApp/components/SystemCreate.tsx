// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Store from '../store/System';
import { NavLink, Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Row, Container, Col, Button, Form, FormGroup, Label, Input, FormText, Media, Card, CardBlock, CardTitle, CardText, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap'
import DocumentTitle from 'react-document-title';
import * as Interf from '../store/TestInterfaces';
export class TestEditorSystem extends React.Component<TestCreaterSystemT, CreatorSystem>{
    constructor() {
        super();
        this.state = {
            name: this.props.name,
            picture: null,
            tldr: this.props.about,
            pub: this.props.pub
        }
    }

    nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }
    tldrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            tldr: e.target.value
        })
    }
    pictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            picture: e.target.files
        })
    }
    saveTest = () => {
        let formData = new FormData();
        if (this.state.name != '') {
            if (this.state.picture != null) {
                formData.append('picture', this.state.picture[0]);
            }

            formData.append('name', this.state.name);
            formData.append('about', this.state.tldr);
            formData.append('guid', this.props.guid);
        }
        this.props.addSystem(formData);
    }

    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="text" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" name="text" value={this.state.name} onChange={this.nameChange} id="text" placeholder="Название теста"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" sm={3}>О системе</Label>
                        <Col sm={9}>
                            <Input type="textarea" value={this.state.tldr} onChange={this.tldrChange} id="description" placeholder="Описаение"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="imge" sm={3}>Картинка</Label>
                        <Col sm={9}>
                            <img className="img-fluid" src={this.props.picture} ></img>
                            <Input type="file" name="file" onChange={this.pictureChange} id="imge"></Input>
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col sm={3} />
                        <Col sm={9}>
                            <Button color="success" onClick={this.saveTest} className="pull-left">Сохранить изменения</Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlock>
        </Card>
    }
}

interface CreatorSystem {
    name: string;
    picture: FileList | null;
    tldr: string;
    pub: boolean;
}

type TestCreaterSystemT = typeof Store.actionCreators
    &
    Interf.System;

export class TestCreaterSystem extends React.Component<TestCreaterSystemT, CreatorSystem>{
    constructor() {
        super();
        this.state = {
            name: '',
            picture: null,
            tldr: '',
            pub: false
        }

    }

    nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            name: e.target.value
        });
    }
    tldrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            tldr: e.target.value
        })
    }
    pictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            picture: e.target.files
        })
    }
    pubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            pub: e.target.checked
        })
    }

    saveTest = () => {
        let formData = new FormData();
        if (this.state.name != '') {
            if (this.state.picture != null) {
                formData.append('picture', this.state.picture[0]);
            }

            formData.append('name', this.state.name);
            formData.append('about', this.state.tldr);
            formData.append('pub', (this.state.pub == true ? 'true' : 'false'));
        }
        this.props.syncSystem(formData);
    }

    render() {
        if (this.props.guid != '') {
            return <Redirect to={"/ EditTest /" + this.props.guid + "/ CreateSystem"} />
        }
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="text" sm={3}>Название</Label>
                        <Col sm={9}>
                            <Input type="text" onChange={this.nameChange} name="text" id="text" placeholder="Название теста"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" sm={3}>О системе</Label>
                        <Col sm={9}>
                            <Input type="textarea" onChange={this.tldrChange} id="description" placeholder="Описание"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="imge" sm={3}>Картинка</Label>
                        <Col sm={9}>
                            <Input type="file" onChange={this.pictureChange} name="file" id="imge"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" sm={3}>Публичный доступ</Label>
                        <Col sm={9}>
                            <Input type="checkbox" onChange={this.pubChange} id="chb1" />
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col sm={3} />
                        <Col sm={9}>
                            <Button color="success" onClick={this.saveTest} className="pull-left">Создать</Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlock>
        </Card>
    }
}



export let ConnectedTestSystemCreater = connect((store: ApplicationState) => store.system, Store.actionCreators)(TestCreaterSystem);
export let ConnectedTestSystemEditor = connect((store: ApplicationState) => store.system, Store.actionCreators)(TestEditorSystem);

