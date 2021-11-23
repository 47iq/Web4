import React, {Component} from 'react';
import Main from "./pages/main";
import './app.css'
import Login from "./pages/login";
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
                {store.getState().login ? <Main/> : <Login/>}
            </div>
        )
    }
}

export default App;