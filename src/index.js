import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';


//axios.defaults.baseURL = 'http://localhost:443/';
axios.defaults.baseURL = 'http://167.172.178.224:443/';
axios.defaults.withCredentials = true;

ReactDOM.render(<App />, document.getElementById('root'));


// registerServiceWorker();
