import React, {Component} from "react";
import { useResizeDetector } from 'react-resize-detector';
import { withResizeDetector } from 'react-resize-detector';
import ResizeObserver from 'rc-resize-observer';
import './graph.css'
import Canvas from "./canvas";
import {clicked, drawCanvas} from "../../app/canvas";

class Graph extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        function relMouseCoords(event){
            let totalOffsetX = 0;
            let totalOffsetY = 0;
            let canvasX = 0;
            let canvasY = 0;
            let currentElement = this;

            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
            }
            while(currentElement === currentElement.offsetParent)

            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;

            return {x:canvasX, y:canvasY}
        }
        HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
    }

    render() {
        return (
            <ResizeObserver
                onResize={(dimensions) => {
                    console.log(dimensions.width + " " + dimensions.height);
                    const canvas = document.getElementById("canvas")
                    canvas.width = Math.min(Math.min(dimensions.width, dimensions.height), 350)
                    canvas.height = Math.min(Math.min(dimensions.width, dimensions.height), 350)
                    drawCanvas(canvas)
                }}
            >
            <div ref={this.ref} id={"canvas-wrapper"} className={"canvas-wrapper"}>
                <canvas  id="canvas" width="350" height="350" onClick={(e) => {
                    clicked(e, this.props.submitInfo)
                }}/>
            </div>
            </ResizeObserver>
        )
    }

}

export default Graph;