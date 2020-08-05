import React from 'react';
import { Empty, Typography } from 'antd';
import './favourite_mangas.less';

import { CustomHooks } from '#config/import_paths';

import { FavourteButton } from '../home/favourite_buton';

const { useFavouritedManga } = CustomHooks.UseFavourtiedManga();

const FavouriteMangas = () => {
  const { favouritedMangasById, isMangaFavourited, favouriteManga, unfavouriteManga } = useFavouritedManga();

  const _onFavouriteButtonClick = (manga) => {
    if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
    else favouriteManga(manga);
  };

  if (!Object.keys(favouritedMangasById).length) {
    return (
      <div className = "favouriteMangasEmptyWrapper">
        <Empty description = "You have no favourite mangas yet" />
      </div>
    );
  }

  return (
    <div className = "favouriteMangasWrapper">
      {Object.keys(favouritedMangasById).map((id) => (
        <figure key = {id}>
          <img alt = "example" referrerPolicy = "no-referrer" src = {favouritedMangasById[id].image} />
          <div className = "favouriteMangasTitleWrapper">
            <Typography.Text>{favouritedMangasById[id].title}</Typography.Text>
          </div>
          <div className = "favouriteMangasFavouriteButtonWrapper">
            <FavourteButton
              manga = {favouritedMangasById[id]}
              isMangaFavourite = {isMangaFavourited(favouritedMangasById[id].id)}
              onClick = {_onFavouriteButtonClick}
            />
          </div>
        </figure>
      ))}
    </div>
  );
};

export default FavouriteMangas;
