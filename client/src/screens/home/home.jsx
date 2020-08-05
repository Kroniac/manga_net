import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Tag, Tooltip, Typography } from 'antd';
import { func, shape, string } from 'prop-types';
import _ from 'lodash';
import './home.less';

import { FavourteButton } from './favourite_buton';
import { MangaDetails } from './manga_details';
import { ReturnMangaStatusInfo } from './utils';
import Search from '../../antd/search';

import HomeImage from '../../images/ret.png';
import { CustomHooks, Libs } from '#config/import_paths';

const { SanitiazeTitle } = Libs.Utils();

const { useDataApi } = CustomHooks.UseDataApi();
const { useFavouritedManga } = CustomHooks.UseFavourtiedManga();

const THROTTLE_TIME = 500;

const Home = ({ match, history }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isMangaFavourited, favouriteManga, unfavouriteManga } = useFavouritedManga();
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://localhost:8000/mangas/mangas/',
    { results: [] },
    true,
  );

  useEffect(() => {
    if (searchQuery.length > 2) {
      doFetch(`http://localhost:8000/mangas/mangas/?page_size=10&title__icontains=${searchQuery}`);
    }
  }, [searchQuery]);

  const _onChangeText = useCallback(_.throttle((searchText) => {
    setSearchQuery(searchText);
  }, THROTTLE_TIME), [setSearchQuery]);

  const _onFavouriteButtonClick = (manga) => {
    if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
    else favouriteManga(manga);
  };

  const dataSource = searchQuery.length > 1 && data.results.map((manga) => ({
    value: manga.title,
    key: manga.id,
    data: manga,
    label: (
      <div
        key = {manga.id}
        className = "homeSearchOption"
        to = {`${manga.id}-${SanitiazeTitle(manga.title)}`}
      >
        <Tooltip placement = "topLeft" mouseEnterDelay = {0.5} title = {manga.title}>
          <div className = "homeSearchOptionTitle">{manga.title}</div>
        </Tooltip>
        <Tag className = "homeSearchOptionStatus" color = {ReturnMangaStatusInfo(manga.status).color}>
          {ReturnMangaStatusInfo(manga.status).title}
        </Tag>
        <FavourteButton
          manga = {manga}
          isMangaFavourite = {isMangaFavourited(manga.id)}
          onClick = {_onFavouriteButtonClick}
        />
      </div>
    ),
  }));

  const _onSelectOption = (value, option) => {
    const manga = option.data;
    history.push(`${manga.id}-${SanitiazeTitle(manga.title)}`);
  };

  return (
    <div className = "mainContainer">
      <NavBar />
      <div className = "mainContentContainer">
        <div
          className = {
          match?.params?.mangaId
            ? ['mainSearchContainer', 'selected'].join(' ') : 'mainSearchContainer'
        }
        >
          <Search
            frameStyles = {{ maxWidth: 500, zIndex: 1, width: '75%', backgroundColor: '#383838' }}
            inputStyles = {{ paddingTop: 10, paddingBottom: 10 }}
            onChange = {_onChangeText}
            options = {dataSource}
            onSelect = {_onSelectOption}
            placeholder = "Search for manga"
            size = "large"
          />
          {
            match?.params?.mangaId ? (
              <MangaDetails
                mangaId = {match.params.mangaId}
                history = {history}
                isMangaFavourite = {isMangaFavourited(match.params.mangaId)}
                onFavouriteButtonClick = {_onFavouriteButtonClick}
              />
            ) : null
          }
        </div>
        <div
          className = {
          match?.params?.mangaId
            ? ['homeCoverImageWrapper', 'hideImage'].join(' ') : 'homeCoverImageWrapper'
          }
        >
          <img
            referrerPolicy = "no-referrer"
            alt = "asdd"
            src = {HomeImage}
          />
        </div>
      </div>
    </div>
  );
};

const NavBar = () => (
  <div className = "navBarWrapper">
    <NavLink tabIndex = {-1} activeClassName = "navBarItemActive" exact to = "/" className = "navBarItem">Home</NavLink>
    <NavLink tabIndex = {-1} activeClassName = "navBarItemActive" to = "/favourites" className = "navBarItem">Favourites</NavLink>
  </div>
);

Home.propTypes = {
  match: shape({
    params: shape({
      mangaId: string,
    }).isRequired,
  }).isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default Home;
