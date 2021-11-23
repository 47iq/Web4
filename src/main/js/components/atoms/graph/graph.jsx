import React, {Component} from "react";
import ResizeObserver from 'rc-resize-observer';
import './graph.css'
import {clicked, drawCanvas} from "../../../app/canvas";

class Graph extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        function relMouseCoords(event) {
            let totalOffsetX = 0;
            let totalOffsetY = 0;
            let canvasX = 0;
            let canvasY = 0;
            let currentElement = this;

            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
            }
            while (currentElement === currentElement.offsetParent)

            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;

            return {x: canvasX, y: canvasY}
        }

        HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
    }

    render() {
        const MAX_DIMENSION = 350
        return (
            <ResizeObserver
                onResize={(dimensions) => {
                    const canvas = document.getElementById("canvas")
                    const screenW = window.innerWidth
                    if (screenW > MAX_DIMENSION * 3) {
                        canvas.width = Math.min(Math.min(dimensions.width, dimensions.height), screenW / 3)
                        canvas.height = Math.min(Math.min(dimensions.width, dimensions.height), screenW / 3)
                    } else {
                        canvas.width = Math.min(Math.min(dimensions.width, dimensions.height), MAX_DIMENSION)
                        canvas.height = Math.min(Math.min(dimensions.width, dimensions.height), MAX_DIMENSION)
                    }
                    drawCanvas(canvas)
                }}
            >
                <div ref={this.ref} id={"canvas-wrapper"} className={"canvas-wrapper"}>
                    <canvas id="canvas" width={window.innerWidth > 1150 ? (window.innerWidth / 3) : 350}
                            height={window.innerWidth > 1150 ? (window.innerWidth / 3) : 350}
                            onClick={(e) => {
                                clicked(e, this.props.submitInfo)
                            }}/>
                </div>
            </ResizeObserver>
        )
    }

}

export default Graph;