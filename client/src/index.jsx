import React from 'react';
import ReactDOM from 'react-dom';
import { Input, AutoComplete } from 'antd';
import 'antd/dist/antd.css';
import './global.less';
import Search from './antd/search'

const App = () => (
  <div className = "mainContainer">
    <div className = "mainSearchContainer">
      <Search frameStyles = {{ maxWidth: 500, width: '75%' }} />
    </div>
  </div>
);

ReactDOM.render(
  <React.StrictMode>
       <App />
  </React.StrictMode>,
  document.getElementById('app'),
);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js');
// }
