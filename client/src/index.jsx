import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import 'antd/dist/antd.css';

import { Screens } from '#config/import_paths.js';

const Home = Screens.Home();
const MangaChapter = Screens.MangaChapter();

const App = () => (
  <Switch>
    <Route
      path = "/:mangaId([a-z0-9]{24})-:mangaName([a-z0-9-]+)"
      exact
      component = {Home}
    />
    <Route exact path = "/" component = {Home} />
    <Route path = "/chapter/:chapterId([a-z0-9]{24})-:mangaName([a-z0-9-]+)" component = {MangaChapter} />
    <Redirect to = "/" />
  </Switch>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app'),
);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js');
// }
