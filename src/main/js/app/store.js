import {createStore} from "redux";

const initialState = {
    login: sessionStorage.getItem("login"),
    checks: null
};

function reducer(state, action) {
    switch (action.type) {
        case "changeLogin":
            sessionStorage.setItem("login", action.value)
            state.login = action.value
            state.checks = null
            return state;
        case "appendCheck":
            state.checks.push(action.value)
            return state;
        case "changeRadius":
            state.radius = action.value
            return state
        case "setChecks":
            sessionStorage.setItem("checks", action.value)
            state.checks = action.value
            return state;
        default:
            return state;
    }
}

const store = createStore(reducer, initialState);
export default store;