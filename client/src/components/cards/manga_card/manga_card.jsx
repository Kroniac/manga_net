import React from 'react';
import { Typography } from 'antd';
import { bool, func, number, shape, string } from 'prop-types';
import './manga_card.less';

import { Components } from '#config/import_paths';

const { FavouriteButton } = Components.Buttons();
const { LazyLoadImage } = Components.LazyLoadImage();

const GetImageUrl = (link) => {
  const linkSplitted = link.split('.com/');
  return `https://avt.mkklcdnv6temp.com/${linkSplitted[1]}`;
};

const MangaCard = ({ manga, isMangaFavourite, onFavouriteClick, className, onShowDetails }) => (
  <figure className = {['mangaCardWrapper', className].join(' ')}>
    <div onClick = {() => onShowDetails(manga)} className = "mangaCardImageWrapper">
      <div className = "mangaCardExtraInfoWrapper">
        <Typography.Title className = "mangaCardShowDetailsWrapper" level = {4}>
          Show Details
        </Typography.Title>
      </div>
      <LazyLoadImage
        src = {GetImageUrl(manga.image)}
        style = {{ width: 170, height: (manga.image_height / manga.image_width) * 170 }}
        placeholderStyles = {{ width: 170, height: (manga.image_height / manga.image_width) * 170 }}
      />
    </div>
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
