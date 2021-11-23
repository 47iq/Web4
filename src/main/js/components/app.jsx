import React, {Component} from 'react';
import Main from "./pages/main/main";
import './app.css'
import Login from "./pages/login/login";
import store from "../app/store";

class App extends Component {
    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }

    render() {
        return (
            <div className="first-page">
                {store.getState().login && store.getState().login !== "null" ? <Main/> : <Login/>}
            </div>
        )
    }
}

export default App;