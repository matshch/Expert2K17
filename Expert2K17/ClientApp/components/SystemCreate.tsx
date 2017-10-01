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
export class TestEditorSystem extends React.Component<TestEditSystemT, {}>{
    constructor() {
        super();
    }

    nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncSystem({
            ...this.props.system,
            name: e.target.value
        });
    }
    tldrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncSystem({
            ...this.props.system,
            about: e.target.value
        });
    }
    pictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
    }
    pubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.syncSystem({
            ...this.props.system,
            pub: e.target.checked
        });
    }
    render() {
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="text" lg={3}>Название</Label>
                        <Col lg={9}>
                            <Input type="text" name="text" value={this.props.system.name} onChange={this.nameChange} id="text" placeholder="Название теста"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" lg={3}>О системе</Label>
                        <Col lg={9}>
                            <Input type="textarea" value={this.props.system.about} onChange={this.tldrChange} id="description" placeholder="Описаение"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="imge" lg={3}>Картинка</Label>
                        <Col lg={9}>
                            <img className="img-fluid" src={this.props.system.picture} ></img>
                            <Input type="file" name="file" onChange={this.pictureChange} id="imge"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="chb1" lg={3}>Публичный доступ</Label>
                        <Col lg={9}>
                            <Input type="checkbox" checked={this.props.system.pub} onChange={this.pubChange} id="chb1" />
                        </Col>
                    </FormGroup>
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
type TestEditSystemT = typeof Store.actionCreators
    &
    Interf.KSystem;
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

    saveTest = () => {
        let formData = new FormData();
        if (this.state.name != '') {
            if (this.state.picture != null) {
                formData.append('picture', this.state.picture[0]);
            }

            formData.append('name', this.state.name);
            formData.append('about', this.state.tldr);
        }
        this.props.addSystem(formData);
    }

    render() {
        if (this.props.guid != '') {
            return <Redirect to={"/ EditTest /" + this.props.guid + "/ CreateSystem"} />
        }
        return <Card className="createSideBar">
            <CardBlock>
                <Form>
                    <FormGroup row>
                        <Label for="text" lg={3}>Название</Label>
                        <Col lg={9}>
                            <Input type="text" onChange={this.nameChange} name="text" id="text" placeholder="Название теста"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="description" lg={3}>О системе</Label>
                        <Col lg={9}>
                            <Input type="textarea" onChange={this.tldrChange} id="description" placeholder="Описание"></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="imge" lg={3}>Картинка</Label>
                        <Col lg={9}>
                            <Input type="file" onChange={this.pictureChange} name="file" id="imge"></Input>
                        </Col>
                    </FormGroup>                   
                    <Row>
                        <Col lg={3} />
                        <Col lg={9}>
                            <Button color="success" onClick={this.saveTest} className="pull-left">Создать тест</Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlock>
        </Card>
    }
}



export let ConnectedTestSystemCreater = connect((store: ApplicationState) => store.combinedSystem.system, Store.actionCreators)(TestCreaterSystem);
export let ConnectedTestSystemEditor = connect((store: ApplicationState) => { return { system: store.combinedSystem.system} }, Store.actionCreators)(TestEditorSystem);

