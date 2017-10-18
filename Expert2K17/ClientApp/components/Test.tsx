import * as React from 'react';
import * as Spinner from 'react-spinkit';
import Slider from 'react-slick';
import { Redirect, RouteComponentProps } from 'react-router-dom';

export default class Test extends React.Component<{}, {}> {
    render() {
        return (
            <div className="test">
                <SimpleSlider />
            </div>);
    }
}

class SimpleSlider extends React.Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <Slider {...settings}>
                <div style={{'with': '300px', 'height': '300px', 'background-color': 'white'}}><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
                <div><h3>5</h3></div>
                <div><h3>6</h3></div>
            </Slider>
        );
    }
}

// export default connect(
//     (state: ApplicationState) => ({...state.login, ...state.user}),
//     LoginStore.actionCreators
// )(Login);