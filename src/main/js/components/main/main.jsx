import React, {Component} from "react";
import CoordinatesForm from "./coordinatesForm";
import Table from "./table";
import "../../css/main.css"
import Graph from "./graph";
import {getAll, refresh} from "../../api/request";
import Header from "../header";
import storage from "../../app/storage";
import {drawCanvas} from "../../app/canvas";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            output: React.createRef(),
            x_form: '',
            y_form: '',
            r_form: '',
            checks: null,
            refreshAttempted: false
        }
    }

    componentDidMount() {
        if (this.state.checks === null) {
            this.getChecks()
        }
    }

    getChecks = () => {
        getAll()
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        console.log(JSON.parse(text));
                        this.setChecks(JSON.parse(text))
                        drawCanvas(document.getElementById("canvas"), this.state.r_form, this.state.checks)
                    })
                } else {
                    this.tryToRefresh(this.getChecks, response)
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
                        storage.dispatch({type: "changeLogin", value: null});
                    }
                }))
            } else {
                //todo
                console.log("Shit happens")
                storage.dispatch({type: "changeLogin", value: null});
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
    setChecks = (checks) => this.setState({checks: checks});

    render() {
        return (

            <div id="main">
                <Header login={true}/>
                <div className={"main-wrapper"}>
                    <Graph r={this.state.r_form} setChecks={this.setChecks} checks={this.state.checks}/>
                    <CoordinatesForm validate={this.validate} x_form={this.state.x_form} y_form={this.state.y_form}
                                     r_form={this.state.r_form}
                                     setX={this.setX} setY={this.setY}
                                     setR={this.setR} setChecks={this.setChecks} checks={this.state.checks}
                                     displayError={this.displayError} addToTable={this.addToTable}
                                     tryToRefresh={this.tryToRefresh} getChecks={this.getChecks}
                                     refreshAttempted={this.state.refreshAttempted}/>
                </div>
                <Table checks={this.state.checks}/>
            </div>)
    }


}

export default Main