import React, {Component} from "react";
import AppHeader from "../molecules/appHeader"
import '../css/headerStyle.css'
import store from "../app/store";

class Header extends Component {

    constructor(props) {
        super(props);
    }

    logout = e => {
        sessionStorage.setItem("token", null)
        store.dispatch({type: "changeLogin", value: null});
    }

    render() {
        return (
            <AppHeader isLoggedIn={this.props.login} logout={this.logout}/>
        )
    }
}

export default Header