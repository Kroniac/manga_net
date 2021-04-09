import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'antd/dist/antd.dark.css';
import './index.less';
import App from './app';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app'),
);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js');
// }
