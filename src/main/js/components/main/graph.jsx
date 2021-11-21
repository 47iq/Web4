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
        //todo
        /* console.log(this.props.checks)
         drawCanvas(this.state.canvas.current, this.props.r, this.props.checks)
         width={350} height={350} */
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }


    render() {
        return (
            <div className={"canvas-wrapper"}>
                <canvas width={350} height={350} id="canvas" ref={this.state.canvas} onClick={(e) => {
                    clicked(e, this.props.r, store.getState().checks)
                }}/>
            </div>
        )
    }

}

export default Graph;