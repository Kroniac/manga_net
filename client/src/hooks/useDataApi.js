import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export const useDataApi = (initialUrl, initialData, skipOnMount = false) => {
  const didMountRef = useRef(false);

  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(!skipOnMount);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!skipOnMount || didMountRef.current) {
      _fetchData();
    } else didMountRef.current = true;
  }, [url]);

  const _fetchData = async () => {
    setApiError(false);
    setIsLoading(true);
    try {
      const result = await axios(url);
      setData(result.data);
    } catch (error) {
      setApiError(error);
    }
    setIsLoading(false);
  };

  const retry = () => {
    _fetchData();
  };

  return [{ data, isLoading, apiError }, setUrl, _fetchData];
};

// export default useDataApi;
