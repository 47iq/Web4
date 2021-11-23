import React, {Component} from "react";
import CoordinatesForm from "../organisms/coordinatesForm";
import Table from "../molecules/table";
import "./main.css"
import Graph from "../atoms/graph";
import {check, clear, getAll, refresh} from "../../api/request";
import Header from "../organisms/header";
import {clearCanvas, drawCanvas, drawPoint} from "../../app/canvas";
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
            refreshAttempted: false,
            formErrors: {
                x: '',
                y: '',
                r: '',
                important: ''
            },
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
                this.setError("important", "Can't submit while X is not set!")
            else if (this.state.y_form === '')
                this.setError("important", "Can't submit while Y is not set!")
            else if (this.state.r_form === '')
                this.setError("important", "Can't submit while R is not set!")
            else
                this.setError("important",  "Can't submit while data is invalid!")
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
            this.setError("important",  "Can't submit while R is not set!")
            setTimeout(() => this.setError("important", ''), 3000)
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
                        this.setError("important",json.message);
                        setTimeout(() => {
                            this.setError("important", '')
                            store.dispatch({type: "changeLogin", value: null})
                        }, 3000)
                    }
                }))
            } else {
                this.setError("important", json.message)
                setTimeout(() => this.setError("important", "important"), 3000)
            }
        })
    }

    clear = () => {
        clear().then(response => {
            if(this.mounted)
                if (response.ok) {
                    this.getChecks()
                    this.setState({refreshAttempted: false})
                } else {
                    this.tryToRefresh(this.clear, response)
                }
        })
    }

    changeRState(value) {
        store.dispatch({type: "changeRadius", value: value})
    }

    setX = (x) => this.setState({x_form: x});
    setY = (y) => this.setState({y_form: y});
    setR = (r) => this.setState({r_form: r});
    setFormValid = (formValid) => this.setState({formValid: formValid})
    setError = (name, message) => {
        let form = Object.assign({}, this.state.formErrors);
        form[name] = message;
        this.setState({formErrors: form})
    }

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
                                     tryToRefresh={this.tryToRefresh} submit={this.submit} clear={this.clear}
                                     addError={this.setError} formErrors={this.state.formErrors} changeRState={this.changeRState}
                    />
                </div>
                <Table coordinateX={"X"} coordinateY={"Y"} radius={"R"} hit={"Hit"} ldt={"Time"} checks={store.getState().checks}/>
            </div>)
    }


}

export default Main