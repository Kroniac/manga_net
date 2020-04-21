import React, { useRef } from 'react';
import { Spin } from 'antd';

import './manga_chapter.less';
import { CustomHooks, Urls, Components } from '#config/import_paths';

const { LazyLoadImage } = Components.LazyLoadImage();

const { useDataApi } = CustomHooks.useDataApi();

const { ApiUrls } = Urls.ApiUrls();

const MangaChapter = ({ match }) => {
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    ApiUrls.baseUrl + ApiUrls.mangaChapter.replace('{chapterId}', match.params.chapterId),
    { results: [] },
    false,
  );
  const wrapperRef = useRef();

  if (isLoading || !data) {
    return (
      <div className = "mangaChapterSpinner"><Spin size = "large" /></div>
    );
  }

  return (
    <div ref = {wrapperRef} className = "mangaChapterWrapper">
      {
        [...data]
          .reverse()
          .map((item, index) => (
            <div key = {index}>
              <LazyLoadImage
                placeholderHeight = {item.image.height}
                rootRef = {wrapperRef}
                referrerPolicy = "no-referrer"
                src = {`https://cdn.mangaeden.com/mangasimg/${item.image.url}`}
              />
            </div>
          ))
  }
    </div>
  );
};

export default MangaChapter;
