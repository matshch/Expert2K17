import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './index.css';
import '../../css/hover-min.css';

const hexagramg = require('./hexagramg.jpg');
const matshch = require('./matshch.jpg');
const maxavatar = require('./maxavatar.png');

type AboutProps = RouteComponentProps<{}>;

export default class About extends React.Component<AboutProps, {}> {
    render() {
        return <div className="aboutContainer">
            <div className="aboutSubcontainer">
                <div className="about">
                    <div>
                        <div className="card hvr-wobble-vertical">
                            <img src={matshch} />
                            <div className="content">
                                <h1>Лещев А.О.</h1>
                                <div className="social">
                                    <a href="https://github.com/matshch" target="_blank"><i className="fa fa-github px-3" aria-hidden="true"></i></a>
                                    <a href="https://t.me/matshch" target="_blank"><i className="fa fa-telegram px-3" aria-hidden="true"></i></a>
                                    <a href="https://vk.com/gwerewolf" target="_blank"><i className="fa fa-vk px-3" aria-hidden="true"></i></a>
                                    <a href="mailto:matshch@gmail.com" target="_blank"><i className="fa fa-envelope px-3" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <div className="card hvr-bounce-in">
                            <img src={maxavatar} />
                            <div className="content">
                                <h1>Лясковский М.А.</h1>
                                <div className="social">
                                    <a href="https://github.com/MaxAvatar007" target="_blank"><i className="fa fa-github px-3" aria-hidden="true"></i></a>
                                    <a href="https://t.me/maxavatar" target="_blank"><i className="fa fa-telegram px-3" aria-hidden="true"></i></a>
                                    <a href="https://vk.com/MaxAvatar" target="_blank"><i className="fa fa-vk px-3" aria-hidden="true"></i></a>
                                    <a href="mailto:maxavatar007@gmail.com" target="_blank"><i className="fa fa-envelope px-3" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <div className="card hvr-buzz-out">
                            <img src={hexagramg} />
                            <div className="content">
                                <h1>Мельников К.И.</h1>
                                <div className="social">
                                    <a href="https://github.com/hexagramg" target="_blank"><i className="fa fa-github px-3" aria-hidden="true"></i></a>
                                    <a href="https://t.me/Gittorian" target="_blank"><i className="fa fa-telegram px-3" aria-hidden="true"></i></a>
                                    <a href="https://vk.com/qqredbit" target="_blank"><i className="fa fa-vk px-3" aria-hidden="true"></i></a>
                                    <a href="mailto:hexagramg@gmail.com" target="_blank"><i className="fa fa-envelope px-3" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
