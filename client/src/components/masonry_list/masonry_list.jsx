import React from 'react';
import MasonryLayout from 'react-masonry-layout';
import { arrayOf, bool, func, number, object, oneOfType, string } from 'prop-types';

import './masonry_list.less';

export const MasonryList = ({ items, renderItems }) => (
  <div className = "masonryListWrapper">
    <MasonryLayout
      id = "masonry-layout"
      sizes = {[{ columns: 1, gutter: 10 },
        { mq: '394px', columns: 2, gutter: 10 },
        { mq: '574px', columns: 3, gutter: 10 },
        { mq: '768px', columns: 4, gutter: 10 },
        { mq: '1024px', columns: 6, gutter: 10 }]}
    >
      {items.map((item, index) => (
        renderItems(item, index)
      ))}
    </MasonryLayout>
  </div>
);

MasonryList.propTypes = {
  items: arrayOf(oneOfType([string, number, bool, object])).isRequired,
  renderItems: func.isRequired,
};
