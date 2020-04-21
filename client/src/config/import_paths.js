export const Screens = {
  Home: () => require('../screens/home/home').default,
  Manga: () => require('../screens/manga').default,
  MangaChapter: () => require('../screens/manga_chapter/manga_chapter').default,
};

export const Libs = {
  Networking: () => require('../libs/networking'),
  Utils: () => require('../libs/utils'),
};


export const CustomHooks = {
  useLocalStorage: () => require('../hooks/useLocalStorage'),
  useDataApi: () => require('../hooks/useDataApi'),
  useFavourtiedManga: () => require('../hooks/useFavouritedManga'),
};

export const Urls = {
  ApiUrls: () => require('./api_urls'),
};

export const Components = {
  LazyLoadImage: () => require('../components/lazy_load_image/lazy_load_image'),
};
