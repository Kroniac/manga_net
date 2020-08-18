import React, { useEffect, useRef, useState } from 'react';
import StarFilled from '@ant-design/icons/StarFilled';
import StarOutlined from '@ant-design/icons/StarOutlined';
import { bool, func, shape, string } from 'prop-types';

import './favourite_button.less';

const FavouriteButton = React.forwardRef(({ item, isFavourite, onClick }, ref) => {
  const [iconClassName, setIconClassName] = useState('');
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      if (isFavourite) setIconClassName('favourited');
      else setIconClassName('');
    } else didMountRef.current = true;
  }, [isFavourite]);

  const _onClick = (e) => {
    e.stopPropagation();
    onClick(item);
  };

  const IconComponent = isFavourite
    ? StarFilled : StarOutlined;

  return (
    <div className = "favouriteButtonWrapper">
      <IconComponent
        ref = {ref}
        style = {{ fontSize: 16, padding: 3, color: isFavourite ? '#FFD700' : 'inherit' }}
        onClick = {_onClick}
        className = {iconClassName}
      />
    </div>
  );
});

FavouriteButton.propTypes = {
  item: shape({
    id: string.isRequired,
  }).isRequired,
  isFavourite: bool.isRequired,
  onClick: func.isRequired,
};

export default FavouriteButton;
