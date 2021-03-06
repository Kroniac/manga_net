import React from 'react';
import { Button, Empty } from 'antd';
import './favourite_mangas.less';

import { Components, CustomHooks, Libs } from '#config/import_paths';

const { MasonryList } = Components.MasonryList();
const { MangaCard } = Components.Cards();

const { SanitiazeTitle } = Libs.Utils();

const { useFavouritedManga } = CustomHooks.UseFavourtiedManga();

const FavouriteMangas = ({ history }) => {
  const { favouritedMangasById, isMangaFavourited, favouriteManga, unfavouriteManga } = useFavouritedManga();

  const _onFavouriteButtonClick = (manga) => {
    if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
    else favouriteManga(manga);
  };

  const _onCheckoutTopMangas = () => {
    history.push('/topmangas');
  };

  if (!Object.keys(favouritedMangasById).length) {
    return (
      <div className = "favouriteMangasEmptyWrapper">
        <Empty description = "You have no favourite mangas yet">
          <Button type = "primary" onClick = {_onCheckoutTopMangas}>Checkout Top Mangas</Button>
        </Empty>
      </div>
    );
  }

  const _onShowDetails = (manga) => history.push(`${manga.id}-${SanitiazeTitle(manga.title)}`);

  return (
    <MasonryList
      items = {Object.values(favouritedMangasById)}
      renderItems = {(item) => (
        <MangaCard
          key = {item.id}
          manga = {item}
          isMangaFavourite = {isMangaFavourited(item.id)}
          onFavouriteClick = {_onFavouriteButtonClick}
          onShowDetails = {() => _onShowDetails(item)}
        />
      )}
    />

  );
};

export default FavouriteMangas;
