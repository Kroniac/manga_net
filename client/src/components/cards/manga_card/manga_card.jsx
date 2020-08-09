import React from 'react';
import { Typography } from 'antd';
import { bool, func, number, shape, string } from 'prop-types';
import './manga_card.less';

import { Components } from '#config/import_paths';

const { FavouriteButton } = Components.Buttons();

const MangaCard = ({ manga, isMangaFavourite, onFavouriteClick }) => (
  <figure className = "mangaCardWrapper">
    <img
      style = {{ width: 170, height: (manga.image_height / manga.image_width) * 170 }}
      alt = "example"
      referrerPolicy = "no-referrer"
      src = {manga.image}
    />
    <div className = "favouriteMangasTitleWrapper">
      <Typography.Text>{manga.title}</Typography.Text>
    </div>
    <div className = "favouriteMangasFavouriteButtonWrapper">
      <FavouriteButton
        item = {manga}
        isFavourite = {isMangaFavourite}
        onClick = {onFavouriteClick}
      />
    </div>
  </figure>
);

MangaCard.propTypes = {
  manga: shape({
    image: string.isRequired,
    image_height: number.isRequired,
    image_width: number.isRequired,
    title: string.isRequired,
  }).isRequired,
  isMangaFavourite: bool.isRequired,
  onFavouriteClick: func.isRequired,
};

export default MangaCard;
