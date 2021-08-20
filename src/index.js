import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from '../../spiro-neo/src/components/Components/App';
import 'fontsource-roboto';

import {Router} from '@reach/router'

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <App path='*'/>
  </ Router>
  // </React.StrictMode>
  , document.getElementById('root')
);

