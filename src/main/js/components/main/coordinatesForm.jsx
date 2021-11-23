import React, {Component} from "react";
import {clearCanvas, drawCanvas} from "../../app/canvas";
import FormErrors from "../../molecules/errors";
import '../../css/coordForm.css'
import {clear} from "../../api/request";
import CoordinateInput from "../../atoms/coordinateInput";

class CoordinatesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xValid: false,
            yValid: false,
            rValid: false,
        }
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
                this.props.addError("x", xValid ? '' : ' must be in range (-3; 3)')
                this.props.setX(e.target.value)
                break;
            case 'Y':
                yValid = value != null && value !== '' && !isNaN(value) && value < 5 && value > -5
                this.props.addError("y", yValid ? '' : ' must be in range (-5; 5)')
                this.props.setY(e.target.value)
                break;
            case 'R':
                rValid = value != null && value !== '' && !isNaN(value) && value < 3 && value > 0
                this.props.addError("r", rValid ? '' : ' must be in range (0; 3)')
                if (rValid) {
                    this.props.setR(e.target.value)
                    this.props.changeRState(e.target.value)
                    drawCanvas(document.getElementById("canvas"))
                } else {
                    this.props.setR(e.target.value)
                    this.props.changeRState(null)
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
                        <CoordinateInput name={"X"} errorClass={this.errorClass} formErrors={this.props.formErrors}
                                         form={this.props.x_form} placeholder={"Enter X (-3; 3):"} handleUserInput={this.handleUserInput}
                                         errorElement={this.props.formErrors.x}/>
                        <CoordinateInput name={"Y"} errorClass={this.errorClass} formErrors={this.props.formErrors}
                                         form={this.props.y_form} placeholder={"Enter Y (-5; 5):"} handleUserInput={this.handleUserInput}
                                         errorElement={this.props.formErrors.y}/>
                        <CoordinateInput name={"R"} errorClass={this.errorClass} formErrors={this.props.formErrors}
                                         form={this.props.r_form} placeholder={"Enter R (0; 3):"} handleUserInput={this.handleUserInput}
                                         errorElement={this.props.formErrors.r}/>
                    </form>
                </div>
                <div className={`button-wrapper ${this.errorClass(this.props.formErrors.r + this.props.formErrors.y + this.props.formErrors.x)}`}>
                    <div className={`button-elem`}>
                        <button type="button" onClick={this.props.submit}>Submit</button>
                    </div>
                    <div className={"button-elem"}>
                        <button type="button" onClick={this.props.clear}>Clear</button>
                    </div>
                    <FormErrors formErrors={this.props.formErrors}/>
                </div>
            </div>
        )
    }
}

export default CoordinatesForm