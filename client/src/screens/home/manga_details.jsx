
import {
  Button, Divider, Input, List, Spin, Tabs, Tag, Typography,
} from 'antd';
import { InfoCircleOutlined, ReadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import htmlEntityEncode from 'locutus/php/strings/html_entity_decode';

import { CustomHooks, Libs } from '#config/import_paths';


import { FavourteButton } from './favourite_buton';
import { ReturnMangaStatusInfo } from './utils';

const { TabPane } = Tabs;

const { SanitiazeTitle, ReturnFormattedDateFromUtcSecs } = Libs.Utils();

const { useDataApi } = CustomHooks.useDataApi();


const shouldStopMangaDetailsUpdate = (prevProps, nextProps) => {
  if (prevProps.mangaId !== nextProps.mangaId) return false;
  if (prevProps.isMangaFavourited(prevProps.mangaId) !== nextProps.isMangaFavourited(nextProps.mangaId)) {
    return false;
  }

  return true;
};

let chaptersOriginalCopy = [];

export const MangaDetails = React.memo(({
  mangaId, isMangaFavourited, onFavouriteButtonClick, history,
}) => {
  const [chapters, setChapters] = useState([]);
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `http://localhost:8000/mangas/manga_info/${mangaId}/`,
    null,
    false,
  );

  useEffect(() => {
    if (data !== null) {
      const updatedChapters = data.chapters.map((chapter, index) => ({
        ...chapter,
        chapterIndex: String(data.chapters.length - index).padStart(String(data.chapters.length).length, '0'),
        displayTitle: `Chapter ${chapter.index} ${chapter.title && chapter.title !== String(chapter.index) ? ` - ${chapter.title}` : ''}`,
        displayTime: ReturnFormattedDateFromUtcSecs(chapter.added_on),
      }));
      chaptersOriginalCopy = updatedChapters;
      setChapters(updatedChapters);
    }
  }, [data]);

  useEffect(() => {
    doFetch(`http://localhost:8000/mangas/manga_info/${mangaId}/`);
  }, [mangaId]);

  const _returnChapterPath = (chapterId, mangaTitle) => `chapter/${chapterId}-${SanitiazeTitle(mangaTitle)}`;

  const _onReadEpisodeClick = () => {
    const path = _returnChapterPath(data.chapters[data.chapters.length - 1].id, data.title);
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

  return (
    <div className = "mangaDetailsWrapper">
      {isLoading || !data ? <div className = "mangaDetailsSpinner"><Spin size = "large" /></div> : (
        <>
          <div className = "mangaDetailsCardWrapper">
            <div className = "mangaDetailsCoverWrapper">
              <img referrerPolicy = "no-referrer" alt = "example" src = {`https://cdn.mangaeden.com/mangasimg/${data.image}`} />
            </div>
            <div className = "mangaDetailsCardContentWrapper">
              <div className = "mangaDetailsCardContentTagWrapper">
                {data.categories.map((category) => (
                  <Tag key = {category} style = {{ margin: '2px' }}>{category}</Tag>
                ))}
                <Tag key = "status" color = {ReturnMangaStatusInfo(data.status).color} style = {{ margin: '2px' }}>{ReturnMangaStatusInfo(data.status).title}</Tag>
              </div>
              <div className = "mangaDetailsCardContentInfo">
                <Typography.Title level = {3}>{data.title}</Typography.Title>
                <Typography.Text level = {3}>- {data.author}</Typography.Text>
              </div>
              <div>
                <div className = "flexContainer">
                  <Button onClick = {_onReadEpisodeClick} type = "primary" shape = "round">
                    Read Chapter 1
                  </Button>
                  <Button onClick = {() => onFavouriteButtonClick(data.id)} type = "primary" shape = "round" style = {{ marginLeft: 4 }}>
                    <FavourteButton
                      mangaId = {data.id}
                      isMangaFavourited = {isMangaFavourited}
                      onClick = {onFavouriteButtonClick}
                    />
                  </Button>
                </div>
              </div>
            </div>
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
                style = {{ marginBottom: 20 }}
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
                renderItem = {(item, index) => (
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
                        description = {<Typography.Text type = "secondary">{item.displayTime}</Typography.Text>}
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
              <Typography.Text strong>{htmlEntityEncode(data.description)}</Typography.Text>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>

  );
}, shouldStopMangaDetailsUpdate);
