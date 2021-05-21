import React from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import 'aframe-mouse-cursor-component';
import './aframe/component';

import './index.css';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

