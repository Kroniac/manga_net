import React, { useEffect } from 'react';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { shape } from 'prop-types';
import { string } from 'locutus/python';

import Typography from 'antd/es/typography';
import Axios from 'axios';
import { Screens } from '#config/import_paths';

const Home = Screens.Home();
const MangaChapter = Screens.MangaChapter();
const FavouriteMangas = Screens.FavouriteMangas();
const TopMangas = Screens.TopMangas();
const PageNotFound = Screens.PageNotFound();

const chapteraPathPattern = /^\/chapter\/[a-z0-9]{4,15}-[a-z.0-9]{1,7}-[a-z0-9-]+/;

const App = ({ location }) => {
  useEffect(() => {
    Axios.defaults.baseURL = process.env.API_BASE_URL;
    ReactGA.initialize('UA-176710683-1');
    ReactGA.pageview(location.pathname + location.search);
  }, []);

  return (
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
  );
};

App.propTypes = {
  location: shape({
    pathname: string.isRequired,
  }).isRequired,
};

const NavBar = () => (
  <div className = "navBarWrapper">
    <div>
      <Typography.Text>{`v${process.env.FRONTEND_VERSION}`}</Typography.Text>
    </div>
    <div>
      <NavLink
        tabIndex = {-1}
        activeClassName = "navBarItemActive"
        exact
        to = "/"
        className = "navBarItem"
      >
        Home
      </NavLink>
      <NavLink
        tabIndex = {-1}
        activeClassName = "navBarItemActive"
        to = "/topmangas"
        className = "navBarItem"
      >
        Top Mangas
      </NavLink>
      <NavLink
        tabIndex = {-1}
        activeClassName = "navBarItemActive"
        to = "/favourites"
        className = "navBarItem"
      >
        Favourites
      </NavLink>
    </div>
  </div>
);

export default withRouter(App);
