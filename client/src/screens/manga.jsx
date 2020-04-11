import React from 'react';

const Manga = ({ match }) => (
  <pre>{JSON.stringify(match.params, null, 2)}</pre>
);

export default Manga;
