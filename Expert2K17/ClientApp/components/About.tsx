import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

type AboutProps = RouteComponentProps<{}>;

export default class About extends React.Component<AboutProps, {}> {
    render() {
        return <div className="aboutContainer">
            <div className="aboutSubcontainer">
                <div className="about">
                    <div>
                        <div className="card">
                            <img src="https://avatars2.githubusercontent.com/u/2412121?s=460&amp;v=4" />
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
                    <div>
                        <div className="card">
                            <img src="https://avatars2.githubusercontent.com/u/8061587?s=460&amp;v=4" />
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
                    <div>
                        <div className="card">
                            <img src="https://avatars2.githubusercontent.com/u/11045290?s=460&amp;v=4" />
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
