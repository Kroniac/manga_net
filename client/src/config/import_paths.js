/* eslint-disable global-require */
export const Screens = {
  Home: () => require('../screens/home/home').default,
  Manga: () => require('../screens/manga').default,
  MangaChapter: () => require('../screens/manga_chapter/manga_chapter').default,
  FavouriteMangas: () => require('../screens/favourite_mangas/favourite_mangas').default,
};

export const Libs = {
  Networking: () => require('../libs/networking'),
  Utils: () => require('../libs/utils'),
};

export const CustomHooks = {
  UseLocalStorage: () => require('../hooks/useLocalStorage'),
  UseDataApi: () => require('../hooks/useDataApi'),
  UseFavourtiedManga: () => require('../hooks/useFavouritedManga'),
};

export const Urls = {
  ApiUrls: () => require('./api_urls'),
};

export const Components = {
  LazyLoadImage: () => require('../components/lazy_load_image/lazy_load_image'),
};
