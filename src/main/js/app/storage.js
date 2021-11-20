import {createStore} from "redux";

const initialState = {
    login: sessionStorage.getItem("login")
};

function reducer(state, action) {
    switch (action.type) {
        case "changeLogin":
            sessionStorage.setItem("login", action.value)
            return {login: action.value};
        default:
            return state;
    }
}

const storage = createStore(reducer, initialState);
export default storage;