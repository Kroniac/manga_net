import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.dark.css';
import './global.less';

import { Screens } from '#config/import_paths';

const Home = Screens.Home();
const MangaChapter = Screens.MangaChapter();
const FavouriteMangas = Screens.FavouriteMangas();

const App = () => (
  <Switch>
    <Route
      path = "/:mangaId([a-z0-9]{7,8})-:mangaName([a-z0-9-]+)"
      exact
      component = {Home}
    />
    <Route exact path = "/" component = {Home} />
    <Route
      path = "/chapter/:mangaId([a-z0-9]{4,15})-:chapterId([a-z.0-9]{1,7})-:mangaName([a-z0-9-]+)"
      component = {MangaChapter}
    />
    <Route
      path = "/favourites"
      component = {FavouriteMangas}
    />
    {/* <Redirect to = "/" /> */}
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
