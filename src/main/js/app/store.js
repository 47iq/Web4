import {createStore} from "redux";

const initialState = {
    login: sessionStorage.getItem("login"),
    checks: null,
    formErrors: {
        x: '',
        y: '',
        r: '',
        username: '',
        password: '',
        important: ''
    },
    radius: null
};

function reducer(state, action) {
    switch (action.type) {
        case "changeLogin":
            sessionStorage.setItem("login", action.value)
            if(action.value == null) {
               state.radius = null
            }
            state.login = action.value
            state.checks = null
            state.formErrors = initialState.formErrors
            return state;
        case "addError":
            state.formErrors[action.value.name] = action.value.value
            return state
        case "removeError":
            state.formErrors[action.value] = ''
            return state
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