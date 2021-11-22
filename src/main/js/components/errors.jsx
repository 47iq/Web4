import React, {Component} from 'react';
import store from "../app/store";

class FormErrors extends Component {
    constructor(props) {
        super(props);
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

    render() {
        return (
            <div className={`button-elem form-errors`}>
                {store.getState().formErrors.important && store.getState().formErrors.important !== '' ?
                    <p className={"error-text"}>
                        {store.getState().formErrors.important}
                    </p>
                    :
                    Object.keys(store.getState().formErrors).map((fieldName, i) => {
                        if (store.getState().formErrors[fieldName].length > 0) {
                            return (
                                <p className={"error-text"}
                                   key={i}>{fieldName.substr(0, 1).toUpperCase() + fieldName.substr(1)} {store.getState().formErrors[fieldName]}!</p>
                            )
                        } else {
                            return '';
                        }
                    })}
            </div>)
    }
}

export default FormErrors