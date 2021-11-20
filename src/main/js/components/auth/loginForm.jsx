import React, {Component} from "react";
import store from "../../app/storage";
import '../../css/login.css'
import {login, register} from "../../api/request";
import FormErrors from "../errors";
import Header from "../header";

class Login extends Component {

    signIn = e => {
        login(this.state.username, this.state.password).then(response => response.json().then(json => {
            if (response.ok) {
                console.log(json)
                sessionStorage.setItem("token", json.accessToken)
                sessionStorage.setItem("refreshToken", json.refreshToken)
                store.dispatch({type: "changeLogin", value: "true"});
            } else {
                this.state.formErrors.other = json.message;
            }
        }))
    }

    signUp = e => {
        register(this.state.username, this.state.password).then(response => response.json().then(json => {
            if (response.ok) {
                this.signIn(e)
            } else {
                this.state.formErrors.other = json.message;
            }
        }))
    }

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginValid: true,
            passwordValid: true,
            formErrors: {
                username: '',
                password: '',
                other: ''
            },
        }
        this.signIn = this.signIn.bind(this)
        this.signUp = this.signUp.bind(this)
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.validateField(name, value, e);
    }

    validateField(fieldName, value, e) {
        let fieldValidationErrors = this.state.formErrors;
        let usernameValid = this.state.usernameValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'password':
                passwordValid = value != null && value.length > 5
                fieldValidationErrors.password = passwordValid ? '' : ' must contain at least 6 characters';
                this.setState({password: e.target.value})
                break;
            case 'username':
                usernameValid = value != null && value.length > 3
                fieldValidationErrors.username = usernameValid ? '' : ' must contain at least 4 characters';
                if (usernameValid) {
                    usernameValid = value != null && value.match(/^[a-zA-Z]+/)
                    fieldValidationErrors.username = usernameValid ? '' : ' must start with a letter';
                }
                this.setState({username: e.target.value})
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            passwordValid: passwordValid,
            usernameValid: usernameValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.passwordValid && this.state.usernameValid});
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'login-error');
    }

    render() {
        return (
            <div>
                <Header login={false}/>
                <div className="login-form-wrapper">
                    <form className={`login-form`}>
                        <div className={"log-field"}>
                            <label
                                className={`${this.errorClass(this.state.formErrors.username)}`}>Username </label><br/>
                            <input className={`${this.errorClass(this.state.formErrors.username)}`} type="text"
                                   name={"username"} id="username" value={this.state.username}
                                   onChange={(e) => this.handleUserInput(e)} maxLength={10}/>
                        </div>
                        <div className="log-field">
                            <label
                                className={`${this.errorClass(this.state.formErrors.password)}`}>Password </label><br/>
                            <input className={`${this.errorClass(this.state.formErrors.password)}`} type="password"
                                   name={"password"} id="password" value={this.state.password}
                                   onChange={(e) => this.handleUserInput(e)} maxLength={20}/>
                        </div>
                        <div className={"login-buttons"}>
                            <button className="button" type="button" onClick={this.signUp}>Sign Up</button>
                            <button className="button" type="button" onClick={this.signIn}>Log In</button>
                        </div>
                        <FormErrors formErrors={this.state.formErrors}/>
                    </form>
                </div>
            </div>
        )
    }


}


export default Login