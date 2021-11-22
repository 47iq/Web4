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
            formValid: false,
            refreshAttempted: false
        }
    }

    componentDidMount() {
        this.mounted = true;
        store.subscribe(() => {
            if (this.mounted)
                this.setState({reduxState: store.getState()});
        })
        if (store.getState().checks === null) {
            this.getChecks()
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getChecks = () => {
        getAll()
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        store.dispatch({type: "setChecks", value: JSON.parse(text)})
                        drawCanvas(document.getElementById("canvas"))
                    })
                } else {
                    this.tryToRefresh(this.getChecks, response)
                }
            })
    }

    submit = () => {
        if (!this.state.formValid) {
            if (this.state.x_form === '')
                store.dispatch({
                    type: "addError",
                    value: {name: "important", value: "Can't submit while X is not set!"}
                });
            else if (this.state.y_form === '')
                store.dispatch({
                    type: "addError",
                    value: {name: "important", value: "Can't submit while Y is not set!"}
                });
            else if (this.state.r_form === '')
                store.dispatch({
                    type: "addError",
                    value: {name: "important", value: "Can't submit while R is not set!"}
                });
            else
                store.dispatch({
                    type: "addError",
                    value: {name: "important", value: "Can't submit while data is invalid!"}
                });
            setTimeout(() => store.dispatch({type: "removeError", value: "important"}), 3000)
        } else {
            let information = {
                "x": this.state.x_form,
                "y": this.state.y_form,
                "r": this.state.r_form
            };
            this.submitInfo(information)
        }
    }

    submitInfo = (information) => {
        if (this.state.r_form === '') {
            store.dispatch({type: "addError", value: {name: "important", value: "Can't submit while R is not set!"}});
            setTimeout(() => store.dispatch({type: "removeError", value: "important"}), 3000)
        } else
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
        response.json().then(json => {
            if (json.message === "Expired or invalid JWT token") {
                refresh().then(response => response.json().then(json => {
                    if (response.ok) {
                        sessionStorage.setItem("token", json.accessToken)
                        sessionStorage.setItem("refreshToken", json.refreshToken)
                        func()
                    } else {
                        store.dispatch({type: "addError", value: {name: "important", value: json.message}});
                        setTimeout(() => {
                            store.dispatch({type: "removeError", value: "important"})
                            store.dispatch({type: "changeLogin", value: null})
                        }, 3000)
                    }
                }))
            } else {
                store.dispatch({type: "addError", value: {name: "important", value: json.message}});
                setTimeout(() => store.dispatch({type: "removeError", value: "important"}), 3000)
            }
        })
    }

    checkNumbers = (q, a, b) => {
        return ((q > a) && (q < b));
    }

    validate = () => {
        return (this.checkNumbers(this.state.x_form, -3, 3) && this.checkNumbers(this.state.y_form, -5, 5) && this.checkNumbers(this.state.r_form, -3, 3));
    }

    setX = (x) => this.setState({x_form: x});
    setY = (y) => this.setState({y_form: y});
    setR = (r) => this.setState({r_form: r});
    setFormValid = (formValid) => this.setState({formValid: formValid})

    render() {
        return (
            <div id="main">
                <Header login={true}/>
                <div className={"main-wrapper"}>
                    <Graph r={this.state.r_form} submitInfo={this.submitInfo}/>
                    <CoordinatesForm validate={this.validate} x_form={this.state.x_form} y_form={this.state.y_form}
                                     r_form={this.state.r_form} formValid={this.state.formValid}
                                     getChecks={this.getChecks} setX={this.setX} setY={this.setY}
                                     setR={this.setR} displayError={this.displayError} setFormValid={this.setFormValid}
                                     tryToRefresh={this.tryToRefresh} submit={this.submit}/>
                </div>
                <Table coordinateX={"X"} coordinateY={"Y"} radius={"R"} hit={"Hit"} ldt={"Time"}/>
            </div>)
    }


}

export default Main