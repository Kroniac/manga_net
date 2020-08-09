import React, { useEffect } from 'react';
import { Empty, Typography } from 'antd';
import './favourite_mangas.less';

import { Components, CustomHooks } from '#config/import_paths';

const { MasonryList } = Components.MasonryList();
const { MangaCard } = Components.Cards();

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

    <MasonryList
      items = {Object.values(favouritedMangasById)}
      renderItems = {(item) => (
        <MangaCard
          key = {item.id}
          manga = {item}
          isMangaFavourite = {isMangaFavourited(item.id)}
          onFavouriteClick = {_onFavouriteButtonClick}
        />
      )}
    />

  );
};

export default FavouriteMangas;
