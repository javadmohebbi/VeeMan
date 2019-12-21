import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import $ from 'jquery';
// eslint-disable-next-line
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import store from "./redux/store";

import App from './App';
import * as serviceWorker from './serviceWorker';

// import i18n (needs to be bundled ;))
import './i18n';

import './index.css'


ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
