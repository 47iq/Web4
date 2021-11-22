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
        this.mounted = true;
        store.subscribe(() => {
            if(this.mounted)
                this.setState({reduxState: store.getState()});
        })
        function relMouseCoords(event){
            let totalOffsetX = 0;
            let totalOffsetY = 0;
            let canvasX = 0;
            let canvasY = 0;
            let currentElement = this;

            do{
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

    componentWillUnmount(){
        this.mounted = false;
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