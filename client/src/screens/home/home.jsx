import './home.less';
import React, { useCallback, useEffect, useState } from 'react';
import { Tag, Tooltip } from 'antd';
import { func, shape, string } from 'prop-types';
import _ from 'lodash';


import { FavourteButton } from './favourite_buton';
import { MangaDetails } from './manga_details';
import { ReturnMangaStatusInfo } from './utils';
import Search from '../../antd/search';

import { CustomHooks, Libs } from '#config/import_paths';

const { SanitiazeTitle } = Libs.Utils();

const { useDataApi } = CustomHooks.useDataApi();
const { useFavouritedManga } = CustomHooks.useFavourtiedManga();

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

  const _onFavouriteButtonClick = (mangaId) => {
    if (isMangaFavourited(mangaId)) unfavouriteManga(mangaId);
    else favouriteManga(mangaId);
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
          mangaId = {manga.id}
          isMangaFavourited = {isMangaFavourited}
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
      <div className = {match?.params?.mangaId ? ['mainSearchContainer', 'selected'].join(' ') : 'mainSearchContainer'}>
        <Search
          frameStyles = {{ maxWidth: 500, width: '75%' }}
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
            mangaId = {match?.params?.mangaId}
            history = {history}
            isMangaFavourited = {isMangaFavourited}
            onFavouriteButtonClick = {_onFavouriteButtonClick}
          />
        ) : null
      }
      </div>
    </div>
  );
};

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
