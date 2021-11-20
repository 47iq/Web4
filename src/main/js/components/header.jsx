import React, {Component} from "react";
import '../css/headerStyle.css'
import store from "../app/store";

class Header extends Component {

    constructor(props) {
        super(props);
    }

    logout = e => {
        sessionStorage.setItem("token", null)
        store.dispatch({type: "changeLogin", value: null});
        console.log(store.getState().login)
    }

    render() {
        return (
            <header className={"header"}>
                <div className={"header-button-wrapper"}>
                    {this.props.login ? <button className={"logout"} onClick={this.logout}>Logout</button> : ""}
                </div>
                <div>
                <span>
                    Pavel Danilov, P3210
                </span>
                    <span>
                    Variant 1777
                </span>
                </div>
            </header>
        )
    }
}

export default Header