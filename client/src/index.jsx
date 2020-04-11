import React from 'react';
import ReactDOM from 'react-dom';
import { Input, AutoComplete } from 'antd';
import {
  BrowserRouter, Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import 'antd/dist/antd.css';
import './global.less';

import { Screens } from '#config/import_paths.js';

const Home = Screens.Home();

const App = () => (
  <Switch>
    <Route path = "/login" component = {Home} />
    <Redirect to = "/login" />
  </Switch>
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('app'),
);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js');
// }
