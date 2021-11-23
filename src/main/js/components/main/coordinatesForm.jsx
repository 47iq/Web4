import React, {Component} from "react";
import {clearCanvas, drawCanvas} from "../../app/canvas";
import FormErrors from "../../molecules/errors";
import '../../css/coordForm.css'
import {clear} from "../../api/request";
import store from "../../app/store";
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

    componentDidMount() {
        this.mounted = true;
        store.subscribe(() => {
            if (this.mounted)
                this.setState({reduxState: store.getState()});
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    clear = () => {
        clear().then(response => {
            if(this.mounted)
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
                store.dispatch({
                    type: "addError",
                    value: {name: "x", value: xValid ? '' : ' must be in range (-3; 3)'}
                });
                this.props.setX(e.target.value)
                break;
            case 'Y':
                yValid = value != null && value !== '' && !isNaN(value) && value < 5 && value > -5
                store.dispatch({
                    type: "addError",
                    value: {name: "y", value: yValid ? '' : ' must be in range (-5; 5)'}
                });
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
                        <CoordinateInput name={"X"} errorClass={this.errorClass} formErrors={store.getState().formErrors}
                                         form={this.props.x_form} placeholder={"Enter X (-3; 3):"} handleUserInput={this.handleUserInput}
                                         errorElement={store.getState().formErrors.x}/>
                        <CoordinateInput name={"Y"} errorClass={this.errorClass} formErrors={store.getState().formErrors}
                                         form={this.props.y_form} placeholder={"Enter Y (-5; 5):"} handleUserInput={this.handleUserInput}
                                         errorElement={store.getState().formErrors.y}/>
                        <CoordinateInput name={"R"} errorClass={this.errorClass} formErrors={store.getState().formErrors}
                                         form={this.props.r_form} placeholder={"Enter R (-3; 3):"} handleUserInput={this.handleUserInput}
                                         errorElement={store.getState().formErrors.r}/>
                    </form>
                </div>
                <div className={`button-wrapper ${this.errorClass(store.getState().formErrors.r + store.getState().formErrors.y + store.getState().formErrors.x)}`}>
                    <div className={`button-elem`}>
                        <button type="button" onClick={this.props.submit}>Submit</button>
                    </div>
                    <div className={"button-elem"}>
                        <button type="button" onClick={this.clear}>Clear</button>
                    </div>
                    <FormErrors formErrors={store.getState().formErrors}/>
                </div>
            </div>
        )
    }
}

export default CoordinatesForm