import React, {Component} from "react";
import {clearCanvas, drawCanvas, drawPoint} from "../../app/canvas";
import FormErrors from "../errors";
import '../../css/coordForm.css'
import {check, clear} from "../../api/request";
import store from "../../app/store";

class CoordinatesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xValid: false,
            yValid: false,
            rValid: false,
        }
    }

    componentDidMount() {
        console.log(store.getState())
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }

    clear = () => {
        clear().then(response => {
            if (response.ok) {
                this.props.getChecks()
                this.setState({refreshAttempted: false})
            } else {
                this.props.tryToRefresh(this.clear, response)
            }
        })
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.validateField(name, value, e);
    }

    validateField(fieldName, value, e) {
        let xValid = this.state.xValid;
        let yValid = this.state.yValid;
        let rValid = this.state.rValid;

        switch (fieldName) {
            case 'X':
                xValid = value != null && value !== '' && !isNaN(value) && value < 3 && value > -3
                store.dispatch({type: "addError", value: {name: "x", value: xValid ? '' : ' must be in range (-3; 3)'}});
                this.props.setX(e.target.value)
                break;
            case 'Y':
                yValid = value != null && value !== '' && !isNaN(value) && value < 5 && value > -5
                store.dispatch({type: "addError", value: {name: "y", value: yValid ? '' : ' must be in range (-5; 5)'}});
                this.props.setY(e.target.value)
                break;
            case 'R':
                rValid = value != null && value !== '' && !isNaN(value) && value < 3 && value > 0
                store.dispatch({type: "addError", value: {name: "r", value: rValid ? '' : ' must be in range (0; 3)'}});
                if (rValid) {
                    this.props.setR(e.target.value)
                    store.dispatch({type: "changeRadius", value: e.target.value})
                    drawCanvas(document.getElementById("canvas"))
                } else {
                    this.props.setR(e.target.value)
                    store.dispatch({type: "changeRadius", value: null})
                    clearCanvas(document.getElementById("canvas"))
                }
                break;
            default:
                break;
        }
        this.setState({
            xValid: xValid,
            yValid: yValid,
            rValid: rValid
        })
        this.validateForm(xValid, yValid, rValid)
        console.log(this.state.xValid + " " + this.state.yValid  + " " +  this.state.rValid)
        console.log(this.props.formValid)
    }

    validateForm(xValid, yValid, rValid) {
        this.props.setFormValid(xValid && yValid && rValid);
    }

    errorClass(error) {
        return (error.length === 0 ? 'nums-field' : 'has-error');
    }

    render() {
        return (
            <div className={"coordinates-wrapper"}>
                <div className={"form-wrapper"}>
                    <form id="form">
                        <div className={`form-group ${this.errorClass(store.getState().formErrors.x)}`}>
                            <label>X </label>
                            <input type={"text"} name={"X"} value={this.props.x_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter X(-3; 3)"/>
                            <br/>
                        </div>
                        <div className={`form-group ${this.errorClass(store.getState().formErrors.y)}`}>
                            <label>Y </label>
                            <input type={"text"} name={"Y"} value={this.props.y_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter Y(-5; 5)"/>
                            <br/>
                        </div>
                        <div className={`form-group ${this.errorClass(store.getState().formErrors.r)}`}>
                            <label>R </label>
                            <input type={"text"} name={"R"} value={this.props.r_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter R(-3; 3)"/>
                            <br/>
                        </div>
                    </form>
                </div>
                <div
                    className={`button-wrapper ${this.errorClass(store.getState().formErrors.r + store.getState().formErrors.y + store.getState().formErrors.x)}`}>
                    <div className={`button-elem`}>
                        <button type="button" onClick={this.props.submit}>Submit</button>
                    </div>
                    <div className={"button-elem"}>
                        <button type="button" onClick={this.clear}>Clear</button>
                    </div>
                    <FormErrors/>
                </div>
            </div>
        )
    }
}

export default CoordinatesForm