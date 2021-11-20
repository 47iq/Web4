import React, {Component} from 'react';
import Main from "./components/main/main";
import './css/app.css'
import Login from "./components/auth/loginForm";

class App extends Component {
    componentDidMount() {
        this.props.store.subscribe(() => {
            this.setState({reduxState: this.props.store.getState()});
        })
    }

    /*styles = {
        backgroundImage: `url(${BackgroundImage})`
    }
*/
    render() {
        return (
            <div className="first-page">
                {this.props.store.getState().login && this.props.store.getState().login !== "null" ? <Main/> : <Login/>}
            </div>
        )
    }
}

export default App;