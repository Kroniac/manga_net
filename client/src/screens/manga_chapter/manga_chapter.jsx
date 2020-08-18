import React, { useEffect, useRef } from 'react';
import { func, shape, string } from 'prop-types';
import { Button, PageHeader, Select, Spin, Typography } from 'antd';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import Headroom from 'react-headroom';
import _ from 'lodash';

import './manga_chapter.less';

import { Components, CustomHooks, Libs, Urls } from '#config/import_paths';
import { NextPageBox } from './next_page_box';

const { Option } = Select;

const { SanitiazeTitle } = Libs.Utils();

const { LazyLoadImage } = Components.LazyLoadImage();
const { ErrorView } = Components.ErrorView();

const { useDataApi } = CustomHooks.UseDataApi();
const { useSavedMangaReadPos } = CustomHooks.UseSavedMangaReadPos();

const { ApiUrls } = Urls.ApiUrls();

let isDropdownVisible = false;
const MangaChapter = ({ match, history }) => {
  const { saveMangaReadPos } = useSavedMangaReadPos();
  const [{ data, isLoading, apiError }, doFetch, retryFetch] = useDataApi(
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

  useEffect(() => {
    if (data) {
      saveMangaReadPos({
        id: match.params.mangaId,
        chapterId: match.params.chapterId,
        title: data.manga_title,
        chapeterTitle: data.title,
      });
    }
  }, [data]);

  const _getChapterPath = (mangaId, chapterId, mangaTitle) => `${mangaId}-${chapterId}-`
    + `${SanitiazeTitle(mangaTitle)}`;

  const _navigateToChapter = (chapterId) => {
    const { mangaId, mangaName } = match.params;
    const path = _getChapterPath(mangaId, chapterId, mangaName);
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

  const _navigateToManga = () => {
    history.push(`/${match.params.mangaId}-${SanitiazeTitle(match.params.mangaName)}`);
  };

  const _navigateToHome = () => {
    history.push('/');
  };

  const _onReload = () => {
    retryFetch();
  };

  if (apiError && !data) {
    return (
      <ErrorView
        status = {apiError.status}
        title = {apiError.status}
        subTitle = {apiError.status === 404 ? 'Chapter Not Found' : 'Internal Error'}
        onReload = {_onReload}
      />
    );
  }

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
                  <HomeOutlined onClick = {_navigateToHome} className = "mangaChapterPageHeaderHome" />
                  <Button
                    className = "mangaChapterPageTitleButtonWrapper"
                    onClick = {_navigateToManga}
                  >
                    <Typography.Title ellipsis style = {{ color: 'white' }} level = {4}>
                      {data.manga_title}
                    </Typography.Title>
                  </Button>
                  <div style = {{ flex: 1 }} />
                  <div className = "mangaChapterPrevNextButtonsWithTitle">
                    <ChapterPrevNextButtons
                      prevChapterId = {data.prev_chapter_id}
                      nextChapterId = {data.next_chapter_id}
                      navigateToChapter = {_navigateToChapter}
                    />
                  </div>
                  <div style = {{ width: '100%' }}>
                    <Select
                      ref = {chapterMenuRef}
                      getPopupContainer = {() => document.getElementById('area')}
                      onDropdownVisibleChange = {_onDropdownVisibleChange}
                      className = "mangaChapterList"
                      dropdownClassName = "mangaChapterListMenu"
                      value = {match.params.chapterId}
                      onChange = {_onSelectChapter}
                    >
                      {data.chapters.map((chapter) => (
                        <Option
                          key = {chapter.number}
                          className = "mangaChapterChaptersOption"
                          value = {chapter.number}
                        >
                          {chapter.title}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className = "mangaChapterPrevNextButtonsHeaderBottom">
                    <ChapterPrevNextButtons
                      prevChapterId = {data.prev_chapter_id}
                      nextChapterId = {data.next_chapter_id}
                      navigateToChapter = {_navigateToChapter}
                    />
                  </div>
                </div>
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

const ChapterPrevNextButtons = ({ prevChapterId, nextChapterId, navigateToChapter }) => (
  <div>
    <Button disabled = {!prevChapterId} onClick = {() => navigateToChapter(prevChapterId)}>
      Prev Chapter
    </Button>
    <Button
      disabled = {!nextChapterId}
      style = {{ marginLeft: 7 }}
      onClick = {() => navigateToChapter(nextChapterId)}
    >
      Next Chapter
    </Button>
  </div>
);

ChapterPrevNextButtons.propTypes = {
  prevChapterId: string,
  nextChapterId: string,
  navigateToChapter: func.isRequired,
};

ChapterPrevNextButtons.defaultProps = {
  prevChapterId: null,
  nextChapterId: null,
};

export default MangaChapter;
