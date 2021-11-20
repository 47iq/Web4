'use strict';

import App from "./app";
import storage from "./app/storage";

const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
    <App store={storage}/>,
    document.getElementById('react')
)
