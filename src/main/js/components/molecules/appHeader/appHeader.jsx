import React, {Component} from "react";
import './appHeader.css'

class AppHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className={"header"}>
                <div className={"header-button-wrapper"}>
                    {this.props.isLoggedIn ? <button className={"logout"} onClick={this.props.logout}>Log Out</button> : ""}
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

export default AppHeader