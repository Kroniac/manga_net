import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink, Route, Switch, withRouter } from 'react-router-dom';

import 'antd/dist/antd.dark.css';
import './index.less';

import { Screens } from '#config/import_paths';

const Home = Screens.Home();
const MangaChapter = Screens.MangaChapter();
const FavouriteMangas = Screens.FavouriteMangas();
const TopMangas = Screens.TopMangas();
const PageNotFound = Screens.PageNotFound();

const chapteraPathPattern = /^\/chapter\/[a-z0-9]{4,15}-[a-z.0-9]{1,7}-[a-z0-9-]+/;

const App = withRouter(({ location }) => (
  <div>
    {!chapteraPathPattern.test(location.pathname) ? <NavBar /> : null}
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
      <Route
        path = "/topmangas"
        component = {TopMangas}
      />
      <Route component = {PageNotFound} />
    </Switch>
  </div>
));

const NavBar = () => (
  <div className = "navBarWrapper">
    <NavLink tabIndex = {-1} activeClassName = "navBarItemActive" exact to = "/" className = "navBarItem">
      Home
    </NavLink>
    <NavLink tabIndex = {-1} activeClassName = "navBarItemActive" to = "/topmangas" className = "navBarItem">
      Top Mangas
    </NavLink>
    <NavLink tabIndex = {-1} activeClassName = "navBarItemActive" to = "/favourites" className = "navBarItem">
      Favourites
    </NavLink>
  </div>
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
