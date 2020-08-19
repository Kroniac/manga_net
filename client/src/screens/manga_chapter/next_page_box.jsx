import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import { func, string } from 'prop-types';
import animationData from './scroll_down.json';

const KEEP_SCROLLING = 0.3;
const ALMOST_THERE = 0.5;
const START_REDIRECT = 0.9;
export const NextPageBox = ({ chapterId, navigateToChapter }) => {
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const placeholderRef = useRef();
  useEffect(() => {
    if (!chapterId) return () => {};

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [KEEP_SCROLLING, ALMOST_THERE, START_REDIRECT],
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio >= START_REDIRECT) {
        navigateToChapter(chapterId);
      } else { setIntersectionRatio(entries[0].intersectionRatio); }
    }, options);

    observer.observe(placeholderRef.current);
    return () => observer.disconnect();
  }, []);

  const _getLabel = () => {
    if (intersectionRatio >= START_REDIRECT) return 'Next Chapter - Start Redirect';
    if (intersectionRatio >= ALMOST_THERE) return 'Next Chapter - Almost There';
    if (intersectionRatio >= KEEP_SCROLLING) return 'Next Chapter - Keep Scrolling';
    return 'Next Chapter - Keep Scrolling';
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  if (!chapterId) {
    <div className = "nextPageWrapper" ref = {placeholderRef}>
      <span className = "nextPageBoxLabel">
        You&apos;ve reached the end
      </span>
    </div>;
  }

  return (
    <div className = "nextPageWrapper" ref = {placeholderRef}>
      <span className = "nextPageBoxLabel">
        {_getLabel()}
      </span>
      <Lottie
        options = {defaultOptions}
        height = {200}
      />
    </div>
  );
};

NextPageBox.propTypes = {
  chapterId: string,
  navigateToChapter: func.isRequired,
};

NextPageBox.defaultProps = {
  chapterId: null,
};
