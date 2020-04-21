import React, { useEffect, useRef, useState } from 'react';

export const LazyLoadImage = ({ placeholderHeight, rootRef, ...props }) => {
  const [showImage, setShowImage] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const placeholderRef = useRef();

  useEffect(() => {
    if (!showImage && placeholderRef.current) {
      const options = {
        root: null,
        rootMargin: '200px 0px 300px 0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { isIntersecting } = entry;

          if (isIntersecting) {
            setShowImage(true);
            // observer.disconnect();
          }
        });
      }, options);

      observer.observe(placeholderRef.current);
    }
  }, [showImage]);

  const ImagePlaceHolder = () => (
    <div
      ref = {placeholderRef}
      className = "imagePlaceHolder"
      style = {{ height: 500 }}
    >
      <div style = {{ color: 'white', fontWeight: 'bold' }}>Loading...</div>
    </div>
  );

  return (
    <div>
      {!isImageLoaded ? <ImagePlaceHolder /> : null}
      {showImage ? <img {...props} onLoad = {() => setIsImageLoaded(true)} /> : null}
    </div>
  );
};
