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
            formErrors: {
                x: '',
                y: '',
                r: ''
            },
            xValid: true,
            yValid: true,
            rValid: true,
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }

    submit = () => {
        let information = {
            "x": this.props.x_form,
            "y": this.props.y_form,
            "r": this.props.r_form
        };
        if (this.props.validate()) {
            check(information)
                .then(response => {
                    if (response.ok) {
                        response.text().then(text => {
                            this.setState({refreshAttempted: false})
                            store.dispatch({type: "appendCheck", value: JSON.parse(text)})
                            drawPoint(information, document.getElementById("canvas"), this.props.r_form)
                        })
                    } else {
                        this.props.tryToRefresh(this.submit, response)
                    }
                })
        }
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
        let fieldValidationErrors = this.state.formErrors;
        let xValid = this.state.xValid;
        let yValid = this.state.yValid;
        let rValid = this.state.rValid;

        switch (fieldName) {
            case 'X':
                xValid = value != null && !isNaN(value) && value < 3 && value > -3
                fieldValidationErrors.x = xValid ? '' : ' must be in range (-3; 3)';
                this.props.setX(e.target.value)
                break;
            case 'Y':
                yValid = value != null && !isNaN(value) && value < 5 && value > -5
                fieldValidationErrors.y = yValid ? '' : ' must be in range (-5; 5)';
                this.props.setY(e.target.value)
                break;
            case 'R':
                rValid = value != null && !isNaN(value) && value < 3 && value > 0
                fieldValidationErrors.r = rValid ? '' : ' must be in range (0; 3)';
                if (rValid) {
                    this.props.setR(e.target.value)
                    drawCanvas(document.getElementById("canvas"), e.target.value, store.getState().checks)
                } else {
                    this.props.setR(e.target.value)
                    clearCanvas(store.getState().checks, document.getElementById("canvas"), this.props.r_form)
                }
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            xValid: xValid,
            yValid: yValid,
            rValid: rValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.xValid && this.state.yValid && this.state.rValid});
    }

    errorClass(error) {
        return (error.length === 0 ? 'nums-field' : 'has-error');
    }

    errorClassOrNothing(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        return (
            <div className={"coordinates-wrapper"}>
                <div className={"form-wrapper"}>
                    <form id="form">
                        <div className={`form-group ${this.errorClass(this.state.formErrors.x)}`}>
                            <label>X </label>
                            <input type={"text"} name={"X"} value={this.props.x_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter X(-3; 3)"/>
                            <br/>
                        </div>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.y)}`}>
                            <label>Y </label>
                            <input type={"text"} name={"Y"} value={this.props.y_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter Y(-5; 5)"/>
                            <br/>
                        </div>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.r)}`}>
                            <label>R </label>
                            <input type={"text"} name={"R"} value={this.props.r_form} onChange={this.handleUserInput}
                                   maxLength={10} placeholder="Enter R(-3; 3)"/>
                            <br/>
                        </div>
                    </form>
                </div>
                <div
                    className={`button-wrapper ${this.errorClass(this.state.formErrors.r + this.state.formErrors.y + this.state.formErrors.x)}`}>
                    <div className={`button-elem`}>
                        <button type="button" onClick={this.submit}>Submit</button>
                    </div>
                    <div className={"button-elem"}>
                        <button type="button" onClick={this.clear}>Clear</button>
                    </div>
                    <FormErrors formErrors={this.state.formErrors}/>
                </div>
            </div>
        )
    }
}

export default CoordinatesForm