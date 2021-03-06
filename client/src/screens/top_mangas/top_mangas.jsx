import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import QueryString from 'query-string';
import { Spin } from 'antd';

import { Waypoint } from 'react-waypoint';

import './top_mangas.less';

import { Components, CustomHooks, Libs, Urls } from '#config/import_paths';

const { MasonryList } = Components.MasonryList();
const { MangaCard } = Components.Cards();
const { ErrorView } = Components.ErrorView();

const { SanitiazeTitle } = Libs.Utils();

const { ApiUrls } = Urls.ApiUrls();

const { useFavouritedManga } = CustomHooks.UseFavourtiedManga();

const INITIAL_PAGE = 1;
const PAGE_SIZE = 15;

const TopMangas = ({ history }) => {
  const { favouritedMangasById, isMangaFavourited, favouriteManga, unfavouriteManga } = useFavouritedManga();
  const [mangas, setMangas] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    _fetchMangas(INITIAL_PAGE);
  }, []);

  const _fetchMangas = async (page = INITIAL_PAGE) => {
    if (isLoading) return;
    setIsLoading(true);
    const params = {
      page,
      page_size: PAGE_SIZE,
    };

    const url = `${ApiUrls.mangas}?${QueryString.stringify(params)}`;
    Axios(url)
      .then((res) => {
        setNextPage(res.data.next ? page + 1 : null);
        setIsLoading(false);
        if (page === INITIAL_PAGE) setMangas(res.data.results);
        else setMangas((prevState) => [...prevState, ...res.data.results]);
      })
      .catch((err) => {
        setIsLoading(false);
        setApiError(err);
        console.log(err);
      });
  };

  const _onFavouriteClick = (manga) => {
    if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
    else favouriteManga(manga);
  };

  const _loadingEl = () => {
    if (!nextPage) return null;
    return (
      <div className = "loadMoreWrapper">
        <Spin size = "large" />
      </div>
    );
  };

  const _waypointEl = () => {
    if (!nextPage) return null;
    if (!isLoading) {
      return <Waypoint bottomOffset = "-20%" onEnter = {() => _fetchMangas(nextPage)} />;
    }
  };

  const _onShowDetails = (manga) => history.push(`${manga.id}-${SanitiazeTitle(manga.title)}`);

  const _onReload = () => {
    setApiError(false);
    _fetchMangas();
  };

  if (apiError && !mangas.length) {
    return (
      <ErrorView
        status = "500"
        title = "500"
        subTitle = "Something, went wrong"
        onReload = {_onReload}
      />
    );
  }

  if (!mangas.length && isLoading) {
    return (
      <div className = "topMangasSpinner">
        <Spin style = {{ zoom: 1.5 }} size = "large" />
      </div>
    );
  }

  return (
    <div className = "topMangaWrapper">
      <MasonryList
        items = {mangas}
        renderItems = {(item) => (
          <MangaCard
            className = "topMangaMangaCard"
            key = {item.id}
            manga = {item}
            isMangaFavourite = {isMangaFavourited(item.id)}
            onFavouriteClick = {_onFavouriteClick}
            onShowDetails = {_onShowDetails}
          />
        )}
      />
      {_waypointEl()}
      {_loadingEl()}
    </div>
  );
};

export default TopMangas;
