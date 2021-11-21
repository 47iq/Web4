import React, {Component} from "react";
import {clicked} from "../../app/canvas";
import store from "../../app/store";

class Graph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canvas: React.createRef()
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }


    render() {
        return (
            <div className={"canvas-wrapper"}>
                <canvas width={350} height={350} id="canvas" ref={this.state.canvas} onClick={(e) => {
                    clicked(e, this.props.submitInfo)
                }}/>
            </div>
        )
    }

}

export default Graph;