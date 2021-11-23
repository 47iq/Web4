import {clicked} from "../../app/canvas";
import React, {Component} from "react";

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wrapper: null
        }
    }

    render() {
        return (
            <canvas  id="canvas" width="100%" height="100%" onClick={(e) => {
                clicked(e, this.props.submitInfo)
            }}/>
        )
    }
}

export default Canvas;