import React from 'react';
import { Button, Result } from 'antd';
import './error_view.less';

export const ErrorView = ({ title, status, subTitle, onReload }) => (
  <div className = "errorViewWrapper">
    <Result
      style = {{ padding: 0 }}
      status = {status}
      title = {title}
      subTitle = {subTitle}
      extra = {<Button onClick = {onReload} type = "primary">Reload</Button>}
    />
  </div>
);
