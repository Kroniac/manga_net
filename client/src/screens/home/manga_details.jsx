import React, { useEffect, useState } from 'react';
import {
  Button, Divider, Input, List, Spin, Tabs, Tag, Typography,
} from 'antd';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import { bool, func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import htmlEntityEncode from 'locutus/php/strings/html_entity_decode';

import { Components, CustomHooks, Libs, Urls } from '#config/import_paths';

import { ReturnMangaStatusInfo } from './utils';

const { TabPane } = Tabs;

const { SanitiazeTitle, ReturnFormattedDateFromUtcSecs } = Libs.Utils();

const { FavouriteButton } = Components.Buttons();
const { ErrorView } = Components.ErrorView();
const { LazyLoadImage } = Components.LazyLoadImage();

const { useDataApi } = CustomHooks.UseDataApi();

const { ApiUrls } = Urls.ApiUrls();

const shouldStopMangaDetailsUpdate = (prevProps, nextProps) => {
  if (prevProps.mangaId !== nextProps.mangaId) return false;
  if (prevProps.isMangaFavourite !== nextProps.isMangaFavourite) return false;
  if (prevProps.mangaReadPos !== nextProps.mangaReadPos) return false;

  return true;
};

let chaptersOriginalCopy = [];

export const MangaDetails = React.memo(({
  mangaId, isMangaFavourite, onFavouriteButtonClick, history, mangaReadPos,
}) => {
  const [chapters, setChapters] = useState([]);
  const [{ data, isLoading, apiError }, doFetch, retryFetch] = useDataApi(
    `${ApiUrls.mangaInfo}${mangaId}/`,
    null,
    false,
  );

  useEffect(() => {
    if (data !== null) {
      const updatedChapters = data.chapters.map((chapter, index) => ({
        ...chapter,
        chapterIndex: String(data.chapters.length - index).padStart(String(data.chapters.length).length, '0'),
        displayTitle: _getModifiedChapterTitle(chapter.title, chapter.id),
        displayTime: ReturnFormattedDateFromUtcSecs(chapter.last_updated),
      }));
      chaptersOriginalCopy = updatedChapters;
      setChapters(updatedChapters);
    }
  }, [data]);

  useEffect(() => {
    doFetch(`${ApiUrls.mangaInfo}${mangaId}/`);
  }, [mangaId]);

  const _getModifiedChapterTitle = (chapterTitle, chapterId) => {
    const regex = new RegExp(`\\b${String(chapterId)}\\b`);
    if (chapterTitle.search(regex) > -1) return chapterTitle;

    const titleWords = chapterTitle.split(' ');
    for (let i = 0; i < titleWords.length; i++) {
      if (titleWords[i].search('Chapter') > -1) {
        const subTitleSplitted = titleWords[i].split('Chapter');
        const lastIndex = subTitleSplitted.length - 1;
        subTitleSplitted[lastIndex] = ` ${chapterId} ${subTitleSplitted[lastIndex]}`;
        titleWords[i] = subTitleSplitted.join('Chapter');
      }
    }

    return titleWords.join(' ');
  };

  const _returnChapterPath = (chapterId, mangaTitle) => {
    const path = `chapter/${mangaId}-${chapterId}-${SanitiazeTitle(mangaTitle)}`;
    return path;
  };

  const _onReadEpisodeClick = () => {
    const id = mangaReadPos ? mangaReadPos.chapterId : data.chapters[data.chapters.length - 1].id;
    const path = _returnChapterPath(id, data.title);

    history.push(path);
  };

  const _onChapterChangeText = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const updatedChapters = chaptersOriginalCopy.filter((chapter) => {
      const searchOnText = `${chapter.chapterIndex} ${chapter.displayTitle}`;
      return searchOnText.toLowerCase().includes(value);
    });
    setChapters(updatedChapters);
  };

  const _onReload = () => {
    retryFetch();
  };

  if (apiError && !data) {
    return (
      <ErrorView
        status = "500"
        title = "500"
        subTitle = "Something, went wrong"
        onReload = {_onReload}
      />
    );
  }

  return (
    <div className = "mangaDetailsWrapper">
      {isLoading || !data ? <div className = "mangaDetailsSpinner"><Spin size = "large" /></div> : (
        <>
          <div className = "mangaDetailsCardWrapper">
            <div className = "mangaDetailsCoverWrapper" style = {{}}>
              <LazyLoadImage src = {data.image} />
            </div>
            <div className = "mangaDetailsCardContentWrapper">
              <div className = "mangaDetailsCardContentTagWrapper">
                {data.categories.map((category) => (
                  <Tag key = {category} style = {{ margin: '2px' }}>{category}</Tag>
                ))}
                <Tag
                  key = "status"
                  color = {ReturnMangaStatusInfo(data.status).color}
                  style = {{ margin: '2px' }}
                >
                  {ReturnMangaStatusInfo(data.status).title}
                </Tag>
              </div>
              <div className = "mangaDetailsCardContentInfo">
                <Typography.Title level = {3}>{data.title}</Typography.Title>
                <Typography.Text level = {3}>- {data.author}</Typography.Text>
              </div>
              <div className = "mangaDetailsButtonsWrapper insideCard">
                <MangaDetailsButtons
                  onReadChapter = {_onReadEpisodeClick}
                  onFavourite = {() => onFavouriteButtonClick(data)}
                  readPos = {mangaReadPos}
                  manga = {data}
                  isFavourite = {isMangaFavourite}
                />
              </div>
            </div>
          </div>
          <div className = "mangaDetailsButtonsWrapper outsideCard">
            <MangaDetailsButtons
              onReadChapter = {_onReadEpisodeClick}
              onFavourite = {() => onFavouriteButtonClick(data)}
              readPos = {mangaReadPos}
              manga = {data}
              isFavourite = {isMangaFavourite}
            />
          </div>
          <Tabs style = {{ margin: '12px 0px' }} defaultActiveKey = "1" size = "large" onChange = {() => {}}>
            <TabPane
              tab = {(
                <span className = "tabWrapper">
                  <ReadOutlined />
                  Chapters
                </span>
              )}
              key = "1"
            >
              <Input
                style = {{ marginBottom: 20, backgroundColor: '#383838' }}
                placeholder = "Search for chapter"
                onChange = {_onChapterChangeText}
              />
              <List
                size = "small"
                pagination = {{
                  showSizeChanger: true,
                }}
                grid = {{
                  column: 2, md: 2, sm: 1, xs: 1,
                }}
                dataSource = {chapters}
                renderItem = {(item) => (
                  <List.Item key = {item.index} className = "mangaDetailsChapterListItemWrapper">
                    <Link style = {{ width: '100%' }} to = {_returnChapterPath(item.id, data.title)}>
                      <List.Item.Meta
                        style = {{ alignItems: 'center' }}
                        avatar = {(
                          <div className = "mangaDetailsChapterListItemAvatar">
                            <Typography.Title
                              className = "mangaDetailsChapterListItemTitle"
                              type = "secondary"
                              level = {4}
                            >
                              {item.chapterIndex}
                            </Typography.Title>
                          </div>
                        )}
                        title = {item.displayTitle}
                        description = {
                          <Typography.Text type = "secondary">{item.displayTime}</Typography.Text>
                        }
                      />
                    </Link>
                    <Divider className = "mangaDetailsChapterListItemDivider" />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane
              tab = {(
                <span>
                  <InfoCircleOutlined />
                  Description
                </span>
              )}
              key = "2"
            >
              <Typography.Paragraph>{htmlEntityEncode(data.description)}</Typography.Paragraph>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>

  );
}, shouldStopMangaDetailsUpdate);

MangaDetails.propTypes = {
  mangaId: string.isRequired,
  isMangaFavourite: bool.isRequired,
  onFavouriteButtonClick: func.isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const MangaDetailsButtons = ({ onReadChapter, onFavourite, readPos, manga, isFavourite }) => (
  <div>
    <Button onClick = {onReadChapter} type = "primary" shape = "round">
      {readPos
        ? `Continue Reading Chapter ${readPos.chapterId}`
        : 'Read First Chapter'}
    </Button>
    <Button
      onClick = {onFavourite}
      type = "primary"
      shape = "round"
      style = {{ marginLeft: 4 }}
    >
      <FavouriteButton
        item = {manga}
        isFavourite = {isFavourite}
        onClick = {onFavourite}
      />
    </Button>
  </div>
);
