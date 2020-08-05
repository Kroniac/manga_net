import React, { useEffect, useRef } from 'react';
import { func, shape, string } from 'prop-types';
import { Button, PageHeader, Select, Spin, Typography } from 'antd';
import Headroom from 'react-headroom';
import _ from 'lodash';

import './manga_chapter.less';

import { Components, CustomHooks, Libs, Urls } from '#config/import_paths';
import { NextPageBox } from './next_page_box';

const { Option } = Select;

const { SanitiazeTitle } = Libs.Utils();

const { LazyLoadImage } = Components.LazyLoadImage();
const { useDataApi } = CustomHooks.UseDataApi();

const { ApiUrls } = Urls.ApiUrls();

let isDropdownVisible = false;
const MangaChapter = ({ match, history }) => {
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    ApiUrls.baseUrl
    + ApiUrls.mangaChapter.replace('{chapterId}', `${match.params.mangaId}-${match.params.chapterId}`),
    null,
    false,
  );
  const chapterMenuRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', _onScroll);
    doFetch(ApiUrls.baseUrl
      + ApiUrls.mangaChapter.replace('{chapterId}', `${match.params.mangaId}-${match.params.chapterId}`));

    return () => {
      window.addEventListener('scroll', _onScroll);
    };
  }, [match.params.chapterId]);

  const _returnChapterPath = (mangaId, chapterId, mangaTitle) => `${mangaId}-${chapterId}-${SanitiazeTitle(mangaTitle)}`;

  const _navigateToChapter = (chapterId) => {
    const { mangaId, mangaName } = match.params;
    const path = _returnChapterPath(mangaId, chapterId, mangaName);
    history.replace(path);
  };

  const _onSelectChapter = (chapterNumber) => {
    _navigateToChapter(chapterNumber);
  };

  const _onScroll = () => {
    if (isDropdownVisible) chapterMenuRef.current.blur();
  };

  const _onDropdownVisibleChange = (isVisible) => {
    isDropdownVisible = isVisible;
  };

  const _onPrevChapter = () => {
    _navigateToChapter(data.prev_chapter_id);
  };

  const _onNextChapter = () => {
    _navigateToChapter(data.next_chapter_id);
  };

  return (
    <div className = "mangaChapterWrapper" style = {isLoading ? { height: '100vh' } : {}}>
      {
        !data ? null : (
          <div style = {{ width: '100%' }}>
            <Headroom id = "area">
              <PageHeader
                className = "mangaChaperPageHeader"
                onBack = {() => null}
              >
                <div className = "mangaChaperPageHeaderContent">
                  <Typography.Title style = {{ color: 'white' }} level = {4}>
                    {data.manga_title}
                  </Typography.Title>
                  <div style = {{ flex: 1 }} />
                  <Button ghost onClick = {_onPrevChapter}>Prev Chapter</Button>
                  <Button ghost style = {{ marginLeft: 7 }} onClick = {_onNextChapter}>Next Chapter</Button>
                </div>
                <Select
                  ref = {chapterMenuRef}
                  getPopupContainer = {() => document.getElementById('area')}
                  onDropdownVisibleChange = {_onDropdownVisibleChange}
                  className = "mangaChapterList"
                  dropdownClassName = "mangaChapterListMenu"
                  value = {match.params.chapterId}
                  onChange = {_onSelectChapter}
                >
                  {
                    data.chapters.map((chapter) => (
                      <Option
                        key = {chapter.number}
                        className = "mangaChapterChaptersOption"
                        value = {chapter.number}
                      >
                        {chapter.title}
                      </Option>
                    ))
                  }
                </Select>
              </PageHeader>
            </Headroom>
          </div>
        )
      }
      {isLoading || !data ? (
        <div className = "mangaChapterSpinner">
          <Spin style = {{ zoom: 1.5 }} size = "large" />
        </div>

      ) : (
        <>
          {data.images.map((item) => (
            <div key = {item.id}>
              <LazyLoadImage src = {item.url} />
            </div>
          ))}
          <NextPageBox chapterId = {data.next_chapter_id} navigateToChapter = {_navigateToChapter} />
        </>
      )}
    </div>
  );
};

MangaChapter.propTypes = {
  match: shape({
    params: shape({
      chapterId: string.isRequired,
    }).isRequired,
  }).isRequired,
  history: shape({
    replace: func.isRequired,
  }).isRequired,
};

export default MangaChapter;
