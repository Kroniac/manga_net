import React from 'react';
import { Button, Divider, Result } from 'antd';
import './page_not_found.scss';
import { func, shape } from 'prop-types';

const PageNotFound = ({ history }) => {
  const _onBackHome = () => history.push('/');
  const _onTopMangas = () => history.push('/topmangas');

  return (
    <Result
      className = "pageNotFoundWrapper"
      status = "404"
      title = "404"
      subTitle = "Sorry, the page you visited does not exist."
      extra = {(
        <div>
          <Button onClick = {_onBackHome} type = "primary">Back Home</Button>
          <Divider type = "vertical" />
          <Button onClick = {_onTopMangas} type = "primary">Top Mangas</Button>
        </div>
      )}
    />
  );
};

PageNotFound.propTypes = {
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default PageNotFound;
