import React, { useCallback, useEffect, useState } from 'react';
import { Button, List, Tag, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { func, shape, string } from 'prop-types';
import _ from 'lodash';
import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';
import './home.less';

import { MangaDetails } from './manga_details';
import { ReturnMangaStatusInfo } from './utils';

import HomeImage from '../../images/ret.png';
import { Components, CustomHooks, Libs, Urls } from '#config/import_paths';

const { SanitiazeTitle } = Libs.Utils();

const { FavouriteButton } = Components.Buttons();
const { Snackbar } = Components.Snackbar();
const { SearchBar } = Components.SearchBar();

const { useDataApi } = CustomHooks.UseDataApi();
const { useFavouritedManga } = CustomHooks.UseFavourtiedManga();
const { useSavedMangaReadPos } = CustomHooks.UseSavedMangaReadPos();
const { useSnackbar } = CustomHooks.UseSnackbar();

const { ApiUrls } = Urls.ApiUrls();

const THROTTLE_TIME = 500;

const Home = ({ match, history }) => {
  const { isActive, message, openSnackBar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const { isMangaFavourited, favouriteManga, unfavouriteManga } = useFavouritedManga();
  const { savedMangaReadPositions, getMangaPosIfSaved } = useSavedMangaReadPos();
  const [{ data, isLoading, apiError }, doFetch] = useDataApi(
    ApiUrls.mangas,
    { results: [] },
    true,
    3000,
  );

  useEffect(() => {
    if (searchQuery.length > 2) {
      doFetch(`${ApiUrls.mangas}?page_size=10&title__icontains=${searchQuery}`);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (apiError) {
      if (!apiError.status) openSnackBar('Please check your internet');
      else openSnackBar(`${apiError.status}: Internal Error`);
    }
  }, [apiError]);

  const _onChangeText = useCallback(_.throttle((searchText) => {
    setSearchQuery(searchText);
  }, THROTTLE_TIME), [setSearchQuery]);

  const _onFavouriteButtonClick = (manga) => {
    if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
    else favouriteManga(manga);
  };

  const dataSource = searchQuery.length > 1 && (data?.results || []).map((manga) => ({
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
        <FavouriteButton
          item = {manga}
          isFavourite = {isMangaFavourited(manga.id)}
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
      <div className = "mainContentContainer">
        <div
          className = {match?.params?.mangaId
            ? ['mainSearchContainer', 'selected'].join(' ') : 'mainSearchContainer'}
        >
          <SearchBar
            frameStyles = {{ maxWidth: 500, zIndex: 1, width: '75%', backgroundColor: '#383838' }}
            inputStyles = {{ paddingTop: 10, paddingBottom: 10 }}
            onChange = {_onChangeText}
            options = {dataSource}
            onSelect = {_onSelectOption}
            placeholder = "Search for manga"
            size = "large"
          />
          {match?.params?.mangaId ? (
            <MangaDetails
              mangaId = {match.params.mangaId}
              history = {history}
              isMangaFavourite = {isMangaFavourited(match.params.mangaId)}
              mangaReadPos = {getMangaPosIfSaved(match.params.mangaId)}
              onFavouriteButtonClick = {_onFavouriteButtonClick}
            />
            ) : null}
          {match?.params?.mangaId ? null : (
            <ContinueReadingView
              history = {history}
              savedMangaReadPositions = {savedMangaReadPositions}
            />
          )}
        </div>
        <div
          className = {match?.params?.mangaId
            ? ['homeCoverImageWrapper', 'hideImage'].join(' ') : 'homeCoverImageWrapper'}
        >
          <img
            referrerPolicy = "no-referrer"
            alt = "asdd"
            src = {HomeImage}
          />
        </div>
      </div>
      <Snackbar isActive = {isActive} message = {message} />
    </div>
  );
};

const ContinueReadingView = ({ history, savedMangaReadPositions }) => {
  const _returnChapterPath = (mangaId, chapterId, mangaTitle) => `chapter/${mangaId}-${chapterId}-`
   + `${SanitiazeTitle(mangaTitle)}`;

  const _onTopMangas = () => {
    history.push('/topmangas');
  };

  if (!savedMangaReadPositions.length) {
    return (
      <div className = "continueReadingViewWrapper">
        <div>
          <Typography.Text>
            Can&apos;t Decide? Checkout
          </Typography.Text>
          <Button onClick = {_onTopMangas} style = {{ marginLeft: 7 }}>Top Mangas</Button>
        </div>
      </div>
    );
  }

  return (
    <div className = "continueReadingViewWrapper">
      <Typography.Text>Continue Reading</Typography.Text>
      <List
        className = "continueReadingViewListWrapper"
        size = "small"
        grid = {{
          column: savedMangaReadPositions.length >= 2 ? 2 : 1,
          md: savedMangaReadPositions.length >= 2 ? 2 : 1,
          sm: 1,
          xs: 1,
        }}
        dataSource = {savedMangaReadPositions.slice(0, 5).map((manga) => manga)}
        renderItem = {(item) => (
          <List.Item
            key = {item.index}
            className = "continueReadingViewItemWrapper"
          >
            <Link
              className = "continueReadingViewItemLink"
              style = {{ width: '100%' }}
              to = {_returnChapterPath(item.id, item.chapterId, item.title)}
            >
              <List.Item.Meta
                style = {{ alignItems: 'center', fontSize: 10 }}
                title = {`${item.title} - ${item.chapterId}`}
              />
              <RightCircleOutlined style = {{ fontSize: 20, paddingLeft: 5 }} />
            </Link>
          </List.Item>
        )}
      />
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
