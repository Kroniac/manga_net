import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import {
  Tag, Tooltip, Spin, Card, List, Input,
} from 'antd';

import Search from '../../antd/search';

import { CustomHooks } from '#config/import_paths';
import { FavourteButton } from './favourite_buton';

const { Meta } = Card;


const { useDataApi } = CustomHooks.useDataApi();
const { useFavouritedManga } = CustomHooks.useFavourtiedManga();

const THROTTLE_TIME = 500;

const sanitizeTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');

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

  const _returnStatusInfo = (status) => {
    switch (status) {
      case 0: return {
        title: 'Suspended',
        color: '',
      };
      case 1: return {
        title: 'Ongoing',
        color: 'blue',
      };
      case 2: return {
        title: 'Completed',
        color: 'green',
      };
      default: return {
        title: 'Unknown',
        color: '',
      };
    }
  };

  const dataSource = searchQuery.length > 1 && data.results.map((manga) => ({
    value: manga.title,
    key: manga.id,
    data: manga,
    label: (
      <div
        key = {manga.id}
        className = "home-search-option"
        to = {`${manga.id}-${sanitizeTitle(manga.title)}`}
      >
        <Tooltip placement = "topLeft" mouseEnterDelay = {0.5} title = {manga.title}>
          <div className = "home-search-option-title">{manga.title}</div>
        </Tooltip>
        <Tag className = "home-search-option-status" color = {_returnStatusInfo(manga.status).color}>
          {_returnStatusInfo(manga.status).title}
        </Tag>
        <FavourteButton
          manga = {manga}
          isMangaFavourited = {isMangaFavourited}
          favouriteManga = {favouriteManga}
          unfavouriteManga = {unfavouriteManga}
        />
      </div>
    ),
  }));

  const _onSelectOption = (value, option) => {
    const manga = option.data;
    history.push(`${manga.id}-${sanitizeTitle(manga.title)}`);
  };

  return (
    <div className = "mainContainer">
      <div className = {`mainSearchContainer ${match?.params?.mangaId ? 'selected' : ''}`}>
        <Search
          frameStyles = {{ maxWidth: 500, width: '75%' }}
          inputStyles = {{ paddingTop: 10, paddingBottom: 10 }}
          onChange = {_onChangeText}
          options = {dataSource}
          onSelect = {_onSelectOption}
          size = "large"
        />
        {
        match?.params?.mangaId ? (
          <MangaDetails
            mangaId = {match?.params?.mangaId}
          />
        ) : null
      }
      </div>
    </div>
  );
};

const MangaDetails = ({ mangaId }) => {
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `http://localhost:8000/mangas/manga_info/${mangaId}/`,
    null,
    false,
  );

  useEffect(() => {
    doFetch(`http://localhost:8000/mangas/manga_info/${mangaId}/`);
  }, [mangaId]);

  const _onChapterSelect = () => {
    const { manga, history } = props;
    console.log(history);
    // history.push(`${mangaId}-${sanitizeTitle(manga.title)}`);
  };

  return (
    <div className = "manga-details-wrapper">
      {isLoading || !data ? <div className = "manga-details-spinner"><Spin size = "large" /></div> : (

        <>
          <Card
            className = "manga-details-card-wrapper"
            bodyStyle = {{ padding: '7px 15px', textAlign: 'justify' }}
            cover = {<img style = {{ width: 100, objectFit: 'contain' }} referrerPolicy = "no-referrer" alt = "example" src = {`https://cdn.mangaeden.com/mangasimg/${data.image}`} />}
          >
            <div>{data.description}</div>
          </Card>
          <List
            size = "small"
            header = {(
              <Input
                placeholder = "input search text"
                onChange = {(e) => console.log(e.currentTarget.value)}
              />
          )}
            footer = {<div>Footer</div>}
            bordered
            style = {{ margin: '10px 0' }}
            dataSource = {data && data.chapters ? data.chapters : []}
            renderItem = {(item) => <List.Item><Link to = {`${mangaId}-${sanitizeTitle(data.title)}`}>{item.title}</Link></List.Item>}
          />
        </>
      )}
    </div>

  );
};

export default Home;
