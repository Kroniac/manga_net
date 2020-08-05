import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export const useDataApi = (initialUrl, initialData, skipOnMount = false) => {
  const didMountRef = useRef(false);

  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(!skipOnMount);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (!skipOnMount || didMountRef.current) {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          const result = await axios(url);
          setData(result.data);
        } catch (error) {
          setIsError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    } else didMountRef.current = true;
  }, [url]);
  return [{ data, isLoading, isError }, setUrl];
};

// export default useDataApi;
