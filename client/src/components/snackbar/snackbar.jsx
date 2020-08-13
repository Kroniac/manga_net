import React, { PureComponent } from 'react';
import Styles from './snackbar.less';

export const Snackbar = ({ isActive, message }) => (
  <div
    className = {isActive ? ['snackbar', 'fadeIn'].join(' ') : ['snackbar', 'fadeOut'].join(' ')}
  >
    {message}
  </div>
);
