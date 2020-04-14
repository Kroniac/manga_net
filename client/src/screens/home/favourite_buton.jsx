import React from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';


export const FavourteButton = ({
  manga, isMangaFavourited, unfavouriteManga, favouriteManga,
}) => {
  const IconComponent = isMangaFavourited(manga.id)
    ? StarFilled : StarOutlined;

  return (
    <IconComponent onClick = {(e) => {
      e.stopPropagation();
      if (isMangaFavourited(manga.id)) unfavouriteManga(manga.id);
      else favouriteManga(manga.id);
    }}
    />
  );
};
