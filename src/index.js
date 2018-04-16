import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './animate.css';
import './index.css';
import AppRouter from './router/AppRouter';
import registerServiceWorker from './registerServiceWorker';

const store = createStore((state = {pattern:[]}, action)  => {
    switch (action.type) {
        case 'SET_PATTERN':
            return {
                pattern : action.pattern
            };
        default:
            return state;
    }
});

ReactDOM.render((
    <Provider store={store}>
        <AppRouter />
    </Provider>
    ), document.getElementById('root'));
registerServiceWorker();
