import React, {Component} from 'react';
import Main from "./components/main/main";
import './css/app.css'
import Login from "./components/auth/loginForm";
import store from "./app/store";

class App extends Component {
    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }

    /*styles = {
        backgroundImage: `url(${BackgroundImage})`
    }
*/
    render() {
        return (
            <div className="first-page">
                {store.getState().login && store.getState().login !== "null" ? <Main/> : <Login/>}
            </div>
        )
    }
}

export default App;