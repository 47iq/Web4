import React, {Component, useEffect, useRef} from "react";
import {drawCanvas, clicked} from "../../app/canvas";

class Graph extends Component{

    constructor(props) {
        super(props);
        this.state = {
            canvas: React.createRef()
        }
    }

    componentDidMount() {
        //todo
       /* console.log(this.props.checks)
        drawCanvas(this.state.canvas.current, this.props.r, this.props.checks)*/
    }


    render() {
    return (
        <div className={"canvas-wrapper"}>
            <canvas width={350} height={350} id="canvas" ref={this.state.canvas} onClick={(e) => {
                clicked(e, this.props.r, this.props.setChecks, this.props.checks)
            }}/>
        </div>
    )
}

}

export default Graph;