import React, { useState, useRef, useEffect } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';


export const FavourteButton = React.forwardRef(({
  mangaId, isMangaFavourited, onClick,
}, ref) => {
  const [iconClassName, setIconClassName] = useState('');
  const didMountRef = useRef(false);
  const isMangaFavourite = isMangaFavourited(mangaId);

  useEffect(() => {
    if (didMountRef.current) {
      if (isMangaFavourite) setIconClassName('favourited');
      else setIconClassName('');
    } else didMountRef.current = true;
  }, [isMangaFavourite]);

  const _onClick = (e) => {
    e.stopPropagation();
    onClick(mangaId);
  };

  const IconComponent = isMangaFavourite
    ? StarFilled : StarOutlined;

  return (
    <div className = "homeFavouriteButtonWrapper">
      <IconComponent
        ref = {ref}
        style = {{ fontSize: 16, padding: 3, color: isMangaFavourite ? '#FFD700' : 'inherit' }}
        onClick = {_onClick}
        className = {iconClassName}
      />
    </div>
  );
});
