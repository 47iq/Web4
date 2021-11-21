import React, {Component} from "react";
import CoordinatesForm from "./coordinatesForm";
import Table from "./table";
import "../../css/main.css"
import Graph from "./graph";
import {check, getAll, refresh} from "../../api/request";
import Header from "../header";
import {drawCanvas, drawPoint} from "../../app/canvas";
import store from "../../app/store";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            output: React.createRef(),
            x_form: '',
            y_form: '',
            r_form: '',
            refreshAttempted: false
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
        if (store.getState().checks === null) {
            this.getChecks()
        }
    }

    getChecks = () => {
        getAll()
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        store.dispatch({type: "setChecks", value: JSON.parse(text)})
                        console.log(JSON.parse(text))
                        drawCanvas(document.getElementById("canvas"))
                    })
                } else {
                    this.tryToRefresh(this.getChecks, response)
                }
            })
    }

    submit = () => {
        let information = {
            "x": this.state.x_form,
            "y": this.state.y_form,
            "r": this.state.r_form
        };
        this.submitInfo(information)
    }

    submitInfo = (information) => {
        check(information)
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        this.setState({refreshAttempted: false})
                        store.dispatch({type: "appendCheck", value: JSON.parse(text)})
                        drawPoint(information, document.getElementById("canvas"), this.state.r_form)
                    })
                } else {
                    this.tryToRefresh(this.submit, response)
                }
            })
    }

    tryToRefresh = (func, response) => {
        response.text().then(text => {
            if (text === "Expired or invalid JWT token") {
                refresh().then(response => response.json().then(json => {
                    if (response.ok) {
                        sessionStorage.setItem("token", json.accessToken)
                        sessionStorage.setItem("refreshToken", json.refreshToken)
                        func()
                    } else {
                        console.log(`Response: ${response.json()}`)
                        store.dispatch({type: "changeLogin", value: null});
                    }
                }))
            } else {
                //todo
                console.log("Shit happens")
                store.dispatch({type: "changeLogin", value: null});
            }
        })
    }

    checkNumbers = (q, a, b) => {
        return ((q > a) && (q < b));
    }

    validate = () => {
        return (this.checkNumbers(this.state.x_form, -3, 3) && this.checkNumbers(this.state.y_form, -5, 5) && this.checkNumbers(this.state.r_form, -3, 3));
    }

    addToTable = (information) => {

    }

    setX = (x) => this.setState({x_form: x});
    setY = (y) => this.setState({y_form: y});
    setR = (r) => this.setState({r_form: r});

    render() {
        return (
            <div id="main">
                <Header login={true}/>
                <div className={"main-wrapper"}>
                    <Graph r={this.state.r_form} submitInfo={this.submitInfo}/>
                    <CoordinatesForm validate={this.validate} x_form={this.state.x_form} y_form={this.state.y_form}
                                     r_form={this.state.r_form}
                                     getChecks={this.getChecks} setX={this.setX} setY={this.setY}
                                     setR={this.setR} displayError={this.displayError} addToTable={this.addToTable}
                                     tryToRefresh={this.tryToRefresh} submit={this.submit}/>
                </div>
                <Table  coordinateX={"X"} coordinateY={"Y"} radius={"R"} hit={"Hit"} ldt={"Time"}/>
            </div>)
    }


}

export default Main