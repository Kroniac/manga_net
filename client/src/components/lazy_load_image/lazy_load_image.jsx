import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { number, objectOf, oneOfType, string } from 'prop-types';
import { Urls } from '#config/import_paths';

const { ApiUrls } = Urls.ApiUrls();

export const LazyLoadImage = ({ src, placeholderStyles, ...props }) => {
  const [imageBinary, setImageBinary] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const placeholderRef = useRef();
  const didUnmountRef = useRef(false);
  const cancelToken = useRef(null);

  useEffect(() => {
    _fetchImage(src);
    cancelToken.current = Axios.CancelToken.source();
    const options = {
      root: null,
      rootMargin: '200px 0px 700px 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          _fetchImage(src);
          observer.disconnect();
        }
      });
    }, options);

    observer.observe(placeholderRef.current);
    return () => {
      didUnmountRef.current = true;
      cancelToken.current.cancel('Cancelling in cleanup');
      observer.disconnect();
    };
  }, []);

  const _fetchImage = async (imageLink) => {
    const reqConfig = {
      url: ApiUrls.mangaChapterImage,
      data: {
        link: imageLink,
      },
      method: 'POST',
      cancelToken: cancelToken.current.token,

    };
    const i = await Axios(reqConfig)
      .then((res) => Promise.resolve(`data:image/png;base64,${res.data.image_binary}`))
      .catch((err) => console.log(err));

    if (didUnmountRef.current) return;
    setImageBinary(i);
  };

  const ImagePlaceHolder = () => (
    <div
      ref = {placeholderRef}
      className = "imagePlaceHolder"
      style = {{ height: 500, paddingTop: 20, ...placeholderStyles }}
    >
      <div style = {{ color: 'white', fontWeight: 'bold' }}>Loading...</div>
    </div>
  );

  return (
    <div>
      {!isImageLoaded ? <ImagePlaceHolder /> : null}
      {imageBinary
        // eslint-disable-next-line react/jsx-props-no-spreading
        ? <img {...props} alt = "mangaImage" src = {imageBinary} onLoad = {() => setIsImageLoaded(true)} />
        : null}
    </div>
  );
};

LazyLoadImage.propTypes = {
  src: string.isRequired,
  placeholderStyles: objectOf(oneOfType([string, number])),
};

LazyLoadImage.defaultProps = {
  placeholderStyles: {},
};
