import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Tag, Tooltip } from 'antd';

import Search from '../../antd/search';

const useDataApi = (initialUrl, initialData) => {
  const didMountRef = useRef(false);

  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (didMountRef.current) {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          const result = await axios(url);
          setData(result.data);
        } catch (error) {
          setIsError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    } else didMountRef.current = true;
  }, [url]);
  return [{ data, isLoading, isError }, setUrl];
};

const THROTTLE_TIME = 500;

const sanitizeTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');

const Home = ({ history }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://localhost:8000/mangas/mangas/',
    { results: [] },
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
      >
        <Tooltip placement = "topLeft" mouseEnterDelay = {0.5} title = {manga.title}>
          <div className = "home-search-option-title">{manga.title}</div>
        </Tooltip>
        <Tag className = "home-search-option-status" color = {_returnStatusInfo(manga.status).color}>
          {_returnStatusInfo(manga.status).title}
        </Tag>
      </div>
    ),
  }));

  const _onSelectOption = (value, option) => {
    const manga = option.data;
    history.push(`${manga.id}-${sanitizeTitle(manga.title)}`);
  };

  return (
    <div className = "mainContainer">
      <div className = "mainSearchContainer">
        <Search
          frameStyles = {{ maxWidth: 500, width: '75%' }}
          inputStyles = {{ paddingTop: 10, paddingBottom: 10 }}
          onChange = {_onChangeText}
          options = {dataSource}
          onSelect = {_onSelectOption}
        />
      </div>
    </div>
  );
};

export default Home;
