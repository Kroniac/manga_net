import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import 'antd/dist/antd.css';
import './global.less';

import { Screens } from '#config/import_paths.js';

const Home = Screens.Home();
const Manga = Screens.Manga();

const App = () => (
  <Switch>
    <Route
      path = "/:mangaId([a-z0-9]{24})-:mangaName([a-z0-9-]+)"
      component = {Manga}
    />
    <Route path = "/" component = {Home} />
    <Redirect to = "/" />
  </Switch>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app'),
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
